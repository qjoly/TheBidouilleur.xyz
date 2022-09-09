# Loki
# Introduction 

Depuis que jai commencé l'informatique (depuis un peu moins d'une dizaine d'année), je ne me suis jamais préoccupé de comment je visualisais mes logs. Un petit *view* par ci, un gros *grep* par là.. mais aucune gestion avancée. 

J'ai basé ma supervision sur Zabbix et Grafana qui m'affichent les metriques de chaque machine virtuelle individuellement. Et même si c'est bien pratique, je n'ai presque aucun visuel sur l'état de mes applications ! 
J'ai donc décidé de me renseigner sur Graylog et Elastic Search proposant un stack assez fiable et facile à mettre en place. Puis en voyant les ressources demandées, j'ai remis ce besoin à "plus tard", et j'ai remis "plus tard" à l'année prochaine.. Et ainsi de suite ! 

>> 2 ans plus tard...

Aujourd'hui *(Decembre 2021)*, une grosse faille 0day est dévoilée concernant Log4J, et on ne parle pas d'une "petite" faille, c'est une bonne grosse RCE comme on les aime ! 

Je ne suis pas concerné par Log4J, ce n'est pas utilisé dans Jenkins, et je n'ai aucune autre application basée sur Java ouverte sur internet. Mais j'aurai bien aimé savoir si mon serveur a été scanné par les mêmes IP que l'on retrouve sur les listes à bannir. 
Et c'est avec cet évenement que j'ai décidé de me renseigner sur *"Comment centraliser et visualiser ses logs?"*.


# Le choix du stack 

