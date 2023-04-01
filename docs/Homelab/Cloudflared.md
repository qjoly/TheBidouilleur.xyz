---
slug: cloudflared
title: Exposer vos conteneurs sans NAT avec Cloudflared
---

[Vous trouverez ici la documentation officielle de Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)

Cloudflare est une entreprise qui est réputée pour son anti-ddos assez performant. Celui-ci se place en tant que serveur de nom pour nom de domaine et va faire l'intermediaire entre votre site et l'utilisateur.
Personnellement, je m'en sers surtout pour cacher l'IP publique de mon réseau et permettre à tous d'accéder à mes sites.

Et justement, cloudflare vient de sortir un petit programme assez pratique : **cloudflared**.

## Qu'est ce que Cloudflared?

Cloudflared (qui se base sur Cloudflare Tunnel) permet de rendre une application accessible sur internet depuis un domaine géré par cloudflare **sans ouvrir de port** !
En temps normal, voici ce qu'il se passe :

![before cloudflared](/img/before-cloudflared.png)

Avantages:

- Facile à faire
  
Inconvenients:

- Mon IP est visible de tous
- Difficultées si IP changeante

Et voici comment fonctionne un site avec un tunnel Cloudflared.
![after-cloudflared](/img/after-cloudflared.png)

Avantages:

- Mon IP est cachée
- Système de cache (économie de bande passante)

Inconvenients:

- Cloudflare n'est pas forcement fiable
- Complexe

Cloudflared n'est pas forcement **la bonne solution** pour de nombreux contextes, (*et interdit de s'en servir en Prod ou avec des données sensibles*) mais dans mon cas (*quelques conteneurs simples, Blogs, gitea etc..), c'est exactement ce qu'il me faut.

## Comment Utiliser Cloudflared ?

Concretement, on peut utiliser Cloudflared en tant que Daemon classique. Mais étant donné que mon infrastructure est basée sur Docker, je vais continuer à utiliser cette solution, et même pour Cloudflared.

### Installer Cloudflared (via Docker)

On va créer un dossier qui accueillera notre configuration Cloudflared :

```bash
mkdir $HOME/cloudflared
```

Nous allons nous baser sur l'image Docker **msnelling/cloudflared** qui facilite beaucoup la configuration. ([Code-source ici](https://github.com/msnelling/docker-cloudflared))
Et nous allons executer la commande  dans :

```bash
docker run -v ${HOME}/cloudflared:/root/.cloudflared msnelling/cloudflared cloudflared tunnel login
```

Résultat:
![first run of cloudflared](/img/cloudflared-first-run.png)
Vous devez indiquer également le domaine utilisé pour ce tunnel.

Une fois connecté (via l'URL fournise), un message vous confirmera et vous aurez un fichier **cert.pem** dans votre dossier *$HOME/cloudflared*. Cloudflared s'en servira pour accéder à votre compte.

Maintenant, nous devons créer le tunnel ( qu'on pourra utiliser pour plusieurs domaines/applications )

```bash
docker run -v ${HOME}/cloudflared:/etc/cloudflared msnelling/cloudflared cloudflared tunnel create coffee_time
```

:::tip
Remplacez *coffee_time* par le nom que vous voulez donner à votre tunnel.
:::

à la fin de la commande, vous devrez avoir un fichier terminant par **.json**, le nom correspond à l'identifiant de votre tunnel, copiez le.
Créez le fichier **$HOME/cloudflared/config.yaml**

```yaml
tunnel: your-tunnel-id-here
ingress:
        - hostname: test.thoughtless.eu     # Change the domaine here
          service: http://nginx:80          # http://container_name:port
        - service: http_status:404
```

Nous sommes connectés, notre tunnel est créé, nous pouvons maintenant démarrer cloudflared.

Créez le fichier **docker-compose.yml** avec le contenu suivant :

```yaml
version: '2'
services:
   cloudflared:
        image: msnelling/cloudflared
        container_name: cloudflared
        volumes:
            - ${HOME}/cloudflared:/etc/cloudflared
        command: /usr/local/bin/cloudflared tunnel --no-autoupdate run
        restart: always
        networks:
            - cloudflared
networks:
  cloudflared:
    name: cloudflared
```

```bash
docker-compose up -d
docker-compose logs
```

Si aucune erreur n'est présente ([exemple ici](https://i.imgur.com/Ehyao5E.png)), on peut directement utiliser cloudflared pour un autre conteneur.

Comme nous avons renseigné que le conteneur nommé "*nginx*" sera accessible via le domaine *test.thoughtless.eu*, nous devons déployé un conteneur du même nom, dans le même réseau que le conteneur *cloudflared*

```yaml
version: '2'
services:
  nginx:
    image: nginx
    networks:
      - cloudflared
networks:
  cloudflared:
    external: true
    name: cloudflared
```

Démarrez le via la commande:

```bash
docker-compose up -d
```

La dernière étape est de se connecter ànotre panel cloudflare pour créer une règle cname vers notre tunnel.
Pour cela, vous devrez rajouter une entrée *CNAME* vers *id-du-tunnel.cfargotunnel.com*.

Une fois validé, je peux accéder au conteneur Nginx via le domaine rentré dans le **config.yaml**

![It works](https://i.imgur.com/lrSkfrX.png)
