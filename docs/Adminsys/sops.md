---
slug: sops 
title: Stocker des secrets dans un dépôt Git
tags:
  - gitops
  - sops
description: Sops est un utilitaire créé par Mozilla permettant de chiffrer ses secrets
---

Éviter d’envoyer ses secrets sur Git, nous devons toujours être vigileant avant un quelconque Push. Et c’est justement le but de  **Sops** *(Secrets OPerationS)* qui va nous aider à stocker nos informations sur le dépôt.. mais en les chiffrant.

Celui-ci est compatible avec de nombreux gestionnaires de secret comme : 
- Hashicorp Vault
- GCP KMS
- PGP
- Age *(Celui que nous allons utiliser)*

:::info Age
Age est un outil en Go simple et moderne. Celui-ci propose un format qui semble être validé par de nombreux experts.
:::

## Créer notre clé Age

:::note Installer Age

Vous pouvez installer Age en suivant les instructions sur le dépôt officiel [ici](https://github.com/FiloSottile/age)

:::


Nous allons donc créer notre propre clé avec age. 

```bash
mkdir -p ~/.keys/
age-keygen -o ~/.keys/ma-cle
```

En inspectant le contenu du fichier `~/.keys/ma-cle`, nous remarquons un schéma que l’on connait bien : une clé publique, et une clé privée. 

```
# created: 2023-02-15T07:50:20+01:00
# public key: age1220x7zmnp0j8du3vxk67a4mdkr3gqn9djjn7f7gamjclr3em7g2sxpns35
AGE-SECRET-KEY-1JY9Q0NWNRK4DCT9J3D2H0Z9D5ZY0XHV8EJ39JKKK2PW6SUH9FTFSN9T6HF
```

Et pour que *Sops* utilise cette clé, nous allons créer la variable d’environnement `SOPS_AGE_KEY_FILE` dans notre `~/.bashrc` ou `~/.zshrs`.

```bash
export SOPS_AGE_KEY_FILE=~/.keys/ma-cle
```

Maintenant, nous pouvons passer au niveau supérieur : **créer notre premier fichier de secret**.

## Sops, en pratique

:::note Installer Sops

Vous pouvez installer Sops sur un système Amd64 en suivant ces instructions: 
```bash
wget https://github.com/mozilla/sops/releases/download/v3.7.3/sops-v3.7.3.linux.amd64 -O /usr/bin/sops
chmod +x /usr/bin/sops
```
:::


Notre système d’authentification est déjà créé : c’est notre couple de clé AGE. Ce que nous allons faire maintenant, c’est créer un secret qui sera déchiffrable uniquement par notre clé privée.

Première chose que nous allons faire, c’est créer notre fichier `.sops.yaml`.

Ce fichier permet de définir quels fichiers devront être manoeuvrés par SOPS et surtout : quels clés ont accès à ces fichiers. 

```yml
# .sops.yaml
creation_rules:
    - path_regex: secret.*\.ya?ml
      encrypted_regex: "^(username|password)$"
      key_groups:
      - age:
        - age1220x7zmnp0j8du3vxk67a4mdkr3gqn9djjn7f7gamjclr3em7g2sxpns35
```

Créons maintenant un fichier `secret.dev.yml`: 
```yaml
username: "thebidouilleur"
password: jadorelabidouille
url: "https://thebidouilleur.xyz"
QI: 7.2
```

et affichons ce même fichier en le chiffrant avec sops via l’argument `-e` *(encrypt)*.
```bash
➜  sops -e secret.dev.yml
username: ENC[AES256_GCM,data:8KUxRrhWLWsbxzJqxRQ=,iv:qJQYUgCQ6wv9fmn+scJ3ui7tFD6lpoRH0qpC+n58sF8=,tag:RJdluEfMdnXy6Zhpxn2AyQ==,type:str]
password: ENC[AES256_GCM,data:dm9t60SH/4/wqy3Ww5RxaDU=,iv:ch0ZRbhN6+ouCNXzgWO63GHK9ewgOMpfJMzjYxIq8h4=,tag:EKRHJBwRV8ZRRpDMaGG4sQ==,type:str]
url: https://thebidouilleur.xyz
QI: 7.2
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age14ysm820ajay8wqslnkjqcewvq4tmeucth3a88qk4a7hl0mnwkfaqmj6xx5
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBHZU9xNklSTkRTU0p0SFV3
            NE1tV2M2Wjk3SDl2a1lJWk8wQi96Yjk2eUVjCi9qSWREUkZqTFpOa1luZEFlb2lK
            dHBBNDllSFlhL2cycW82SGl4bDU2YXcKLS0tIHd5aCsyK1BHT2dDTGpZWUxITE83
            MFd5MlowTHNIekVXTzJWbXNuUmxGRWsKp1o+kh9lbWBLh6rZ4845c31rxowb9uX+
            /a01TYbiWfn2lWmUJ+gXq0nQZxqo3iDEI+mrG+n+c79rmq6BGPYVPw==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2023-02-15T11:44:32Z"
    mac: ENC[AES256_GCM,data:cUtxnG/ycha3Zk0xNrmeioeBB9SiH3U4ENbnGtkpJmM9SBOFVZGKikaDZwdk1c2aflC07kELIoN0BxspgJseCLNvA3nsTYEEjHe53zJZUaDYn7u0D1+th3XjYdU17zdx9ECN5SjExvOIDLmQ4j512/LCN+lBVi4SxaJWDqzzva0=,iv:vhrbuibyInOxcYihgMVZN8c0v05GdPXB+EbACQijg9s=,tag:GHLv+agLCXcTiUDq8gBEkA==,type:str]
    pgp: []
    encrypted_regex: ^(username|password)$
    version: 3.7.3
```

Ni l’URL, ni mon QI n’ont été chiffrés. Gardez également en *tête* que la commande **ne fait qu’afficher un output du même fichier chiffré, le fichier n’a pas été modifié**. 

Si on souhaite ré-écrire le fichier, il faut rajouter l’argument `-i` : `sops -e -i secret.dev.yml`

Pour déchiffrer le fichier, il suffit de faire la même commande en changeant `-e` par `-d` *(decrypt)*.

Si jamais je chiffre mon fichier `secret.dev.yml` et que je change de clé, nous serons dans l’incapacité de le chiffrer : 
```
➜ sops -d -i secret.dev.yml
Failed to get the data key required to decrypt the SOPS file.

Group 0: FAILED
  age14ysm820ajay8wqslnkjqcewvq4tmeucth3a88qk4a7hl0mnwkfaqmj6xx5: FAILED
    - | no age identity found in "~/.keys/ma-cle" that
      | could decrypt the data

Recovery failed because no master key was able to decrypt the file. In
order for SOPS to recover the file, at least one key has to be successful,
but none were.
```

Pour ajouter une clé pouvant déchiffrer les fichiers, rajoutez-là dans votre `.sops.yaml`.

En déchiffrant puis rechiffrant les fichiers, la nouvelle clé y aura accès.