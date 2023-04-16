---
slug: traefik
title: Traefik, le reverse-proxy multi-provider
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: 'https://github.com/qjoly/'
  image_url: 'https://avatars.githubusercontent.com/u/82603435?v=4'
tags: [traefik, docker]
---

L'année dernière, j'ai dit que j'appréciais particulièrement **Caddy** qui était simple, pratique, rapide et efficace. Caddy permet, à partir d'une ligne aussi simple que :

```json
domain.tld {
  reverse_proxy 127.0.0.1:80
}
```

En plus de ça, Caddy va constamment vérifier l'expiration de vos certificats letsencrypt et de les renouveler automatiquement sans aucune interaction nécéssaire.
Caddy est également facile à déployer via Docker.

Que demander de plus ?

> De l'automatisation ?

Parfaitement, cher lecteur ! Vous m'étonnez toujours !
J'ai donc créé un Rôle Ansible générant ma configuration automatiquement à partir d'un dépôt Git avec les IP correspondant aux domaines que je souhaite utiliser.
Maintenant, à partir de ça, je peux faire un script Bash récupérant les ports de mes conteneurs, puis push sur mon Git les nouvelles redire….
> C'est une usine à gaz…

Et vous avez raison ! Ce système est obsolète en quelques secondes lorsqu'on utilise un système de *service discovery* permettant de récupérer mes services et automatiser l'ajout de ces services sur mon g…. Bon d'accord, toujours "*usine à gaz*" !

Pas le choix, je vais devoir en conséquence remplacer Caddy par quelque chose d'autre. Et justement : je sais exactement le soft à utiliser.

Place à **Traefik**, le RP (Reverse proxy) multi-provider avec du service discovery.

