---
slug: netbootxyz
title: Boot PXE simplifié avec netboot 
---

## Qu’est-ce que le PXE ?  

Avant de démarrer la technique, petite explication des termes : 
- Le **PXE** *(Preboot Execution Environment)* est une technologie permettant d’amorcer une partition de démarrage via le réseau *(et notamment via le protocole TFTP)*. 
- L’**IPXE** est un fork de PXE proposant des fonctionnalités supplémentaires comme le chiffrement, l’usage du **SAN** / **HTTP** comme protocole, et permet d’utiliser un langage de scripting ! 


Voici un exemple de fichier `.ipxe` pour démarrer sur un Debian 9 *(Source : [Dépôt Github](https://github.com/AdrianKoshka/ipxe-scripts/blob/master/boot/linux/debian.ipxe))*
```bash
isset ${server-ip} || set server-ip 192.168.1.137

:start
#console --picture http://boot.ipxe.org/ipxe.png
menu debian
item --gap --             ---------------------- Net installer -----------------------------
item --key 3 Debian9_x86 Debian 9 (3)2-bit net install
item --key 6 Debian9_x86_64 Debian 9 (6)4-bit net install
item --gap --             ------------------------- Options --------------------------------
item --key g goback (G)o back to previous menu
choose version && goto ${version} || goto start

:Debian9_x86
echo Booting Debian 9 32-bit
kernel http://deb.debian.org/debian/dists/stretch/main/installer-i386/current/images/netboot/debian-installer/i386/linux initrd=initrd.gz
initrd http://deb.debian.org/debian/dists/stretch/main/installer-i386/current/images/netboot/debian-installer/i386/initrd.gz
boot || imgfree
goto start

:Debian9_x86_64
echo Booting Debian 9 64-bit
kernel http://deb.debian.org/debian/dists/stretch/main/installer-amd64/current/images/netboot/debian-installer/amd64/linux initrd=initrd.gz
initrd http://deb.debian.org/debian/dists/stretch/main/installer-amd64/current/images/netboot/debian-installer/amd64/initrd.gz
boot || imgfree
goto start

:goback
chain http://${server-ip}/boot/linux.ipxe
```

## NetBoot.xyz

NetBoot est un site proposant de démarrer sur un menu sur lequel nous allons choisir différents systèmes sur lequel booter. (*via des scripts ipxe*)
Cette solution est pratique lorsque nous n’avons pas moyen d’avoir une clé USB bootable et que l’on doit installer un système *from scratch*.

Sur certains systèmes, il est possible de fournir des scripts d’installations *(ex : preseed pour debian, kickstart pour rockylinux)*.

NetBoot permet d’utiliser plusieurs méthodes d’amorçage sur une machine *(TFTP, via ISO, IPXE, depuis GRUB)*, vous trouverez ces méthodes [ici](https://netboot.xyz/docs/category/booting-methods)

en IPXE voici les commandes à taper : 
```bash
dhcp
chain --autofree https://boot.netboot.xyz
```

Cet usage peut suffire. Mais dans cette documentation, nous allons utiliser la partie *selfhost* de NetBoot pour être indépendant du site.

## Installer NetBoot

### Avec Ansible

NetBoot fourni un *role Ansible* pour l’installation. *(Solution que je n’ai pas utilisé)*

```bash
git clone https://github.com/netbootxyz/netboot.xyz.git /opt/netboot.xyz
cd /opt/netboot.xyz
ansible-playbook -i inventory site.yml # par défaut, s'installe sur la machine directement (et non par ssh)
```
### Avec Docker

```yml
---
version: "2.1"
services:
  netbootxyz:
    image: ghcr.io/netbootxyz/netbootxyz
    container_name: netbootxyz
    volumes:
      - ./config:/config # optional
      - ./assets:/assets # optional
    ports:
      - 3000:3000
      - 69:69/udp
      - 80:80 #optional
    restart: unless-stopped
```

L’interface WEB est disponible sur le port 3000. (*192.168.1.137:3000*)

## Configurer le DHCP pour un démarrage PXE

Il faudra avoir les pleins-pouvoirs sur votre DHCP. *(Je précise puisque ma pauvre livebox ne me permet pas de modifier mes options DHCP par défaut)*
Si ce n’est pas le cas, je vous invite à suivre [cette documentation pour créer votre propre serveur DHCP avec Dnsmasq](/docs/AdminSys/dnsmasq).

Sur mon DHCP, je crée le fichier `/etc/dnsmasq.d/pxe-boot.conf` qui va indiquer le fichier de démarrage et le serveur TFTP sur lequel démarrer :
```conf
dhcp-boot=netboot.xyz.kpxe,pxeserver,192.168.1.137
```

:::info Fichier de démarrage ? 
Les fichiers disponibles sont expliqués sur le site : 
![Tableau Fichiers Démarrages Disponibles](/img/netboot-filetype.png)
:::


Ensuite, redémarrez votre dnsmasq : 

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="alpine" label="alpine">

    service dnsmasq restart

  </TabItem>
  <TabItem value="debian/centos" label="debian/centos" default>

    systemctl restart dnsmasq

  </TabItem>
</Tabs>
```

Maintenant, notre DHCP va bien renvoyer vers notre serveur TFTP (*netboot*). Pour vérifier que ça soit bien le cas, je vous invite à passer par un **script nmap** : 

```bash
➜ sudo nmap --script broadcast-dhcp-discover
Starting Nmap 7.80 ( https://nmap.org ) at 2023-02-05 09:14 CET
Pre-scan script results:
| broadcast-dhcp-discover: 
|   Response 1 of 1: 
|     IP Offered: 192.168.1.67
|     DHCP Message Type: DHCPOFFER
|     Server Identifier: 192.168.1.250
|     IP Address Lease Time: 2m00s
|     TFTP Server Name: pxeserver\x00
|     Bootfile Name: netboot.xyz.kpxe\x00
|     Renewal Time Value: 1m00s
|     Rebinding Time Value: 1m45s
|     Subnet Mask: 255.255.255.0
|     Broadcast Address: 192.168.1.255
|     Domain Name Server: 192.168.1.250
|     Domain Name: thebidouilleur.xyz
|_    Router: 192.168.1.1
```

On ne peut pas voir l’IP du serveur TFTP directement *(Apparemment, il manque une ligne dans le script, voici le [lien d’une réponse Stack Overflow si le sujet vous intéresse](https://serverfault.com/a/996093))*

Maintenant, on peut démarrer en PXE sur une machine ! 

## Usage de NetBoot

Pour les tests, je passe par des machines virtuelles sur mon Proxmox local.

![Amorçage PXE](/img/demarrage_pxe.gif)

On peut démarrer sur les live-CD/systèmes proposés à partir de cette étape. Notre NetBoot va communiquer avec le dépôt GitHub du logiciel ainsi que par le site boot.netboot.xyz.

Mais pour être totalement indépendant des serveurs *(& dépôt)* de NetBoot, il va falloir réaliser ces prochaines étapes : 

## Utiliser ses assets locaux

Si netboot est bien pratique, je me vois mal utiliser ça dans un bâtiment de 300 postes en priant pour que la bande passante suffise.

```config
# set boot domain
set boot_domain 192.168.1.137
# ...
# set location of custom netboot.xyz live assets
set live_endpoint http://192.168.1.137
...
```
Ainsi, netboot utilisera **notre** instance, ainsi que **nos assets**. Il est donc important de télécharger les fichiers utiles aux distributions/outils sur lequel nous voudrons amorcer nos systèmes.

Dans l’onglet **Local Assets**, il suffira de cocher les fichiers à récupérer en local. 

Ainsi, pour pouvoir démarrer un clonezilla en version ubuntu depuis notre netboot, il faudra télécharger ces fichiers : 
![Local Assets pour clonezilla-ubuntu](/img/netboot-assets.png)

## Conclusion 

Netboot est une solution très complète nous permettant d’installer plusieurs machines en même via un support bien plus moderne qu’une clé USB. Celui-ci propose une solution fonctionnelle sans devoir héberger quoique ce soit, mais nous laisse la possibilité de devenir indépendant en récupérant les assets sur notre serveur.

Ayant déjà été dans le cas où je devais installer de nombreux postes le plus rapidement possible, je peux maintenir réitérer l’expérience sans problème *(et notamment avec l’usage de preseed/kickstart)*.