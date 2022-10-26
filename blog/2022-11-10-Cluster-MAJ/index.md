---
slug: cluster-maj
title: Gardez vos clusters à jour
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: https://github.com/qjoly/
  image_url: https://git.thoughtless.eu/avatars/05bed00fb8cb64b8e3b222f797bcd3d8
tags: [docker, swarm, kubernetes]
---

## Introduction

Depuis que le mouvement DevOps a commencé (ou plutot *Platform engineering*), on met le thème de la haute-disponibilité sur le devant de la scène. Et une des solutions les plus polyvalentes pour faire de la haute disponibilité est de créer des clusters d'applications. (et *de facto* : des conteneurs) 

J'ai donc administré un cluster Swarm pendant quelques années et je suis récémment passé sous Kubernetes *(k3s pour être précis)*. Et à force d'avoir des clusters contenant plusieurs centaines de conteneurs, on en oublie la maintenance et la mise à jour. 

Et dans cet article, on va parler des mises à jour. 

## Solutions de mise à jour de conteneur hors-cluster

### WatchTower 

Je pense que la solution la plus connue est [Watchtower](https://containrrr.dev/watchtower/)

Watchtower est facile d'utilisation et se base (comme beaucoup d'autre) sur les **labels**. Un label permet de définir quelques paramètres et d'activer (ou de désactiver) la surveillance des mises à jours. 

:::note Mettre à jour, c'est pas toujours bien..
Attention à ne pas mettre à jour automatiquement des programmes sensibles ! Nous ne pouvons pas vérifier ce que contient une mise à jour si elle ne va pas casser quelque chose. 
Il ne tient qu'à vous de choisir les applications à surveiller, et à déclencher une mise à jour ou non.
:::

WatchTower vous notifiera de plusieurs manières : 
- email 
- slack 
- msteams
- gotify 
- shoutrrr

Et parmis ces méthodes, vous n'avez pas que des solutions propriétaires, libre à vous d'héberger un shoutrrr, un gotify ou d'utiliser votre smtp pour ne pas que ces informations sortent de votre SI ! *(Je reproche beaucoup l'usage de msteams, slack, discord pour recevoir ses notifications)* 

WatchTower scannera les mises à jours de manière régulière *(configurable)*.

### container-updater (de [@PAPAMICA](https://github.com/PAPAMICA))

La solution la plus fournie/complexe n'est pas toujours la meilleure. Papamica a mis en place un script bash répondant à ses besoins précis *(que beaucoup d'autres personnes doivent avoir)* : un système de mise à jour le notifiant par Discord et Zabbix. 

Celui-ci se base aussi par les labels et prend également en charge le cas où l'on veuille mettre à jour par docker-compose. (*au lieu de faire un docker pull, docker restart comme Watchtower*)

```yaml
labels:
    - "autoupdate=true"
    - "autoupdate.docker-compose=/link/to/docker-compose.yml"
```

Même si je ne m'en sers pas, j'ai eu une époque où j'utilisais Zabbix et où j'avais le besoin d'être notifié sur mon Zabbix. *(qui lui me notifiait par Mail/Gotify)*

Papamica précise qu'il compte ajouter le support de registre privé *(pour le moment que le github registry ou dockerhub)* ainsi que d'autres supports de mise à jour. 

## Solutions pour Swarm

Swarm est surement l'orchestrateur de conteneur sur lequel j'ai pris le plus de plaisir : c'est **__simple__** ! On apprend vite, on découvre vite et on a vite des résultats. 
Mais j'ai déjà écris des éloges à Swarm dans un [autre article](/blog/presentation-docker-swarm/)...

### Sheperd 

Ce que j'aime dans le programme de Papamica (et qui va avec Sheperd) c'est qu'on garde le bash comme langage central. Un langage que l'on connait tous dans les grandes lignes grace à Linux, et que l'on peut lire et modifier pour peu qu'on y prenne le temps. 

