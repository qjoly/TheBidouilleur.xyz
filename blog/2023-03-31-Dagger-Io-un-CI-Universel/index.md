---
title: Dagger.io, un CI Universel
slug: dagger
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: 'https://github.com/qjoly/'
  image_url: 'https://avatars.githubusercontent.com/u/82603435?v=4'
tags: [dagger, ci, docker]
description: Dagger.IO est un outil maintenu par Solomon Hykes, celui-ci permet de créer un CI local (ou distant) n'étant pas dépendant du Yaml ou d'un DSL
---

Dagger.io est un projet qui a été annoncé il y a quelque temps par Solomon Hykes, la philosophie de Dagger a attiré mon attention.

C'est un service de CI/CD qui permet de lancer des jobs dans des conteneurs Docker. La plus-value de Dagger est qu'il ne se limite pas à du Yaml *(Comme Gitlab-CI, Github Action, Drone.io)* ou à un DSL maison *(Comme Jenkins)*, il permet de lancer des jobs en utilisant du code Python, du Go, du Java.Typescript ou encore du GraphQL.

Il est un peu comme Pulumi mais pour les jobs de CI/CD. *(Là où son concurrent Terraform utilise un DSL, Pulumi utilise le Typescript, Python, Java, etc)*

Étant donné que j'utilise Github pour mes projets publics, Gitea pour mes projets privés *(couplé à Drone)* et Gitlab pour les projets professionnels, je me suis dit que c'était l'occasion de tester Dagger.io et de me débarrasser de mes fichiers Yaml ayant une syntaxe différente en fonction de la plateforme.

Mon idée derrière la conversion de mes jobs de CI/CD en code est également d'avoir les **mêmes** résultats entre les différentes plateformes et ma machine locale.

On va donc faire le point sur ce qu'est Dagger.io, comment l'installer et comment l'utiliser. Comme je suis habitué au langage Python, j'utiliserai alors le SDK Python de Dagger.io !

## Installation de Dagger.io

