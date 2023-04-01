---
slug: creer-repo-debian
title: Créer son dépot Debian
tags: [debian, infra]
description: Lorsque nous avons de nombreux serveurs, il convient d'automatiser chacun des déploiements que nous réalisons. Et lorsque la majorité sont sous Debian, ces déploiements peuvent prendre la forme de fichiers .deb. Nous verrons donc sur cette page comment créer notre propre dépôt Debian
---

## Introduction

Debian est la distribution la plus utilisée et connue. En tant que Workstation *(Via Ubuntu Desktop)* ou en serveur, nous n'avons de cesse d'utiliser Debian dans notre quotidien. Et si Debian est si forte, c'est avant-tout grâce au nombre de personnes qui s'en servent et font vivre la suite de logiciels disponibles sur cette distribution.

Et si installer un programme se fait facilement via les fichiers `.deb`, l'usage d'un dépôt *(centralisant ces `.deb`)* devient une nécessité lorsque l'on doit administrer un grand nombreux de machines.

## Qu'est-ce qu'Aptly ?

**Aptly** est un programme permet de créer et gérer un dépôt de paquet. Celui-ci est très souple et permet notamment de faire un *miroir* à partir d'un autre dépôt.

Le fonctionnement de Aptly est *simple*, nous ajoutons un dépôt *(Miroir, ou local)*, nous importons des fichiers `deb` si le dépôt est local, nous créons une snapshot, et nous la publions sur un serveur web.

