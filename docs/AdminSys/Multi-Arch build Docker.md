---
title: Build Docker multi-architecture
slug: MultiArch Build
tags:
  - Docker
---

J’utilise beaucoup Docker sur des environnements ARM *(Notamment mon cluster de Raspberry PI)*. Le problème est que les images ne sont pas toujours compatibles avec une architecture ARM.

J'ai donc recherché comment créer des images OCI multi-architectures *(pouvant se lancer sur des postes Amd64 ou ARM)*. Nous allons donc voir comment build des images ARM sous une machine Amd64.

Installation d'un émulateur d'architecture :

```bash
 docker run --privileged --rm tonistiigi/binfmt --install all
```

Créer un builder *(qui utilisera votre poste local ainsi que ses architectures compatibles)*, cela va créé un contexte dans lequel Docker va build vos images. Il est obligatoire de lancer cette commande avec les droits **root**, l'usage de Docker en rootless n'est pas possible à cette étape.
```bash
 docker buildx create --use
```

Voici le résultat *(avec les émulateurs installés)*:
```
└─▪sudo docker run --privileged --rm tonistiigi/binfmt --install all 
Unable to find image 'tonistiigi/binfmt:latest' locally
latest: Pulling from tonistiigi/binfmt
8d4d64c318a5: Pull complete 
e9c608ddc3cb: Pull complete 
Digest: sha256:66e11bea77a5ea9d6f0fe79b57cd2b189b5d15b93a2bdb925be22949232e4e55
Status: Downloaded newer image for tonistiigi/binfmt:latest
installing: arm OK
installing: riscv64 OK
installing: mips64 OK
installing: ppc64le OK
installing: mips64le OK
installing: arm64 OK
installing: s390x OK
{
  "supported": [
    "linux/amd64",
    "linux/arm64",
    "linux/riscv64",
    "linux/ppc64le",
    "linux/s390x",
    "linux/386",
    "linux/mips64le",
    "linux/mips64",
    "linux/arm/v7",
    "linux/arm/v6"
  ],
  "emulators": [
    "qemu-aarch64",
    "qemu-arm",
    "qemu-mips64",
    "qemu-mips64el",
    "qemu-ppc64le",
    "qemu-riscv64",
    "qemu-s390x"
  ]
}
```

:::tip
Vous pouvez gérer plusieurs contextes, il suffit d'utiliser la commande `docker buildx use [votre contexte]`

Les différents contextes sont visibles via `docker buildx ls` *(Vous verrez également les architectures compatibles avec vos contextes)*
:::

Et une fois les émulateurs installés, nous pouvons build notre image via `docker buildx build` en précisant les architectures:
```bash
 docker buildx build --platform=linux/arm64,linux/amd64,linux/arm/v7,linux/arm/v6 -t localhost:5000/test . --push
```

---
Je creuserai à l'avenir l'utilitaire `docker buildx`, celui-ci ajoute de nombreux fonctionnalités à Docker *(Par exemple en utilisant le langage HCL qu'on retrouve dans Terraform/Packer)*.
