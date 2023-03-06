---
slug: abuseipdb-fail2ban
title: Signalez vos attaquants avec Fail2Ban
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: https://git.thoughtless.eu
  image_url: https://avatars.githubusercontent.com/u/82603435?v=4
tags: [Sécurité, fail2ban]
description: Ne restez pas neutre face aux attaques sur vos services exposés. Signalez chacune des IPs suspectes à partir de Fail2Ban et rendez le web un peu plus sûr chaque jour.
---

Dès lors que nous exposons un service en ligne, celui-ci se fait harceler de bots et d'attaques en tout genre. 
Ces bots ont pour objectif de trouver la moindre petite faille pour obtenir un accès à votre serveur et en tirer quelque chose de lucratif *(Minages, Botnet, Ransomware)*. 

La bonne pratique est donc de ne pas **pas** exposer les services sensibles *(et mettre en place un VPN/Tunnel SSH)*, mais certains cas nous obligent à bafouer cette règle.

Par exemple, si vous hébergez des WordPress, les pages administrateurs seront cibles d'attaques, les clients les plus exigeants voudront un Proxmox accessible depuis Internet, ou votre bastion est un simple serveur SSH.

Vous connaissez déjà les risques d'exposer ces accès sur Internet et je ne vais pas non-plus vous présenter de solutions universelles pour protéger vos services. 

Le message que je souhaite vous faire passer est de **dénoncer vos attaquants**.

*Et évidemment : je ne vous parle pas d'éplucher vos logs ligne-par-ligne pour récupérer les IPs suspectes.*

Une solution simple et polyvalente est : **fail2ban**.

## Fail2Ban 

Fail2Ban est un programme très simple en Python qui va lire vos fichiers de log, extraire les tentatives de connection échouées via une *regex*, et agir en conséquence.

Par exemple, lire les tentatives d'authentification en SSH et bloquer temporairement les IPs via des règles IPTables. Ou envoyer un mail lorsqu'un utilisateur se trompe de mot de passe 3 fois sur votre Drupal.

Nativement, *Fail2Ban* peut surveiller Apache2, Postfix, proftpd et bien d'autres... 

Mais créer vos règles n'est pas bien compliqué, on va donc créer 2 règles nous-même. 

### Fail2Ban avec Proxmox

Créez le filtre avec la regex identifiant les erreurs d'authentifications dans le fichier `/etc/fail2ban/filter.d/proxmox.conf`.
```conf
[Definition]
failregex = pvedaemon\[.*authentication failure; rhost=<HOST> user=.* msg=.*
ignoreregex =
```

Et enfin le fichier `/etc/fail2ban/jail.d/proxmox.conf` qui va définir les ports qui seront bloqués à l'IP suspecte et les fichiers de log à surveiller.
```conf
[proxmox]
enabled = true
port = https,http,8006
filter = proxmox
logpath = /var/log/daemon.log
maxretry = 3
bantime = 3600
action = %(action_)s
```

Vous pouvez vérifier la syntaxe et redémarrer *fail2ban* avec `fail2ban-client reload`.

Simple, non ? Maintenant, place à la délation ! 

## Dénoncer les IPs suspectes

Lorsqu'un numéro suspect m'appelle, j'ai souvent le réflexe (inutile ?) de chercher le numéro sur Google et de voir si le numéro a déjà été signalé.

C'est pareil avec les adresses IP ! 

Une IP de Chine vient visiter votre blog ? 👀 C'est peut-être un Français habitant à l'étranger, ou un vilain robot qui cherche des adresses mails pour vous envoyer des spams/phishing.

Et vérifier si l'IP a une mauvaise réputation est la première chose à faire. C'est l'intérêt du site [AbuseIPDB](https://www.abuseipdb.com).

En créant un compte, vous pourrez signaler des IPs sur le site via l'IHM ou l'API.

Et c'est justement cette API qui va nous permettre de signaler automatiquement les adresses IP louches.

*(Et en plus, vous pourrez créer un super widget sur votre site pour montrer le nombre d'IP que vous avez signalé)*

!["AbuseIPDB Badge"](https://www.abuseipdb.com/contributor/106797.svg)


Et pour faire ce signalement automatique, il suffit de modifier vos `jails` sur *Fail2Ban* en ajoutant une `action` qui va faire un reporting sur AbuseIPDB: 
```conf
action = %(action_)s
         %(action_abuseipdb)s[abuseipdb_apikey="VOTRE_API_ABUSEIPDB", abuseipdb_category="18,21"]
```

*... sachant que la catégorie `18` correspond aux attaques par brute-force, et `21` aux attaques sur pages WEB.* 

---

Ce genre de configuration ne va pas directement augmenter la sécurité de vos services, il faut garder en tête que c'est une action qui a simplement pour but de rendre la vie dure aux attaquants/méchants robots. Rendons le web plus sûr, sans se rajouter une charge de travail supplémentaire.