Le code de Sheperd ne fait que [~200 lignes](https://github.com/djmaze/shepherd/blob/master/shepherd) et fonctionne très bien comme ça. 

```yaml
version: "3"
services:
  ...
  shepherd:
    build: .
    image: mazzolino/shepherd
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    deploy:
      placement:
        constraints:
        - node.role == manager
```

Celui-ci acceptera plusieurs registres privés ce qui donne un bel avantage comparés aux autres solutions présentées. 
Exemple:
```yaml
    deploy:
        labels:
            - shepherd.enable=true
            - shepherd.auth.config=blog
```

Sheperd n'inclut pas *(par défaut)* de système de notification. C'est pourquoi son créateur a décidé de proposer un [sidecar Apprise en alternative](https://github.com/djmaze/shepherd/blob/master/docker-compose.apprise.yml). Qui peut rediriger vers beaucoup de choses comme Telegram, SMS, Gotify, Mail, Slack, msteams etc....

Je pense que c'est la solution la plus simple et la plus polyvalente. J'espère qu'on la retrouvera dans d'autres contextes. *(mais je m'étale pas trop sur le sujet, j'aimerai bien écrire un article sur ça)*. 

J'ai utilisé Sheperd pendant une bonne période et je n'ai eu aucun soucis.

## Solutions pour Kubernetes

Pour Kubernetes, on commence à perdre en simplicité. D'autant plus qu'avec l'option `imagePullPolicy: Always`, il suffit juste de rédémarrer un pod pour récupérer la dernière image avec le même *tag*. 
Pendant un long moment, j'ai utilisé ArgoCD pour mettre à jour mes configurations et re-déployer mes images à chaque mise à jour sur Git. 

Mais ArgoCD ne sert qu'à **mettre à jour la configuration** et non pas l'image. La méthodologie est incorrecte et il est nécéssaire de trouver un outil adapté pour ça. 

### Keel.sh

Keel est un outil répondant au même besoin : Mettre à jour les images des pods. Mais il incorpose plusieurs fonctionnalités qu'on ne retrouve pas ailleurs. 

![Keel](https://keel.sh/img/keel_high_level.png)

Si on souhaite garder le même fonctionnement que les alternatives *(c.a.d. régulièrement vérifier les mises à jours)*, c'est possible: 
```yaml
metadata:
  annotations:
    keel.sh/policy: force
    keel.sh/trigger: poll
    keel.sh/pollSchedule: "@every 3m"
```

Mais là où Keel brille, c'est qu'il propose des **triggers** et des **approvals**. 

Un trigger, c'est un évenement qui va déclencher la mise à jour de Keel. On peut imaginer un webhook provenant de Github, Dockerhub, Gitea qui va déclencher la mise à jour du serveur. *(On évite donc une crontab régulière et on économise des ressources, du traffic et du temps)*
Comme l'usage de webhook s'est beaucoup répandu dans les systèmes de CICD, on peut coupler ça à de nombreux cas d'usages. 


Les approvals, c'est la petite perle qui manquait aux autres outils. En effet, j'ai précisé que *mettre à jour des images : c'est dangereux et il faut ne pas cibler des applications sensibles dans les mises à jours automatiques*. Et c'est juste en réponse à ça que Keel a developpé les *approvals*. 

![](https://keel.sh/img/docs/approvals.png)

L'idée est de donner l'autorisation à Keel de mettre à jour le pod. On peut donc choisir le moment et vérifier manuellement. 

Je trouve quand même dommage qu'on ait Slack ou MSTeams d'imposé pour les approvals, c'est donc une fonctionnalité que je n'utiliserai pas. 

:::note Une UI 
Alors pour le moment, j'utilise Keel sans son interface web, il se peut qu'elle apporte de nouvelles fonctionnalitées mais j'aimerai éviter une enième interface à gérer.
:::

## Conclusion

Mettre à jour un conteneur, c'est pas si simple que ça quand on cherche l'automatisation et la sécurité. Si aujourd'hui je trouve que Keel correspond à mes besoins, j'ai l'impression que les outils se ressemblent sans proposer de réelles innovations. *(j'envisage d'aborder le principe de canary un jour)*
J'espère découvrir de nouvelles solutions prochainement en espérant qu'elles collent plus à mes besoins. 