Cet article sur **Traefik** est en cours de rédaction, vous pouvez me suivre sur [twitter](https://twitter.com/TheBidouilleur) pour être au courant des prochaines écritures ainsi que mon avancement dans mes projets !

## Qu'est-ce que Traefik ?

![logo de traefik](https://i.imgur.com/XxOB7Fo.png)

Comme expliqué juste au-dessus, Traefik est un reverse-proxy qui se démarque des autres par son systeme de provider et de middleware. Il ne réinvente pas la roue, mais il est particulièrement efficace lorsque l'on a un grand nombre de redirections à paramétrer ou que nous avons des règles qui changent régulièrement.

[*si vous ignorez ce qu'est un reverse-proxy, je vous invite à consulter cet article de Ionos*](https://www.ionos.fr/digitalguide/serveur/know-how/quest-ce-quun-reverse-proxy-le-serveur-reverse-proxy/)

Traefik n'est **pas** fait pour vous si :

- Vous n'utilisez pas Docker, Kubernetes ou Consul
- Si vous avez peu de règles (et surtout si elles sont statiques)
- Vous ne vous souciez pas d'automatiser votre RP

et en revanche :
Traefik est **fait** pour vous si :

- Vos services sont répartis sur de nombreuses machines
- Vous avez un Swarm / Kubernetes

Traefik, ce n'est pas pour tout le monde. Mais il y a de nombreux cas, et de nombreux domaines où Traefik n'est pas employé alors qu'il le devrait.

## Comment fonctionne Traefik ?

Traefik se base sur un système de **Provider**. Un Provider est un moyen de récupérer les fameuses règles "domaine -> IP" de manière *automatique* (ou presque).
Par exemple, sur Caddy, notre provider (la manière dont on récupère notre configuration) est un simple fichier.
Notre seule manière d'automatiser Caddy se repose donc sur notre gestion de ce fichier. (le **Caddyfile**)

Et c'est justement cet unique provider qui va me faire pencher vers Traefik, qui possède une grande liste de provider. Parmis ces providers, nous avons :

- Docker
- Kubernetes / Rancher
- Redis
- des Fichiers classiques
- Une API Json

et en fonction des providers que l'on accorde à Traefik(et du contenu), celui-ci va s'adapter pour créer les redirections de manière automatique.

Nous allons tester ça directement dans notre premier Traefik de test !
On va avant-tout créer le réseau Docker qui permettra à notre reverse-proxy d'accéder aux conteneurs.

```bash
docker network create --driver=overlay traefik-net
```

et on va créer notre docker-compose contenant Traefik:

```yml
version: "3.7"

services:
  traefik:
    image: "traefik:v2.5"
    container_name: "traefik"
    hostname: "traefik"
    networks:
      - traefik-net
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./config:/etc/traefik"
networks:
  traefik-net:
    external: true
    driver: overlay
    name: traefik-net
```

Puis, dans un dossier **./config**, nous allons créer le fichier **traefik.yml** qui va contenir notre configuration, et nos providers.

```yml
# fichier traefik.yml, à mettre dans un dossier ./config
---
log:
  level: "INFO"
  format: "common"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"   # Provider Docker sur la machine locale
    exposedByDefault: false                   # Par défaut, les conteneurs ne possèdent pas de redirection
    network: "traefik-net"                    # Le réseau docker dans lequel il y aura.
    watch: true   
  file:
    filename: "/etc/traefik/dynamic.yml"      # Fichier contenant les règles statiques
    watch: true                               # Va actualiser son contenu régulièrement pour mettre les règles à jour
  providersThrottleDuration: 10               # Va actualiser les règles chaque 10s

api:                                          # Va rendre le Dashboard de Traefik accessible en http
  dashboard: true
  debug: false
  insecure: true

entryPoints:                                  # Notre entrée, nous acceptons les requetes via https sur le port 80
  insecure:
    address: ":80"
```

Et notre fichier **dynamic.yml** qui contiendra nos règles statiques :

```yml
http:
  routers:
    helloworld-http:
      rule: "Host(`hello-world.tld`)" 
      service: hello-world
      entryPoints:
        - insecure 

  services:
    hello-world:
      loadBalancer:
        servers:
           - url: "http://192.168.128.1:80"
```

En démarrant Traefik, on on remarque qu'il va se mettre à jour chaque 10s en interrogeant le daemon Docker ainsi que le fichier.

On peut maintenant créer notre premier conteneur à rajouter de cette manière:

```yml
version: "3.7"

services:
  whoami:
    image: "containous/whoami"
    container_name: "whoami"
    hostname: "whoami"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.entrypoints=insecure"
      - "traefik.http.routers.whoami.rule=Host(`whoami-tf.thebidouilleur.xyz`)"
      - "traefik.http.routers.whoami.tls.certresolver=letsencrypt"

networks:
  default:
    external:
      name: traefik_net

```

Nous avons alors créé la règle "whoami-tf.thebidouilleur.xyz" vers notre conteneur. On remarque que **nous n'avons pas exposé de port**, Traefik va passer par le réseau interne *traefik_net* pour accéder au service.  C'est une couche de sécurité à ne pas négliger, vos services seront accessibles entre eux, et via le reverse-proxy.

### Gestion des certificats https

Maintenant, si vous passez par internet pour accéder à vos services.. C'est peut-être pratique d'avoir du https, et justement : Traefik gèrera vos certificats de manière automatique.
Traefik utilise l'api gratuite de **LetsEncrypt** pour obtenir ses certificats, nous devons donc créer une entrée dédiée au https sur le port 443

On va donc mettre à jour notre configuration comme ceci :

```yml
entryPoints:
  insecure:
    address: ":80"
    http:
     redirections:
       entryPoint:
         to: secure
  secure:
    address: ":443" 

certificatesResolvers:
  letsencrypt:
    acme:
      email: "contact@thoughtless.eu"
      storage: "/etc/traefik/acme.json"
        #      caServer: "https://acme-staging-v02.api.letsencrypt.org/directory"
      keyType: "EC256"
      httpChallenge:
        entryPoint: "insecure"
```

Redémarrez Traefik, et celui-ci tentera de générer les certificats pour les domaines configurés !
En accédant à la page suivante : *<http://traefik:8080>* ,vous aurez un dashboard sur lequel vous verrez les routeurs "domaines d'entrés", les "services" (redirections), et si ce symbole apparait : Traefik a bien appliqué un certificat à ce router.

Il est également possible, avec un peu plus de configuration, d'obtenir un certificat **Wildcard** (*certificat valide pour un domaine entier*)  avec Traefik. Pour le moment : je n'ai pas besoin d'un wildcard pour mes domaines.
Si le sujet vous intéresse, voici un lien pour approfondir ça : [Certificat Wildcard Traefik](https://computerz.solutions/traefik-ssl-wildcard-letsencrypt/)

Et si on allait plus loin ?

### Traefik et Swarm

Depuis maintenant un peu plus d'un an, mes conteneurs tournent sur un **cluster swarm** *(Si vous ne savez pas ce qu'est un Swarm, je vous renvoie vers [cet article](https://thebidouilleur.xyz/posts/DockerSwarm/))*, et ça peut complexifier les choses lorsque les labels (permettant à traefik de comprendre quel docker correspond à quel domaine) fonctionnent un peu différemment.

Les labels classiquent ne fonctionnent que sur la machine *hote* (par exemple: *Worker01*) mais si Traefik est sur la machine *Worker02*, les labels des conteneurs ne seront pas visibles.
Pour palier à ce problème, nous devons utiliser les mêmes labels … dans la section **deploy** d'un docker-compose.

Voici le docker-compose whoami adapté pour Swarm:

```yaml
version: "3.7"

services:
  whoami:
    image: "containous/whoami"
    container_name: "whoami"
    hostname: "whoami"
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.whoami.entrypoints=insecure"
        - "traefik.http.routers.whoami.rule=Host(`whoami-tf.thebidouilleur.xyz`)"
        - "traefik.http.routers.whoami.tls.certresolver=letsencrypt"

networks:
  default:
    external:
      name: traefik_net

```

:::danger
à noter que cette structure ne fonctionne qu'avec les docker-compose de version >3.7
:::

Et pour que le conteneur traefik puisse lire ces labels.. Il doit être sûr **un manager** du swarm. Nous devons donc également mettre à jour notre docker-compose de Traefik :

```yaml
version: "3.7"

services:
  traefik:
    image: "traefik:v2.5"
    container_name: "traefik"
    hostname: "traefik"
    networks:
      - traefik-net
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./config:/etc/traefik"
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.traefik.entrypoints=secure"
        - "traefik.http.routers.traefik.rule=Host(`traefik.forky.ovh`)"
        - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"
        - "traefik.http.services.traefik.loadbalancer.server.port=8080"


networks:
  traefik-net:
    external: true
    driver: overlay
    name: traefik-net
```

et nous pouvons le déployer dans le swarm avec la commande

```bash
docker stack deploy -c docker-compose.yml traefik
```

Autre spécificité du Swarm : Si le port d'écoute du service n'est **pas 80**, il faudra préciser à Traefik le port à utiliser. C'est ce qu'on peut voir sur le docker-compose ci-dessus avec `traefik.http.services.traefik.loadbalancer.server.port`, ça sera la dernière différence entre Traefik sur une machine standalone et un cluster.

Maintenant, comment faire si nous voulons créer une règle automatique avec une machine qui n'est **pas** dans notre swarm ?

## Astuce pour machines isolées du cluster

Jusque-là, nous avons **2 providers** : le provider *Docker (pour le cluster)* et le provider *file* qui concerne les règles statiques *(comme mon pfsense)*.
Traefik n'accepte pas qu'on ait *2 providers du même type*, ce qui veut dire que je ne peux pas surveiller le daemon docker de ma machine, ainsi que celui d'une machine distante.

Par exemple, mon *Gitea* est un conteneur qui n'est pas dans mon swarm, et comme c'est une machine que je redeploie régulièrement (et donc IP différente), j'aimerai beaucoup laisser traefik faire son travail, mais en le laissant en même temps s'occuper du swarm !

C'est là que j'ai découvert un projet Github répondant à ce besoin : [Traefik-pop](https://github.com/jittering/traefik-kop)

Le schéma ASCII du dépôt parle de lui-même :

```scheme
                        +---------------------+          +---------------------+
                        |                     |          |                     |
+---------+     :443    |  +---------+        |     :3000|  +------------+     |
|   WAN   |--------------->| traefik |--------------------->|    gitea   |     |
+---------+             |  +---------+        |          |  +------------+     |
                        |       |             |          |                     |
                        |  +---------+        |          |  +-------------+    |
                        |  |  redis  |<---------------------| traefik-kop |    |
                        |  +---------+        |          |  +-------------+    |
                        |             swarm   |          |             gitea   |
                        +---------------------+          +---------------------+

```

*J'ai un peu modifié le dessin pour qu'il colle à mon exemple*.

Si le dessin est un peu compliqué : Nous allons créer une base de donnée **Redis** *(C'est plus facile pour moi de le mettre sur le swamr, mais théoriquement, vous pouvez la mettre où vous voulez)*. Cette bdd, sera utilisée en tant que **provider Traefik** pour mettre à jour les règles automatiquements !
Le docker-compose de mon gitea devient donc :

```yml
version: "3"
networks:
  gitea:
    external: false
services:
  server:
    image: gitea/gitea:latest
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GIT_DISCOVERY_ACROSS_FILESYSTEM=1
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "2200:22"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.gitea.entrypoints=secure"
      - "traefik.http.routers.gitea.rule=Host(`git.thoughtless.eu`)"
      - "traefik.http.routers.gitea.tls.certresolver=letsencrypt"
      - "traefik.http.services.gitea.loadbalancer.server.port=3000"
```

En redémarrant Traefik, et en accédant au panel, on remarque un nouvel provider : *Redis*.

et en visualisant les règles : nous avons bien notre règle concernant Gitea !

# Conclusion

Traefik est un des meilleurs reverses-proxy pour les infrastructures grandissantes. Celui-ci s'adapte à de nombreux besoins en proposant une couche d'automatisation sans négliger la gestion statique et manuelle.
Celui-ci demande un temps d'adaptation qui sera vite rentabilisé.

J'espère que ce reverse-proxy vous inspirera pour une infrastructure scalable simple et fiable.

Merci de m'avoir lu !
