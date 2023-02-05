---
slug: dnsmasq
title: Mettre en place un DNS / DHCP avec DNSMASQ
---

## Introduction

Petite présentation de Wikipédia : 
> Dnsmasq est un serveur léger conçu pour fournir les services DNS, DHCP, Bootstrap Protocol et TFTP pour un petit réseau, voire pour un poste de travail. Il permet d’offrir un service de nommage des machines du réseau interne non intégrées au service de nommage global (i.e. le service DNS d’Internet). Le service de nommage est associé au service d’adressage de telle manière que les machines dont le bail DHCP est fourni par Dnsmasq peuvent avoir automatiquement un nom DNS sur le réseau interne. Le logiciel offre un service DHCP statique ou dynamique. 

En résumé, Dnsmasq est un package tout-en-un permettant de créer un serveur DNS et DHCP.


:::note Article non-prévu
À la base, je prévoyais simplement de faire un article sur **NetBoot**. Mais je me suis rendu compte qu’il fallait absolument passer par l’étape DHCP.
J’ai donc écrit à la va-vite cette documentation en tant que *base* pour d’autres documentations.
:::

## Installation

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="alpine" label="alpine" default>

    apk add dnsmasq

  </TabItem>
  <TabItem value="debian/ubuntu" label="debian/ubuntu" default>

    apt install dnsmasq

  </TabItem>
  <TabItem value="centos/rocky" label="centos/rocky">

    yum install dnsmasq

  </TabItem>
</Tabs>
```


### DHCP

Première chose que l’on peut faire avec Dnsmasq est de démarrer le serveur DHCP. Le fichier de configuration est à cet emplacement : `/etc/dnsmasq.conf`. Par défaut, celui-ci devrait n’avoir aucune ligne décommentée en dehors de celles-ci : 
```conf
local-service # ne communiquer qu'avec les machines dans notre réseau
conf-dir=/etc/dnsmasq.d/,*.conf # importer les fichiers *.conf dans le dossier /etc/dnsmasq.d/
```

Nous allons créer un fichier `/etc/dnsmasq.d/dhcp.conf` pour démarrer notre DHCP : 
```conf
# dhcp.conf
listen-address=::1,127.0.0.1,192.168.1.250  # adresses d'écoutes
dhcp-range=192.168.1.50,192.168.1.150,24h   # Plage d'adresses et durée des baux
domain=thebidouilleur.xyz                   # domaine
dhcp-option=1,255.255.255.0                 # masque 
dhcp-option=3,192.168.1.1                   # passerelle
```

Une fois notre fichier créé, on peut vérifier la configuration avec `dnsmasq --test`.

Si aucune erreur n’est trouvée, nous pouvons lancer le service.

```mdx-code-block
<Tabs>
  <TabItem value="alpine" label="alpine">

    service dnsmasq start

  </TabItem>
  <TabItem value="debian/centos" label="debian/centos" default>

    systemctl start dnsmasq

  </TabItem>
</Tabs>
```

#### Bail statique

Une fonctionnalité basique d’un serveur DHCP est de pouvoir attribuer une IP bien précise à un hôte.

Pour attribuer une IP spécifique, il est obligatoire de renseigner l’adresse MAC de la machine. On peut trouver cette adresse via la commande `ip a`, l’interface a choisir est bien évidemment celle qui est présente dans notre réseau.

Si l’hôte est accessible en réseau, vous pouvez utiliser la commande `arp`. 
```bash
➜ arp 192.168.1.29 
Adresse                  TypeMap AdresseMat          Indicateurs           Iface
192.168.1.29             ether   ae:1a:60:8a:73:7a   C                     enp47s0
```

Cette adresse doit se référencer dans la configuration de Dnsmasq. J’ai créé le fichier `/etc/dnsmasq.d/static-ip.conf`.
```conf
# /etc/dnsmasq.d/static-ip.conf
dhcp-host=10:bf:48:8b:6d:cf,192.168.1.20
dhcp-host=ae:1a:60:8a:73:7a,192.168.1.29
# Ajoutez autant de ligne que d'IP à fixer
```

```mdx-code-block
<Tabs>
  <TabItem value="alpine" label="alpine">

    service dnsmasq restart

  </TabItem>
  <TabItem value="debian/centos" label="debian/centos" default>

    systemctl restart dnsmasq

  </TabItem>
</Tabs>
```

### DNS

Par défaut, dès que l’instruction `listen-address` est définie, le serveur DNS est actif. Pour que dnsmasq soit utilisé en tant que DNS, il faut bien qu’il soit fourni par le DHCP (ex: `server=192.168.1.211`).
Pour spécifier des serveurs DNS à interroger lorsque *dnsmasq* reçoit une requete à résoudre, créez un fichier `/etc/dnsmasq.d/dns.conf` avec le contenu suivant: 
```conf
server=192.168.1.211                        
server=1.1.1.1                              
```

#### Forcer IP sur un domaine

Créer un fichier `/etc/dnsmasq.d/override-dns.conf`
```conf
address=/test.com/127.0.0.1 # pointer test.com vers 127.0.0.1
address=/.xyz/127.0.0.1     # pointer le wildcard .xyz vers 127.0.0.1
```

#### Désactiver le DNS

Pour désactiver la fonctionnalité “DNS” de dnsmasq, il suffit juste de préciser à utiliser le port 0.

```conf
port=0
```

Mais si jamais vous désactivez le DNS, il faudra bien fournir **une autre IP** au DHCP *(pour que les clients ne se retrouvent pas dépourvus de DNS)*. 
Dans votre fichier `/etc/dnsmasq.d/dhcp.conf`, rajoutez la ligne : 

```conf
dhcp-option=6,192.168.1.211,192.168.1.1
```
