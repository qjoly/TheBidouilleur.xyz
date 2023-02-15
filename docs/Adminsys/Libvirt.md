---
slug: rootless-libvirt
title: Utiliser libvirt en utilisateur non-root
tags:
  - virtualisation
---

## Qu’est-ce que libvirt ?

> libvirt est une bibliothèque, une API, un daemon et des outils en logiciel libre de gestion de la virtualisation. Elle est notamment utilisée par KVM, Xen, VMware ESX, QEMU et d’autres solutions de virtualisation. 

Je suis un adepte de Proxmox comme Hyperviseur, je l’utilise dans mes environnements de “production”. Mais lorsque je n’ai pas le besoin d’un tel environnement, je préfère m’orienter vers Libvirt que je trouve plus léger et plus agréable à utiliser au quotidien.
Ainsi, qu’il s’agisse d’un serveur ou d’une workstation, j’installe toujours libvirt *(avant même d’en avoir le besoin)*. 

Cette page vous indiquera les étapes à suivre pour utiliser libvirt sur votre workstation sans devoir passer en `root`.

:::caution Libvirt est déjà rootless

Libvirt propose déjà un socket rootless. L’interet de donner l’accès au socket `qemu:///system` *(uniquement pour root par défaut)* est de permettre à plusieurs utilisateurs d’avoir le même pool de VM.
```bash
virsh -c qemu:///session list
```
:::


## Usage de libvirt en rootless

Nous n’allons pas permettre à votre utilisateur de se connecter au socket Libvirt system directement. En revanche, nous allons modifier ses permissions pour permettre à un groupe complet d’y avoir accès. 
Ce groupe sera `libvirt`, qui devrait déjà être présent sur votre machine.


Vérifiez l’existence du groupe `libvirt`: 
```bash
└─▪grep libvirt /etc/group
libvirt:x:138:libvirtdbus
libvirt-qemu:x:64055:libvirt-qemu
libvirt-dnsmasq:x:139:
libvirtdbus:x:141:
```
Si jamais le groupe n’existe pas, vous devrez le créer via la commande `sudo groupadd --system libvirt`. 

Ensuite, Ajoutez votre utilisateur au groupe `libvirt` *(dans mon cas, mon utilisateur est *kiko*)* : `sudo usermod -a -G libvirt kiko`

:::tip Vérifiez que votre utilisateur est bien dans le groupe `libvirt`

La commande `id` n’affichera pas de suite la modification, tentez plus un `id $(whoami)`
:::

Une fois que notre utilisateur bien présent dans le groupe `libvirt`, nous allons indiquer à libvirt que le socket devrait avoir des permissions 
Dans le fichier `/etc/libvirt/libvirtd.conf`, décommettez ces deux lignes : 
```ini
unix_sock_group = "libvirt"
unix_sock_rw_perms = "0770"
```

Maintenant, il te reste qu’à redémarrer le service libvirt : `sudo systemctl restart libvirtd.service`

Pour tester : `virsh -c qemu:///system list`


