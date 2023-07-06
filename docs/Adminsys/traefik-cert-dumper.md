---
title: Traefik Certs Dumper
slug: traefik-cert-dumper
description: Extraire les certificats SSL/TLS de Traefik avec Traefik-Certs-Dumper pour les utiliser dans d'autres applications
---

Traefik est un reverse proxy et load balancer populaire pour les environnements de conteneurs, il est très utilisé pour ses fonctionnalités d'automatisation et de configuration dynamique. Celui-ci va créer automatiquement les redirections et les certificats SSL/TLS pour vos applications Web. (via des labels Docker ou des manifests Kubernetes)

Ainsi, Traefik a su s'imposer comme un outil incontournable pour les environnements de conteneurs, et il est utilisé par de nombreuses entreprises et chaque version rajoute de nouvelles intégrations *(Consul, Etcd, ECS, Nomad, Redis)*.

Par défaut Traefik utilise Let's Encrypt pour générer *(et renouveler)* les certificats SSL/TLS en les stockant dans un fichier `acme.json` *(Il me semble qu'il est possible d'enregistrer les certificats dans Consul, mais nous n'en parlerons pas dans cette page)*

Cependant, il n'est pas toujours évident de récupérer les certificats générés par Traefik, et il n'existe pas de commande pour les exporter *(à ma connaissance)*. C'est pour cette raison que je me suis tourné vers Traefik Certs Dumper. C'est un projet open source disponible sur GitHub qui a été créé par [ldez](https://github.com/ldez) *(Français, ça vaut la peine de le préciser)*.
Il s'agit d'un outil spécifiquement conçu pour exporter les certificats SSL/TLS à partir du fichier `acme.json`.

> Pourquoi extraire les certificats SSL/TLS de Traefik ?

Parce que mon serveur Mail utilise un certificat SSL/TLS valide pour envoyer des emails, et que je ne voulais pas utiliser un certificat auto-signé en sachant que certaines applications refusent de se connecter à un serveur SMTP qui utilise un certificat auto-signé.

## Installation

Traefik Cert Dumper dispose d'un paquet NixOS, il est donc possible de l'installer avec la commande suivante :

```bash
nix-env -iA traefik-certs-dumper # Installation réelle
nix-shell -p traefik-certs-dumper # Installation éphémère
```

Sinon, vous pouvez très bien télécharger le binaire depuis la page de [releases](https://github.com/ldez/traefik-certs-dumper/releases).

```bash
wget https://github.com/ldez/traefik-certs-dumper/releases/download/v2.8.1/traefik-certs-dumper_v2.8.1_linux_amd64.tar.gz
tar xvfz traefik-certs-dumper_v2.8.1_linux_amd64.tar.gz
```

## Utilisation

Mon objectif est d'extraire les certificats SSL/TLS pour mon serveur Mail, qui est accessible via le sous-domaine `mail.example.com`. Pour cela, je vais récupérer mon fichier `acme.json` et le placer dans le dossier `/tmp` *(pour l'exemple)*.

```bash
kubectl -n kube-system cp traefik-78485558bc-zbj2s:/data/acme.json /tmp/acme.json
```

Pour extraire les fichiers au format `privkey.pem` et `fullchain.pem` il suffit d'exécuter la commande suivante :

```bash
traefik-certs-dumper file --domain-subdir --crt-ext=.pem --key-ext=.pem --version v2
```

Nous nous retrouvons alors avec un dossier `dump` dans lequel se trouvent les fichiers `privkey.pem` et `fullchain.pem` pour chaque sous-domaine.

```bash
drwxr-xr-x  2 root root 4,0K 27 juin  09:27 site.example.com
drwxr-xr-x  2 root root 4,0K 27 juin  09:27 mail.example.com
drwxr-xr-x  2 root root 4,0K 27 juin  09:27 blog.example.com
```

Dans chaque sous-dossier, le fichier `certificate.pem` correspond au `fullchain.pem` et le fichier `privatekey.pem` correspond au `privkey.pem`.

À partir de là, il est possible de copier les fichiers et de s'en servir pour d'autres applications.