Un stack est un groupement de logiciel permettant de répondre à une fonction.
Un exemple classique est celui du stack "G.I.T." *(et non pas comme l'outil de versioning!)* :

- Grafana
- Influxdb
- Telegraf 

C'est un stack qui permet de visualiser les mectriques de différentes machines, InfluxDB est la base de donnée stockant les informations, Telegraf est l'agent qui permet aux machines d'envoyer les métriques, et Grafana est le service web permettant de les visualiser.

Comme dit dans l'introduction, j'utilise Zabbix qui me permet de monitorer et collecter les metriques, et j'y ai couplé Grafana pour les afficher avec beaucoup de paramètrages. 

Dans la centralisation de logs (et la visualisation), on parle souvent du stack suivant:

**__ELK__**:

- ElasticSearch
- Logstash
- Kibana

Mais ce stack n'est pas à déployer dans n'importe quel environnement, il est efficace, mais très lourd. 

Dans ma quête pour trouver un stack permettant la centralisation de logs, j'apprécierai utiliser des services que je dispose déjà.  
Et voici le miracle à la mode de 2021 ! Le Stack GLP : **Grafana, Loki, Promtail**.


## Stack GLP

Là où j'apprécie particulièrement ce stack, c'est qu'il est léger. Beaucoup
plus léger que ELK qui, même si très efficace, demande beaucoup.

![](https://i.imgur.com/oWOwWsJ.png)

De même que Graylog2 + Elastic Search (une très bonne alternative) qui demande presque un serveur baremetal low-cost à lui seul.
![](https://i.imgur.com/FkAq6sO.png)

Alors que Grafana / Loki ne demanderont que 2Go pour fonctionner efficacement et sans contraintes. (Grand maximum, à mon échelle : j'utiliserai beaucoup moins que 2Go)


# Installer notre stack

Je pars du principe que tout le sait installer un Grafana, c'est souvent vers ce service que les gens commencent l'auto-hebergement *(en même temps, les graphiques de grafana sont super sexy !)*. 

Mais si vous n'avez pas encore installé votre Grafana *(dans ce cas, quittez la salle et revenez plus tard)*, [voici un lien qui vous permettra de le faire assez rapidement](https://grafana.com/docs/grafana/latest/installation/)


Par simplicité, je ne vais pas utiliser Docker dans cette installation. 

## Partie Loki

J'ai installé Loki sur un conteneur LXC en suivant le guide sur le site officiel [ici](https://grafana.com/docs/loki/latest/installation/local/).
Je passe par systemd pour lancer l'executable, et je créé à l'avance un fichier
avec le minimum syndical (qui est disponible sur le github de Grafana)

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

Je n'ai pas pris la peine d'activer l'authentification en sachant que je suis dans un LAN avec uniquement mes machines virtuelles. Je considère pas que mon Loki comme un point sensible de mon infra. 

Après seulement 2-3 minutes de configuration, notre Loki est déjà disponible ! 


On peut dès maintenant l'ajouter en tant que *datasource* sur notre Grafana :
!()[https://i.imgur.com/G3tWx1r.png]

*(J'utilise localhost car la machine possédant le grafana héberge également le Loki)*

*Il se peut que Grafana rale un peu car notre base de donnée Loki est vide.*


## Partie Promtail

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

Vous pouvez bien evidemment adapter cette template à vos besoins. Mon idée première est d'avoir une "base" que je peux mettre sur chaque machine *(en sachant aussi que si aucun log n'est disponible, comme pour Docker, Promtail ne causera pas une erreur en ne trouvant pas les fichiers)* 

Une fois Promtail configuré, on peut le démarrer : 
via l'executable directement : 

```bash
/opt/promtail/promtail -config.file /opt/promtail/promtail-local-config.yaml
``` 

ou via systemd *(automatique si vous passez par mon playbook)* :  
`systemctl start promtail` 

Une fois cet agent un peu partout, on va directement aller s'amuser sur Grafana !

##  Faire des requetes à Loki depuis Grafana

On va faire quelque chose d'assez contre-intuitif : nous n'allons pas commencer par faire un Dashboard : on va d'abord tester nos requetes !
*Scrollez pas, je vous jure que c'est la partie la plus fun !*

Sur Grafana, nous avons un onglet "Explore". Celui-ci va nous donner accès à Loki en écrivant des requetes, celles-ci sont assez simple, et surtout en utilisant l'outil "click-o-drome" en dépliant le *Log Browser* 
![](https://i.imgur.com/UNL2s6m.png)
<center> <i> Pardon j'ai un chouïa avancé sans vous... </i> </center>

Avec la template que je vous ai donné, vous aurez 4 jobs : 

- daemon
- authlog
- syslog
- containersjobs

Ces jobs permettent de trier les logs, on va tester ça ensemble. Nous allons donc selectionner la machine *"Ansible"*, puis demander le job *"authlog"*.
Je commence par cliquer sur Ansible, puis Authlog. Grafana me proposera exactement si je souhaite choisir un fichier spécifique. Si on ne précise pas de fichier(*filename*) Grafana prendra tous les fichiers *(donc aucune importance si nous n'avons qu'un seul fichier)* 

*(vous remarquerez plus tard que dès notre 1ere selection, grafana va cacher les jobs/hôte/fichier qui ne concernent pas notre début de requete)* 

![](https://i.imgur.com/MWFQCyl.png)

En validant notre requete (*bouton __show logs__*)

![](https://i.imgur.com/RCpb5GI.png)

Nous avons donc le résultat de la requete vers Loki dans le lapse de temps configuré dans Grafana (1h pour moi).
Mon authlog n'est pas très interessant, et mon syslog est pollué par beaucoup
de message pas très pertinents. 

Nous allons donc commencer à **trier** nos logs !
 
En cliquant sur le petit "***?***" au dessus de notre requete, nous avons une
"cheatsheet" résumant les fonctions basiques de Loki. 
Nous découvrons comment faire une recherche exacte avec *|=*, comment ignorer
les lignes avec *!=* et comment utiliser une expression regulière avec *|~*

Je vous partage également une cheatsheet un peu plus complète que j'ai trouvé
sur un blog : [ici](https://megamorf.gitlab.io/cheat-sheets/loki/) 

Ainsi, on peut directement obtenir des logs un peu plus colorés qui nous permettrons de cibler l'essentiel ! 

![](https://i.imgur.com/HzTwmwW.png)


(L'idée est de cibler les logs sympas avec les couleurs qui vont avec) 

# Conclusion 
Si on entend souvent parler de la suite ELK, ça n'est pas non-plus une raison
pour s'en servir à tout prix ! Loki est une bonne alternative proposant des
fonctionnalitées basiques qui suffiront pour la plupart.