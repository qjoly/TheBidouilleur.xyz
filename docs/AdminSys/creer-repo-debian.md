---
slug: creer-repo-debian
title: Créer son dépot Debian
---

![Schema](https://www.aptly.info/img/schema.png)


## Génération Couple GPG

```bash
gpg --full-generate-key
```
```bash
# gpg --list-keys
/root/.gnupg/pubring.kbx
------------------------
pub   rsa3072 2023-02-11 [SC]
      2DB7FDA5442C053973F9F3CAB55A4CDD19C23946
uid          [  ultime ] Quentin JOLY (Aptly Repo) <github@thoughtless.eu>
sub   rsa3072 2023-02-11 [E]
```



mimbko2v59MAPu
2DB7FDA5442C053973F9F3CAB55A4CDD19C23946

```bash
mkdir -p ~/.aptly/public/
gpg --armor --output ~/.aptly/data/public/gpg --export 2DB7FDA5442C053973F9F3CAB55A4CDD19C23946
```

```bash
aptly repo create unstable 
aptly repo add unstable unstable/
aptly snapshot create unstable from repo unstable
aptly publish snapshot -architectures="amd64,arm64" -distribution="unstable" -gpg-key="2DB7FDA5442C053973F9F3CAB55A4CDD19C23946" unstable
---
aptly publish drop unstable
aptly snapshot drop unstable
aptly repo drop unstable
```



```bash
aptly repo create stable
aptly repo add stable stable/
aptly snapshot create stable from repo stable
aptly publish snapshot -architectures="amd64,arm64" -distribution="stable" -gpg-key="2DB7FDA5442C053973F9F3CAB55A4CDD19C23946" stable 
---
aptly publish drop stable
aptly snapshot drop stable
aptly repo drop stable
```

wget -O - -q http://192.168.1.102:8080/gpg | sudo apt-key add -
sudo apt install hello-world