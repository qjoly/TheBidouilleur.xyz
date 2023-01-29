---
title: Build Docker multi-architecture
slug: MultiArch Build
---

J’utilise beaucoup Docker sur mes raspberry pi 4. L’inconvénient est que les images ne sont pas toujours compatibles avec une architecture ARM.
Nous allons donc voir comment build des images ARM sous une machine Amd64.

Installation de mini-émulateur pour les autres architectures :
```bash
 docker run --privileged --rm tonistiigi/binfmt --install all
```
Créer un builder (qui utilisera votre poste local ainsi que ses architectures compatibles) 
```bash
 docker buildx create --use
```
Build et push : 
```bash
 docker buildx build --platform=linux/arm64,linux/amd64,linux/arm/v7,linux/arm/v6 -t localhost:5000/test . --push
```