![Schema](https://www.aptly.info/img/schema.png)

*Oui, ça fait beaucoup d'étapes, mais ne vous inquiétez pas : celles-ci sont assez faciles à réaliser.*

## Génération Couple GPG (Optionnel)

Par sécurité, je vous invite à créer un couple de clé *gpg*, qui sera utilisé pour signer votre dépôt et empêcher une quelconque attaque *MITM*.

```bash
gpg --full-generate-key # Laissez les choix par défaut
```

Je vous conseille vivement de sauvegarder le mot de passe de la clé *(Et à ce qu'il soit sécurisé, ex: `mimbko2v59MAPu;qM2HX!YdN7ioMT`)*. Celui-ci ne sera pas récupérable si vous le perdez.

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

Via [cette documentation](./creer-deb), nous avons appris à créer nos propres `deb`. J'ai donc créé quelques paquets *exemple* à stocker dans 2 dépôts différents : *stable et unstable*.

Voici mon architecture :

```bash
├── stable
│   └── kompose_1.28.0-1_amd64.deb
└── unstable
    ├── foobar_1-1_all.deb
    ├── hello-world_1-1_amd64.deb
    └── hello-world_1-1_arm64.deb
```

*le paquet Hello-World est décliné en 2 versions : amd64 et arm64*.

Commençons par créer notre dépôt *unstable* :

```bash
aptly repo create unstable
```

Une fois le dépôt créé, nous pouvons vérifier que notre dépôt est créé et vide avec la commande `aptly repo show -with-packages unstable`.

```bash
# aptly repo show -with-packages unstable
Name: unstable
Comment: 
Default Distribution: 
Default Component: main
Number of packages: 0
Packages:
```

Le dépôt est vide, nous allons maintenant ajouter notre dossier `unstable/` pour qu'il y importe les `deb`.

```bash
aptly repo add unstable unstable/
```

On re-vérifie les packages présents sur le dépôt.

```bash
# aptly repo show -with-packages unstable
Name: unstable
Comment: 
Default Distribution: 
Default Component: main
Number of packages: 3
Packages:
  foo_1_all
  hello-world_1_amd64
  hello-world_1_arm64
```

À présent, nous créons notre snapshot à partir du dépôt *unstable. (celle-ci portera le même nom que le dépôt : unstable)*

```bash
aptly snapshot create unstable from repo unstable
```

Nous vérifions la snapshot avec la commande `aptly snapshot show -with-packages unstable`.

Désormais, nous pouvons créer les fichiers du dépôt *(En réutilisant la clé GPG que nous avons créée en haut de la page)*.

```bash
aptly publish snapshot -architectures="amd64,arm64" -distribution="unstable" -gpg-key="2DB7FDA5442C053973F9F3CAB55A4CDD19C23946" unstable 
```

Nous avons donc la structure du dépôt *(celle que nous devrons exposer en site)* dans `~/.aptly/public/`.

```bash
├── dists
│   └── unstable
│       ├── Contents-amd64.gz
│       ├── Contents-arm64.gz
│       ├── InRelease
│       ├── main
│       │   ├── binary-amd64
│       │   │   ├── Packages
│       │   │   ├── Packages.bz2
│       │   │   ├── Packages.gz
│       │   │   └── Release
│       │   ├── binary-arm64
│       │   │   ├── Packages
│       │   │   ├── Packages.bz2
│       │   │   ├── Packages.gz
│       │   │   └── Release
│       │   ├── Contents-amd64.gz
│       │   └── Contents-arm64.gz
│       ├── Release
│       └── Release.gpg
├── gpg
└── pool
    └── main
        ├── f
        │   └── foo
        │       └── foobar_1-1_all.deb
        └── h
            └── hello-world
                ├── hello-world_1-1_amd64.deb
                └── hello-world_1-1_arm64.deb
```

Nous pouvons d'ores-et-déjà tester notre dépôt en créant un serveur web temporaire via la commande `aptly serve`.

Mais avant de rendre accessible notre dépôt, créons la seconde section *stable*:

```bash
aptly repo create stable
aptly repo add stable stable/
aptly snapshot create stable from repo stable
aptly publish snapshot -architectures="amd64,arm64" -distribution="stable" -gpg-key="2DB7FDA5442C053973F9F3CAB55A4CDD19C23946" stable 
```

Nous pouvons tester via `aptly serve`.

```bash
# aptly serve
Serving published repositories, recommended apt sources list:

# ./stable [amd64, arm64] publishes {main: [stable]: Snapshot from local repo [stable]}
deb http://192.168.1.102:8080/ stable main
# ./unstable [amd64, arm64] publishes {main: [unstable]: Snapshot from local repo [unstable]}
deb http://192.168.1.102:8080/ unstable main

Starting web server at: :8080 (press Ctrl+C to quit)...
```

Ajoutons la clé GPG du dépôt puis créons le fichier de notre dépôt dans `/etc/apt/sources.list.d/private.list`.

```bash
wget -O - -q http://192.168.1.102:8080/gpg | sudo apt-key add - 
echo -n "deb http://192.168.1.102:8080/ stable main 
deb http://192.168.1.102:8080/ unstable main" | sudo tee /etc/apt/sources.list.d/private.list
```

Le package `hello-world` affiche `Hello-World Amd64` sur les processeurs Amd64, et `Hello-World Arm`.

Testons sur ma machine personnelle :

```bash
sudo apt update
sudo apt install hello-world
hello-world
# Hello-World Amd64
```

et sur une Raspberry pi :

```bash
sudo apt install hello-world
hello-world
# Hello-World Arm
```

## Exposer le dépôt

Si `aptly serve` permet de tester son dépôt en le rendant accessible, il est nécéssaire d'utiliser un réel serveur web comme *Nginx* ou *Apache2*.

J'ai donc installé `nginx` et édité le fichier `/etc/nginx/sites-available/default` *(Je ne détaillerai que très peu cette partie)*.

```bash
server {
 listen 80 default_server;
 listen [::]:80 default_server;
 root /root/.aptly/public/;
     allow all;
 autoindex on;
 server_name _;
}
```

*Il faut bien penser à donner les permissions à www-data au dossier `/root/.aptly/`.*

:::danger root-less

Dans cet article, je reste en utilisateur `root`. Aptly **n'impose pas** l'usage de cet utilisateur, vous pouvez *(et même devez)* utiliser un utilisateur dédié à ça

:::

## Faire du Nettoyage

Pour Supprimer les dépôts que nous avons créés, il suffit juste d'exécuter ces commandes dans l'ordre.

- Supprimer la snapshot du site
- Supprimer la snapshot
- Supprimer le dépôt

```bash
# Pour le dépôt unstable
aptly publish drop unstable
aptly snapshot drop unstable
aptly repo drop unstable
# Pour le dépôt stable
aptly publish drop stable
aptly snapshot drop stable
aptly repo drop stable
```

---
:::note En lien avec cette page

- [Créer ses fichiers .deb](/docs/Adminsys/creer-deb)
:::
