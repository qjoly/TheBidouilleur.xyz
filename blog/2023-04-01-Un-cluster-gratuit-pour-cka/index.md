---
slug: cluster-entrainement-cka
title: Un cluster Kubernetes gratuit pour s'entrainer à la CKA
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: 'https://github.com/qjoly/'
  image_url: 'https://avatars.githubusercontent.com/u/82603435?v=4'
tags: [Kubernetes, CKA]
---

J'ai appris Kubernetes seul en suivant diverses documentations, en pratiquant et en cassant régulièrement mes clusters *(rarement volontaire, je précise)*. Lorsque je veux tester une procédure, je monte un cluster temporaire en utilisant KinD [*(j'en parle sur cette page si le sujet vous intéresse)*](/docs/Kubernetes/kind) le temps de ma manœuvre.

Et comme je n'ai pas envie de casser *volontairement* mes clusters pour m'entrainer au passage de la CKA, je me suis penché sur les différentes possibilités pour monter un cluster de test.

Mon Proxmox en cloud n'a pas suffisamment de performances pour héberger **2** clusters dans des machines virtuelles, mon *petit* DS57U3 n'a également pas de puissance à accorder à un cluster.

Alors, cherchons un cloud peu cher qui nous permet de monter un cluster Kubernetes facilement !

:::note Prérequis

Les machines maitresses demandent 1 CPU et 2 Go de RAM, les machines esclaves 1 CPU et 1 Go de RAM. Je souhaite rester dans ces limites pour ne pas avoir à payer plus cher.

:::

Chez Infomaniak, un cluster 5 *nœuds* (3 masters, 2 workers) coûte 0.02885€/heure, soit 21€/mois. Et chez Scaleway, un cluster 5 *nœuds* (3 masters, 2 workers) coûte 0.044€/heure, soit 30€/mois.

C'est un cout raisonnable pour un cluster de test *(d'autant plus que je peux peut-être automatiser la construction du cluster avec Ansible/Terraform pour ne pas payer les machines les jours où je ne m'entraine pas)*.

Mais un problème que j'avais oublié de mentionner, c'est que je suis radin !
![Picsou](https://media.giphy.com/media/4GRj3pwoAJSwg/giphy.gif)

Alors, nous allons chercher une autre solution me permettant de payer moins cher, mais qui reste simple à mettre en place.

## Oracle Free-Tier

Oracle Free-Tier offre un tenant sur leur cloud. Nous avons alors 24Go de RAM et 4 CPU à répartir sur une ou plusieurs machines ARM ainsi que 2 machines virtuelles AMD64 avec chacune 1 CPU et 1 Go de RAM.

Génial, non ? Nous avons ainsi nos 4 nœuds pour un coût de 0€/mois !

```
fatal: [node5]: FAILED! => {
    "assertion": "ansible_memtotal_mb >= minimal_node_memory_mb",
    "changed": false,
    "evaluated_to": false,
    "msg": "Assertion failed"
}
```

```
minimal_node_memory_mb: 800
minimal_master_memory_mb: 1500
```
roles/kubernetes/preinstall/defaults/main.yml

```
enable_nodelocaldns: false
enable_nodelocaldns_secondary: false
```

wget https://github.com/derailed/k9s/releases/download/v0.27.3/k9s_Linux_arm64.tar.gz -O- -q | tar xvfz -

```
sudo cp -r /root/.kube ~/
sudo chown $(whoami): -R .kube/
```