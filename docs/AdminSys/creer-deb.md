---
slug: creer-deb
title: Créer ses propres packages Debian
tags:
  - debian
  - infra
---

Dans mon projet de créer une infrastructure auto-suffisante, je me retrouve parfois à installer des petits programmes sur de nombreuses machines via les *Makefile* ou une série de commandes. Puis j’ai eu l’idée de créer mes propres packages Debian. *(Notamment dans le but de créer mon propre dépôt de package)*

Nous allons donc voir comment créer nos propres packages `.deb` ! 

## Les Pré-requis sont simples : 

- Être sur un système basé sur Debian
- Installer les paquets suivants :

```bash
sudo apt install build-essential binutils lintian debhelper dh-make devscripts
```

## Créer son propre package 

Je vais prendre un exemple simple : [*Kompose*](https://kompose.io/)

C’est un petit script **Go** permettant de convertir les *docker-composes* en fichiers **YAML* Kubernetes*. Pour l’installer, on télécharge l’exécutable compilé et on le place dans un dossier de notre `$PATH`.

J’aimerais donc créer un `.deb` qui contiendrait le binaire de *Kompose* qui le déposerait dans `/usr/bin`.
La documentation officielle de Debian *([disponible ici](https://wiki.debian.org/HowToPackageForDebian))* est très claire : il faut créer un répertoire qui sera considéré comme la racine de notre système.

Je m’explique : <br></br>
Si je souhaite déposer le fichier *kompose* dans mon dossier `/usr/bin`. Je vais alors créer le dossier `./kompose_1.28.0-1_amd/usr/bin/`.

:::info Conventions de nommage

La documentation nous propose une nomenclature très simple. Il faut nommer vos fichiers comme ci-dessous
<br></br>

`name_version-revision_architecture.deb`

Dans mon cas, je nomme mon dossier `kompose_1.28.0-1_amd64` *(l’extension .deb sera rajouté à la création du package)*
:::


Maintenant que nous savons comment déposer des fichiers dans l’arborescence, nous devons créer le fichier `DEBIAN/control`. 

Ce fichier regroupe les métadonnées du fichier *(Nom, mainteneur, architecture)*, il permet à dpkg de nommer ce qu’on vient d’installer ainsi que sa version.
```control
Package: kompose
Version: 1.28.0
Maintainer: Quentin JOLY <github@thoughtless.eu>
Architecture: amd64
Description: Kompose is a conversion tool for Docker Compose to container orchestrators such as Kubernetes (or OpenShift). 
```

Il est également possible de rajouter les *conflits* avec d’autres paquets, ou à l’inverse les dépendances avant/après l’installation.


## Scripts pre/post 

Si déposer des fichiers n’est pas suffisant pour installer votre paquet, il est toujours possible d’exécuter des scripts *{post,pre}{inst,rm}*. Ceux-ci doivent se placer dans le dossier `DEBIAN/` *(le même que pour le fichier `control`)*

Voici les 4 possibilités de lancement de script : 
- pre installation (`preinst`)
- post installation (`postinstall`)
- pre suppression (`prerm`)
- post suppression (`postrm`)

L’usage de ces scripts permet de compiler le nécéssaire, déposer les fichiers de configurations, ou supprimer les logs après la suppression. 

## Créer l’archive

Voilà notre arborescence avec l’exécutable de Kompose, mon fichier de métadonnée et mon script de post-installation.

```
└── kompose_1.28.0-1_amd64
    ├── DEBIAN
    │   ├── control
    │   └── postinst
    └── usr
        └── bin
            └── kompose
```

Maintenant, la commande pour créer notre *deb* est `dpkg-deb --build kompose_1.28.0-1_amd64`. 
```bash
➜ dpkg-deb --build kompose_1.28.0-1_amd64
dpkg-deb: building package 'kompose' in 'kompose_1.28.0-1_amd64.deb'.
```

Il suffit à présent d’envoyer notre fichier `kompose_1.28.0-1_amd64.deb` sur une machine Debian et de l’installer avec `sudo dpkg -i kompose_1.28.0-1_amd64.deb`.

:::caution Méthode chiffrement ZST

Si vous tombez sur l’erreur suivante : 
```bash
# dpkg -i kompose_1.28.0-1_amd64.deb
dpkg-deb: error: archive 'kompose_1.28.0-1_amd64.deb' uses unknown compression for member 'control.tar.zst', giving up
dpkg: error processing archive kompose_1.28.0-1_amd64.deb (--install):
 dpkg-deb --control subprocess returned error exit status 2
Errors were encountered while processing:
 kompose_1.28.0-1_amd64.deb
```

C’est parce que Debian a changé le chiffrement du package en passant du `zstd` au `xz`. Il est possible de 

```bash
fichier=kompose_1.28.0-1_amd64.deb
ar x $fichier
zstd -d < control.tar.zst | xz > control.tar.xz
zstd -d < data.tar.zst | xz > data.tar.xz
ar -m -c -a sdsd repacked_${fichier} debian-binary control.tar.xz data.tar.xz
rm debian-binary control.tar.xz data.tar.xz control.tar.zst data.tar.zst
```
:::

---

Cette page est maintenant terminée, je n’hésiterais pas à la compléter si j’approfondis le sujet.