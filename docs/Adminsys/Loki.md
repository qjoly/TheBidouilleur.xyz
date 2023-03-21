---
title: Loki - Surveillance de logs
slug: loki
tags:
  - infra
---

## Introduction 

Depuis que jai commencé l'informatique (depuis un peu moins d'une dizaine d'année), je ne me suis jamais préoccupé de comment je visualisais mes logs. Un petit *view* par ci, un gros *grep* par là.. mais aucune gestion avancée. 

J'ai basé ma supervision sur Zabbix et Grafana qui m'affichent les metriques de chaque machine virtuelle individuellement. Et même si c'est bien pratique, je n'ai presque aucun visuel sur l'état de mes applications ! 
J'ai donc décidé de me renseigner sur Graylog et Elastic Search proposant une stack assez fiable et facile à mettre en place. Puis en voyant les ressources demandées, j'ai remis ce besoin à "plus tard", et j'ai remis "plus tard" à l'année prochaine.. Et ainsi de suite ! 

>> 2 ans plus tard…

Aujourd'hui *(Decembre 2021)*, une grosse faille 0day est dévoilée concernant Log4J, et on ne parle pas d'une "petite" faille, c'est une bonne grosse RCE comme on les aime ! 

Je ne suis pas concerné par Log4J (ce n'est pas utilisé dans Jenkins et je n'ai aucune autre application basée sur Java ouverte sur internet) mais j'aurais bien aimé savoir si mon serveur a été scanné par les mêmes IP que l'on retrouve sur les listes à bannir. 
Et c'est avec cet évenement que j'ai décidé de me renseigner sur *"Comment centraliser et visualiser ses logs?"*.


## Le choix du stack 

