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

Au début, je souhaitais ré-utiliser Infomaniak ou Scaleway pour me monter un cluster en quelques minutes via Terraform.

Ainsi, je fais mon *apply* pour que mon cluster soit monté, je m'entraine et lorsque j'ai terminé : je *destroy* mes machines.

Mais ça, c'était parce que j'avais oublié que j'étais radin !

![Picsou](https://media.giphy.com/media/4GRj3pwoAJSwg/giphy.gif)
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