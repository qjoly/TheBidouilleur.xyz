---
slug: s3contabo
title: Mes débuts avec s3
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: 'https://github.com/qjoly/'
  image_url: 'https://avatars.githubusercontent.com/u/82603435?v=4'
tags: [kubernetes, s3]
---

## Introduction

Mon premier cluster Kubernetes est actuellement en ligne. C'est encore un banc de test mais je l'ai pris prématurement en prod pour me forcer à l'administrer de manière sérieuse.
Aujourd'hui *(et en espérant que ça ait déjà évolué lorsque vous lirez l'article)*, mes pods utilisent un backend storage en NFS *(accessible sur mon NAS)*.

Je veux que Kubernetes devienne mon manager de conteneur principal, je pense donc essentiel de découvrir les particularités générales de Kubernetes avant de commencer à y déployer des applications un peu plus complexes.
Le stockage S3 est souvent référencé comme pratique et utile avec Kubernetes.

:::note remarque

J'ai déjà utilisé [Minio](https://min.io/) dans un autre contexte. Mais *je ne compte pas* utiliser Minio pour débuter S3, je veux une solution déjà prête et générique *(apprendre la normalité avant de se spécialiser)*.
Inutile de préciser qu'à l'avenir : Minio sera ma solution principale en Object Storage.

:::

Je me suis donc orienté vers ~~AWS~~ [Contabo](https://contabo.com/en/object-storage/) qui propose une solution bien moins chère que notre amis américain.
*je paye 2,39€ mensuels pour 250Go à la place des 5,75€ demandés par Amazon.*

## Qu'est ce que le S3 ?

Pas besoin de faire une définition bancale, voici directement l'explication d'Amazon :

> Amazon Simple Storage Service (Amazon S3) est un service de stockage d'objets qui offre une capacité de mise à l'échelle, une disponibilité des données, une sécurité et des performances de pointe. Les clients de toutes les tailles et de tous les secteurs peuvent stocker et protéger n'importe quelle quantité de données pour la quasi-totalité des cas d'utilisation, par exemple les lacs de données ainsi que les applications natives cloud et mobiles. Grâce à des classes de stockage économiques et à des fonctions de gestion faciles à utiliser, vous pouvez optimiser les coûts, organiser les données et configurer des contrôles d'accès affinés pour répondre à des exigences opérationnelles, organisationnelles et de conformité spécifiques.

Traduction : C'est une méthode performante et rapide de transférer des masses de données.

## Et comment utiliser un stockage S3 ?

Il convient avant tout de rappeler une notion importante dans l'utilisation d'un Cloud :
![Un cloud n'est que l'ordinateur de quelqu'un d'autre](https://res.cloudinary.com/teepublic/image/private/s--ecoADk1u--/t_Preview/b_rgb:191919,c_lpad,f_jpg,h_630,q_90,w_1200/v1573678143/production/designs/6718252_0.jpg)

Si vous ne stockez pas chez vous : considerez que vos données peuvent être visionnées sans votre concentement. (*Gouv, NSA, Mamie, Hacker etc...*)
Alors il convient de **chiffrer vos données**.
*Nous parlerons de Minio dans sur une autre page, une solution libre et open-source à héberger à la maison.*

On peut dialoguer avec un serveur S3 via de nombreux outils :

- [cntb](https://docs.contabo.com/docs/products/Object-Storage/Tools/cntb/) (Outil officiel de contabo)
- [aws-cli](https://aws.amazon.com/fr/cli/) (Outil d'amazon mais compatible partout)
- [rclone](https://rclone.org/)
- [cyberduck](https://cyberduck.io/)
- [s3-fuse](https://github.com/s3fs-fuse/s3fs-fuse)
et bien d'autres..

Pour chiffrer mes données, je peux très bien passer par un simple script Bash chiffrant via GPG, puis envoyant les objets vers mon s3. Mais je n'apprécie pas cette solution bancale, et autant utiliser une solution all-in-one comme **rclone** ou **restic**.
Et c'est effectivement avec **restic** que l'on va chiffrer et push les données.

## Chiffrer puis envoyer ses objets

Comme dit précédemment : restic va être notre outil principal. Celui-ci fonctionne avec un système de "dépot"

### Création du dépot restic

Restic permet de créer un dépot *(qui peut être distant ou local)*, ce dépot chiffré sera le lieu où nous enverrons nos objets. Pour une première utilisation, on doit initialiser le dépot avec un **restic init** qui va créer la structure de fichier, et décider de la clé de chiffrement. Une fois le dépot créer, nous pourrons envoyer nos snapshots.  

Restic autorise l'utilisation de variables d'environnement. On peut les définir avant d'utiliser restic.

```bash
export AWS_ACCESS_KEY_ID=ab5u8coxxpvjxwq4zu74jifmvfvxfu2y
export AWS_SECRET_ACCESS_KEY=3hs9sopqqto9sf8hhet8i92di987qcs6
bucketName="thebidouilleur"        # variable séparée pour pouvoir la réutiliser ailleurs
export RESTIC_PASSWORD=Smudge9476       # Mot de passe de chiffrement 
export RESTIC_REPOSITORY="s3:https://eu2.contabostorage.com/${bucketName}"
```

*Ce ne sont pas mes vrais tokens, ne tentez pas d'utiliser les mêmes variables.*

On peut enfin laisser restic créer notre dépot :

```bash
restic init
```

Si aucune erreur n'apparait ... félicitation ! On peut faire un *restic backup* pour créer notre première snapshot !

L'usage d'un S3 me permettra également de sauvegarder mes conteneurs utilisant des volumes sur Longhorn. Je pourrai ainsi sauvegarder mes données et les restaurer sur un autre cluster.