Il sera nécessaire d'avoir un Python 3.10 ou supérieur pour utiliser Dagger.io *(il est aussi possible d'utiliser un [venv](https://packaging.python.org/en/latest/tutorials/installing-packages/#creating-virtual-environments))*.

Pour installer Dagger.io, il n'y a rien de bien compliqué, il suffit d'installer le package via pip.

```bash
pip install dagger-io
```

Et c'est terminé pour l'installation.

<details>
<summary> <code>ERROR: Could not find a version that satisfies the requirement dagger-io (from versions: none)</code></summary>

Si vous avez une erreur de ce type :

```bash
➜  ~ python3 -m pip install dagger-io 
Defaulting to user installation because normal site-packages is not writeable
Collecting dagger-io
  Using cached dagger_io-0.4.2-py3-none-any.whl (52 kB)
Collecting cattrs>=22.2.0
[...]
  Using cached mdurl-0.1.2-py3-none-any.whl (10.0 kB)
Collecting multidict>=4.0
  Using cached multidict-6.0.4-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (114 kB)
ERROR: Exception:
Traceback (most recent call last):
  File "/usr/lib/python3/dist-packages/pip/_internal/cli/base_command.py", line 165, in exc_logging_wrapper
    status = run_func(*args)
  File "/usr/lib/python3/dist-packages/pip/_internal/cli/req_command.py", line 205, in wrapper
    return func(self, options, args)
  File "/usr/lib/python3/dist-packages/pip/_internal/commands/install.py", line 389, in run
    to_install = resolver.get_installation_order(requirement_set)
  File "/usr/lib/python3/dist-packages/pip/_internal/resolution/resolvelib/resolver.py", line 188, in get_installation_order
    weights = get_topological_weights(
  File "/usr/lib/python3/dist-packages/pip/_internal/resolution/resolvelib/resolver.py", line 276, in get_topological_weights
    assert len(weights) == expected_node_count
AssertionError
```

Il se peut que vous ayez une version trop ancienne de pip et setuptools. La solution est de mettre à jour pip et setuptools via la commande suivante :

```bash
pip install --upgrade pip setuptools
```

</details>

Si vous ne souhaitez pas travailler avec l'utilisateur root, il vous faudra configurer le mode Rootless de Docker. *(C'est ce que j'ai fait)* Pour cela, il suffit de suivre la [documentation officielle](https://docs.docker.com/engine/security/rootless/).

## Premier job

Pour commencer, nous allons créer un fichier `hello-world.py` et y ajouter le code suivant :

```python
"""Execute a command."""
import sys
import anyio
import dagger

async def test():
    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        python = (
            client.container()
            .from_("python:3.11-slim-buster")
            .with_exec(["python", "-V"])
        )
        version = await python.stdout()
    print(f"Hello from Dagger and {version}")

if __name__ == "__main__":
    anyio.run(test)
```

Il s'agit d'un simple job qui va lancer un conteneur Docker avec l'image `python:3.11-slim-buster` et exécuter la commande `python -V`.

Pour lancer le job, il suffit de lancer avec python : `python3 hello-world.py`.

```bash
➜  python3 hello-world.py    
#1 resolve image config for docker.io/library/python:3.11-slim-buster
#1 DONE 1.7s
#2 importing cache manifest from dagger:10686922502337221602
#2 DONE 0.0s
#3 DONE 0.0s
#4 from python:3.11-slim-buster
#4 resolve docker.io/library/python:3.11-slim-buster
#4 resolve docker.io/library/python:3.11-slim-buster 0.2s done
#4 sha256:f0712d0bdb159c54d5bdce952fbb72c5a5d2a4399654d7f55b004d9fc01e189e 0B / 3.37MB 0.2s
#4 sha256:f0712d0bdb159c54d5bdce952fbb72c5a5d2a4399654d7f55b004d9fc01e189e 3.37MB / 3.37MB 0.3s done
#4 extracting sha256:80384e04044fa9b6493f2c9012fd1aa7035ab741147248930b5a2b72136198b1
#4 extracting sha256:80384e04044fa9b6493f2c9012fd1aa7035ab741147248930b5a2b72136198b1 0.3s done
#4 extracting sha256:f0712d0bdb159c54d5bdce952fbb72c5a5d2a4399654d7f55b004d9fc01e189e
#4 extracting sha256:f0712d0bdb159c54d5bdce952fbb72c5a5d2a4399654d7f55b004d9fc01e189e 0.2s done
#4 ...
#3 
#3 0.224 Python 3.11.2
#3 DONE 0.3s

#4 from python:3.11-slim-buster
Hello from Dagger and Python 3.11.2
```

Félicitations, vous avez lancé votre premier job avec Dagger.io !

Maintenant, nous allons voir comment créer un script un peu plus complexe !

## Dagger, Python et Docker

Jusque-là, nous n'avons pas beaucoup profité de la puissance de Python, ou même des fonctionnalités de Docker. Nous allons donc voir comment utiliser les deux ensemble.

Vous n'êtes pas sans savoir que j'utilise *Docusaurus* pour générer le code HTML que vous visionnez en ce moment même. Docusaurus me permet d'écrire mes articles en Markdown et de les transformer en site.

N'étant pas très regardant sur la qualité de mes Markdown, j'ai décidé de créer un job qui va vérifier la syntaxe de mes fichiers Markdown et me renvoyer une erreur s'il y a un problème sur l'un d'entre eux.

Pour cela, je vais utiliser [pymarkdownlnt](https://pypi.org/project/pymarkdownlnt/), un Linter assez strict et performant.

Son installation se fait via pip :

```bash
pip install pymarkdownlnt
```

Ainsi, notre job va devoir effectuer ces étapes de manière séquentielle :

- Démarrer à partir d'une image Python *(`FROM python:3.10-slim-buster`)*
- Installer pymarkdownlnt *(`RUN pip install pymarkdownlnt`)*
- Récupérer les fichiers du projet *(`COPY . .`)*
- Lancer le linter sur les fichiers Markdown de chaque dossier *blog/ docs/ i18n/* (`RUN pymarkdownlnt scan blog/-r`)

Nous pouvons traduire les 3 premières étapes en code Python :

```python
lint = (
  client.container().from_("python:3.10-slim-buster")
  .with_exec("pip install pymarkdownlnt".split(" "))
  .with_mounted_directory("/data", src)
  .with_workdir("/data")
)
```

Et ensuite… je souhaite faire une boucle itérant sur les dossiers `blog/ docs/ i18n/` et lancer le linter sur chacun d'entre eux. C'est à ce moment précis que nous allons utiliser du Python et plus uniquement des instructions Dagger.

Un détail que je ne vous ai pas encore mentionné, c'est que nous pouvons agir sur notre job tant qu'il n'est pas lancé, c'est-à-dire avant le `await` qui va attendre la fin de l'exécution du job.

Donc… gardons la définition du conteneur ci-dessus, et ajoutons 3 tâches à notre job :

```python
for i in ["blog", "docs", "i18n"]:
  lint = lint.with_exec(["pymarkdownlnt", "scan", i, "-r"])
```

Plutôt simple, non ?

Si je lance mon job, j'ai de nombreuses erreurs à propos de règles que je n'ai pas respectées. Mais c'est normal, la syntaxe de Docusaurus cause des erreurs dans le linter que je ne peux pas corriger.

Je vais donc noter les règles qui ne s'appliquent pas à mes fichiers, et les ignorer :

```python
lint_rules_to_ignore = ["MD013","MD003","MD041","MD022","MD023","MD033","MD019"]
# Format accepté par pymarkdownlint : "MD013,MD003,MD041,MD022,MD023,MD033,MD019"
for i in ["blog", "docs", "i18n"]:
  lint = lint.with_exec(["pymarkdownlnt", "-d", str(','.join(lint_rules_to_ignore)), "scan", i, "-r"])
```

Voici notre script complet :

```python
"""Markdown linting script."""
import sys
import anyio
import dagger
import threading

async def markdown_lint():
    lint_rules_to_ignore = ["MD013","MD003","MD041","MD022","MD023","MD033","MD019"]

    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")

        lint = (
            client.container().from_("python:3.10-slim-buster")
            .with_exec("pip install pymarkdownlnt".split(" "))
            .with_mounted_directory("/data", src)
            .with_workdir("/data")
        )

        for i in ["blog", "docs", "i18n"]:
            lint = lint.with_exec(["pymarkdownlnt", "-d", str(','.join(lint_rules_to_ignore)), "scan", i, "-r"])
        # execute
        await lint.stdout()
    print(f"Markdown lint is FINISHED!")

if __name__ == "__main__":
    try:
        anyio.run(markdown_lint)
    except:
        print("Error in Linting")
```

Après cette modification, mon job fonctionne sans problème !

```bash
python3 .ci/markdown_lint.py
```

<script async id="asciicast-zZKfJU9fIWBexQYGv8xI0X51P" src="https://asciinema.org/a/zZKfJU9fIWBexQYGv8xI0X51P.js"></script>

Récapitulons ce que nous savons faire :

- Lancer une image Docker
- Exécuter des commandes dans un conteneur
- Copier des fichiers depuis l'hôte vers le conteneur

Je pense que ça suffira dans la plupart de mes CI. Néanmoins, il reste une fonctionnalité qui me manque : la possibilité de construire une image Docker et de l'envoyer sur un registre.

## Build & push d'une image Docker

Il est possible de s'authentifier sur un registre directement via Dagger. Dans mon cas, je considère que l'hôte sur lequel je lance mon job est **déjà** authentifié.

Dans le cadre de cette démonstration, je vais utiliser le registre `ttl.sh`, un registre public et anonyme permettant justement de stocker des images Docker pendant une durée maximale de 24h.

```python
async def docker_image_build():
    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")
        build = (
            client.container()
            .build(
                context = src,
                dockerfile = "Dockerfile",
                build_args=[
                    dagger.BuildArg("APP", os.environ.get("APP", "TheBidouilleurxyz"))
                    ]
            )
        )
        image = await blog.build(address="ttl.sh/thebidouilleur:1h")
```

Le code ci-dessus va donc construire mon image Docker à partir du fichier `Dockerfile` présent dans le dossier courant, et l'envoyer sur le registre `ttl.sh/thebidouilleur:1h`.

Une petite particularité de ce code est l'usage de *Build Args*. J'utilise la variable d'environnement `APP`, si cette variable n'est pas définie, je vais récupérer la valeur par défaut `TheBidouilleurxyz`.

<script async id="asciicast-JA71Nlp9ZOvIndye9QA8QoEtU" src="https://asciinema.org/a/JA71Nlp9ZOvIndye9QA8QoEtU.js"></script>

Maintenant, je souhaite créer un job similaire qui va construire une image Docker multiarchitecture *ARM et AMD64 (l'un de mes clusters Kubernetes est composé de Raspberry Pi).*

## Build & push d'une image Docker multiarchitecture

Il faudra déjà mettre au point le build multiarchitecture sur votre machine avant de pouvoir l'intégrer à notre job Dagger.

Si vous souhaitez savoir comment créer une image Docker multiarchitecture, je vous invite à lire ma documentation [Création image Docker](/docs/Adminsys/MultiArch%20Build/) pour en connaitre la procédure.

On va utiliser un objet à mettre en paramètre à Dagger, celui-ci est `dagger.Platform` et permet de spécifier la plateforme sur laquelle on veut construire notre image Docker.

Nous créons une boucle qui va itérer sur les différentes architectures avec lesquelles on veut construire notre image, et lors du Publish, nous enverrons les différentes images construites.

```python
async def docker_image_build():
  platforms = ["linux/amd64", "linux/arm64"]
  async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
    src = client.host().directory(".")
    variants = []
    for platform in platforms:
      print(f"Building for {platform}")
      platform = dagger.Platform(platform)
      build = (
            client.container(platform=platform)
            .build(
                context = src,
                dockerfile = "Dockerfile"
            )
        )
      variants.append(build)
    await client.container().publish("ttl.sh/dagger_test:1h", platform_variants=variants)
```

![Docker avec plusieurs architectures](./multiarch.png)

## Créer un lanceur

Maintenant que nous avons vu comment utiliser Dagger, nous allons créer un lanceur qui va nous permettre de lancer nos jobs un-par-un.

Pour lancer nos taches en asynchrone, nous utilisons la librairie [anyio](https://anyio.readthedocs.io/en/stable/) sur chacun de nos scripts.

```python
import anyio

import markdown_lint 
import docusaurus_build 
import multi_arch_build as docker_build

if __name__ == "__main__":

        print("Running tests in parallel using anyio")
        anyio.run(markdown_lint.markdown_lint)
        anyio.run(docusaurus_build.docusaurus_build)
        anyio.run(docker_build.docker_build)
```

Ce lanceur va importer les méthodes des fonctions `markdown_lint`, `docusaurus_build` et `docker_build` des fichiers `markdown_lint.py`, `docusaurus_build.py` et `multi_arch_build.py` avant d'exécuter chacune de ces fonctions.

L'unique intérêt de ce lanceur est de pouvoir lancer nos jobs à partir d'une seule commande.

## Conclusion

Dagger est un produit très prometteur ! Celui-ci n'arrivera surement pas à remplacer les solutions actuelles telles que Github Actions ou Gitlab CI, mais il répond à un besoin spécifique : celui d'avoir le même CI peu importe la plateforme.

Bref, Dagger est un produit qui mérite d'être testé et je pense que je vais l'utiliser pour la plupart de mes projets personnels.

J'espère que cet article vous aura plu, n'hésitez pas à me faire part de vos retours.