Une stack est un groupement de logiciel permettant de répondre à une fonction.
Un exemple classique est celui du stack "G.I.T." *(et non pas comme l'outil de versioning!)* :

- Grafana
- Influxdb
- Telegraf 

C'est une stack qui permet de visualiser les mectriques de différentes machines, InfluxDB est la base de donnée stockant les informations, Telegraf est l'agent qui permet aux machines d'envoyer les métriques, et Grafana est le service web permettant de les visualiser.

Comme dit dans l'introduction, j'utilise Zabbix qui me permet de monitorer et collecter les metriques, et j'y ai couplé Grafana pour les afficher avec beaucoup de paramètrages. 

Dans la centralisation de logs (et la visualisation), on parle souvent du stack suivant:

**__ELK__**:

- ElasticSearch
- Logstash
- Kibana

Mais cette stack n'est pas à déployer dans n'importe quel environnement, elle est efficace, mais très lourde. 

Dans ma quête pour trouver une stack permettant la centralisation de logs, j'apprécierais utiliser des services déjà existant dans mon infra. 
Et voici le miracle à la mode de 2021 ! La Stack GLP : **Grafana, Loki, Promtail**.

### Stack GLP

Là où j'apprécie particulièrement cette stack, c'est qu'elle est légere. Nettement plus légère que ELK qui, même si très efficace, demande beaucoup de ressources.

![](https://i.imgur.com/oWOwWsJ.png)

De même que Graylog2 + Elastic Search *(une très bonne alternative)* qui demande presque un serveur baremetal low-cost à lui seul.
![](https://i.imgur.com/FkAq6sO.png)

Alors que Grafana / Loki ne demanderont que 2Go pour fonctionner efficacement et sans contraintes. (et 2Go si les services sont très solicités, je peux donc utiliser moins de RAM)


## Installer notre stack

Je pars du principe que tout le monde sait installer un Grafana, c'est souvent vers ce service que les gens commencent l'auto-hébergement et la supervision.

Mais si vous n'avez pas encore installé votre Grafana, [voici la documentation officielle](https://grafana.com/docs/grafana/latest/installation/)

Par simplicité, je ne vais pas utiliser Docker dans cette installation. 

### Partie Loki

J'ai installé Loki sur un conteneur LXC en suivant le guide sur le site officiel [ici](https://grafana.com/docs/loki/latest/installation/local/).
Je passe par systemd pour lancer l'exécutable, et je crée à l'avance un fichier avec le minimum nécéssaire à Loki pour fonctionner.

```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h
```
Après seulement 2-3 minutes de configuration, notre Loki est déjà disponible ! 

On peut dès maintenant l'ajouter en tant que *datasource* sur notre Grafana :

![](https://i.imgur.com/G3tWx1r.png)

*(Dans mon cas, la base Loki est installée sur la même machine que mon Grafana)*

Vous aurez une erreur de Grafana si votre base Loki est vide, nous allons directement voir comment envoyer nos premiers logs.

### Partie Promtail

Promtail est l'agent qui va nous permettre d'envoyer nos logs à Loki, j'ai écris un role Ansible assez simple me permettant d'installer notre agent sur de nombreuses machines en surveillant les logs provenant de Docker, varlog et syslog. 

Voici ma template Jinja2 à propos de ma configuration : 
```jinja2
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
{% if loki_url is defined %}
  - url: {{ loki_url }}
{% endif %} 


scrape_configs:


- job_name: authlog
  static_configs:
  - targets:
      - localhost
    labels:
{% if ansible_hostname is defined %}
      host: {{ ansible_hostname }}
{% endif %} 
      job: authlog
      __path__: /var/log/auth.log


- job_name: syslog
  static_configs:
  - targets:
      - localhost
    labels:
{% if ansible_hostname is defined %}
      host: {{ ansible_hostname }}
{% endif %}
      job: syslog
      __path__: /var/log/syslog

- job_name: Containers
  static_configs:
  - targets:
      - localhost
    labels:
{% if ansible_hostname is defined %}
      host: {{ ansible_hostname }}
{% endif %}
      job: containerslogs
      __path__: /var/lib/docker/containers/*/*-json.log

- job_name: DaemonLog
  static_configs:
  - targets:
      - localhost
    labels:
{% if ansible_hostname is defined %}
      host: {{ ansible_hostname }}
{% endif %}
      job: daemon
      __path__: /var/log/daemon.log

```
*Si vous n'êtes pas à l'aise avec des templates Jinja2, vous trouverez une version "pure" de la config [ici](https://git.thoughtless.eu/Cinabre/rolePromtailAgent/src/branch/master/README.md)*

Vous pouvez bien évidemment adapter cette template à vos besoins. Mon idée première est d'avoir une "base" que je peux mettre sur chaque machine *(sachant aussi que si aucun log n'est disponible, Promtail ne causera pas une erreur en ne trouvant pas les fichiers)* 

Une fois Promtail configuré, on peut le démarrer.

via l'executable directement : 
```bash
/opt/promtail/promtail -config.file /opt/promtail/promtail-local-config.yaml
``` 

ou via systemd *(automatique si vous passez par mon role Ansible)* :  
`systemctl start promtail` 

Une fois cet agent installé sur vos machines, nous pouvons d'ores et déjà lancer des recherches sur Grafana.

###  Faire des requetes à Loki depuis Grafana

Sur Grafana, nous avons un onglet "Explore". Celui-ci va nous donner accès à Loki en écrivant des requetes, celles-ci sont assez simples, et surtout en utilisant l'outil "click-o-drome" en dépliant le *Log Browser* 
![](https://i.imgur.com/UNL2s6m.png)

Avec la template que je vous ai donné, vous aurez 4 jobs : 

- daemon
- authlog
- syslog
- containersjobs

Ces jobs permettent de trier les logs. Nous allons donc sélectionner la machine *"Ansible"*, puis demander le job *"authlog"*.
Je commence par cliquer sur Ansible, puis Authlog. Grafana me proposera exactement si je souhaite choisir un fichier spécifique. Si on ne précise pas de fichier(*filename*) Grafana prendra tous les fichiers *(donc aucune importance si nous n'avons qu'un seul fichier)* 

*(vous remarquerez plus tard que dès notre 1ere sélection, grafana va cacher les jobs/hôte/fichier qui ne concernent pas notre début de requête)* 

![](https://i.imgur.com/MWFQCyl.png)

En validant notre requête (*bouton __show logs__*)

![](https://i.imgur.com/RCpb5GI.png)

Nous avons alors le résultat de la requête vers Loki dans le lapse de temps configuré dans Grafana (1h pour moi).

Nous allons maintenant commencer à **trier** nos logs !
 
En cliquant sur le petit "***?***" au dessus de notre requete, nous avons une
"cheatsheet" résumant les fonctions basiques de Loki. 
Nous découvrons comment faire une recherche exacte avec *|=*, comment ignorer
les lignes avec *!=* et comment utiliser une expression regulière avec *|~*

Je vous partage également une cheatsheet un peu plus complète que j'ai trouvé
sur un blog : [ici](https://megamorf.gitlab.io/cheat-sheets/loki/) 

Ainsi, on peut directement obtenir des logs un peu plus colorés qui nous permettrons de cibler l'essentiel ! 

![](https://i.imgur.com/HzTwmwW.png)


(L'idée est de cibler les logs sympas avec les couleurs qui vont avec) 

## Conclusion 
Si on entend souvent parler de la suite ELK, ça n'est pas non-plus une raison pour s'en servir à tout prix ! Loki est une bonne alternative proposant des fonctionnalités basiques qui suffiront pour la plupart.
