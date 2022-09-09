# MultiArch Build
Installation de mini-émulateur pour les autres architectures:
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
