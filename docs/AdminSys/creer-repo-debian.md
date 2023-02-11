---
slug: creer-repo-debian
title: Créer son dépot Debian
tags:
  - debian
  - infra
---


:::danger En cours d’écriture
Cette page n’est pas terminée, attention aux informations qui peuvent s’y trouver.
:::

## Introduction

Debian est la distribution la plus utilisée et connue. En tant que Workstation *(Via Ubuntu Desktop)* ou en serveur, nous n’avons de cesse d’utiliser Debian dans notre quotidien. Et si Debian est si forte, c’est avant-tout grâce au nombre de personnes qui s’en servent et font vivre la suite de logiciels disponibles sur cette distribution.

Et si installer un programme se fait facilement via les fichiers `.deb`, l’usage d’un dépôt *(centralisant ces `.deb`)* devient une nécessité lorsque l’on doit administrer un grand nombreux de machines.

## Qu’est-ce qu’Aptly ?

**Aptly** est un programme permet de créer et gérer un dépôt de paquet. Celui-ci est très souple et permet notamment de faire un *miroir* à partir d’un autre dépôt. 

Le fonctionnement de Aptly est *simple*, nous ajoutons un dépôt *(Miroir, ou local)*, nous importons des fichiers `deb` si le dépôt est local, nous créons une snapshot, et nous la publions sur un serveur web.

![Schema](https://www.aptly.info/img/schema.png)

*Oui, ça fait beaucoup d’étapes, mais ne vous inquiétez pas : celles-ci sont assez faciles à réaliser.*

## Génération Couple GPG (Optionnel)

Par sécurité, je vous invite à créer un couple de clé *gpg*, qui sera utilisé pour signer votre dépôt et empêcher une quelconque attaque *MITM*.

```bash
gpg --full-generate-key # Laissez les choix par défaut
```
Je vous conseille vivement de sauvegarder le mot de passe de la clé *(Et à ce qu’il soit sécurisé, ex: `mimbko2v59MAPu;qM2HX!YdN7ioMT`)*. Celui-ci ne sera pas récupérable si vous le perdez.

Les clés créées sont accessibles de cette manière : 
```bash
# gpg --list-keys
/root/.gnupg/pubring.kbx
------------------------
pub   rsa3072 2023-02-11 [SC]
      2DB7FDA5442C053973F9F3CAB55A4CDD19C23946
uid          [  ultime ] Quentin JOLY (Aptly Repo) <github@thoughtless.eu>
sub   rsa3072 2023-02-11 [E]
```

Vous pouvez exporter la clé pour la placer dans le *futur* site créé par Aptly, vos utilisateurs vous remercieront plus tard.
```bash
mkdir -p ~/.aptly/public/
gpg --armor --output ~/.aptly/data/public/gpg --export 2DB7FDA5442C053973F9F3CAB55A4CDD19C23946
```
## Installer Aptly

Pour installer Aptly, je vous invite à télécharger le binaire et à le placer dans votre `PATH`.

```bash
cd /tmp \
      && wget -q -O - https://github.com/aptly-dev/aptly/releases/download/v1.5.0/aptly_1.5.0_linux_amd64.tar.gz | tar xvzf - \
      && mv aptly_1.5.0_linux_amd64/aptly /usr/bin/aptly
```

## Créer votre dépôt privé

Via [cette documentation](./creer-deb), nous avons appris à créer nos propres `deb`. J’ai donc créé quelques paquets *exemple* à stocker dans 2 dépôts différents : *stable et unstable*.

Voici mon architecture :
```
├── stable
│   └── kompose_1.28.0-1_amd64.deb
└── unstable
    ├── foobar_1-1_all.deb
    ├── hello-world_1-1_amd64.deb
    └── hello-world_1-1_arm64.deb
```
*le paquet Hello-World est 


```bash
aptly repo create unstable 
aptly repo add unstable unstable/
aptly snapshot create unstable from repo unstable
aptly publish snapshot -architectures="amd64,arm64" -distribution="unstable" -gpg-key="2DB7FDA5442C053973F9F3CAB55A4CDD19C23946" unstable
---
aptly publish drop unstable
aptly snapshot drop unstable
aptly repo drop unstable
```

```bash
aptly repo create stable
aptly repo add stable stable/
aptly snapshot create stable from repo stable
aptly publish snapshot -architectures="amd64,arm64" -distribution="stable" -gpg-key="2DB7FDA5442C053973F9F3CAB55A4CDD19C23946" stable 
---
aptly publish drop stable
aptly snapshot drop stable
aptly repo drop stable
```


wget -O - -q http://192.168.1.102:8080/gpg | sudo apt-key add -
sudo apt install hello-world