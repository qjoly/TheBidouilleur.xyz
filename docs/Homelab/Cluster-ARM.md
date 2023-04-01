---
slug: cluster-arm
title: Création d'un cluster ARM
---

Après avoir fait *mumuse* avec mon Dell R610 qui consomme 120W au repos, je me suis toujours posé la question de la consommation en électricité de mes appareils. Je m'interesse donc à un Homelab qui pourrait être le plus économe possible en énergie.

Et la solution : pas besoin de la chercher bien loin !

L'**ARM** est pour l'instant la solution la plus rentable en terme de rapport énergie/performance. *(j'essaierai un jour de passer sur de l'alderlake pour du **amd64**)*
Le prix me permettra de prendre un plus grand nombre d'appareil et de m'orienter vers ma source principale d'apprentissage du moment : **KUBERNETES** !

## Explication du projet

 J'utilise actuellement un vieux Laptop de récupération. Celui-ci est équipé d'un Intel i3, et 12Go de mémoire vive DDR3.  J'y ai installé Proxmox et 4 machines virtuelles qui forment un cluster k3s qui fonctionne très bien.

Ce setup est fonctionnel et me suffit pour le moment. Mais.. car il en faut un, je me demande si je ne peux pas faire plus simple, plus économique (en énergie) et avec une facilité de réparation/maintenance matériel. (ex: si mon laptop meurt, toutes mes VMs aussi).

Et pour répondre à cette problématique, je m'intéresse de plus en plus aux micro-ordinateurs tels que les Raspberry Pi.

### Besoins obligatoires

- Petit (j'aimerai éviter de repasser sur un Wyse)
- Faible consommation (Processeur ARM?)
- Minimum 4 nœuds
- Minimum 4Go/noeuds
- Rapport prix/perf raisonnable (payer  100€  pour  une  petite  machine  à  2Go  de  RAM  →  non)

### Besoins optionnels

- Open-Hardware
- Matériel homogène

## Un boitier des plus atypique

Comme on dit en cuisine : *l'intérieur est aussi important que l'extérieur*
Je recycle une vieille ampli Marshall pour y mettre les différentes machines au même endroit, ça permettra de pouvoir déplacer le cluster facilement (et de le soulever pour le ménage)

:::danger Article en cours de rédaction

Cette page est toujours en écriture.

:::
