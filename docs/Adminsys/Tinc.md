---
title: Tinc - VPN de Mesh
tags:
  - reseau
  - vpn
  - infra
description: Lorsqu'on multiplie les infrastructures (locales, distante etc..), avoir un VPN de Mesh permet de vous faciliter la vie. Nous allons donc installer et configurer Tinc.
---

## Introduction

Je dispose de 3 serveurs différents: 
- Un serveur dédié en cloud *(avec une dizaine de VMs)*
- Un cluster de raspberry à la maison *(4 machines)*
- Et un serveur de redondance dans un autre DC

Et juste avec ces machines, ça fait un bon nombre d’accès à gérer sur ma workstation. De plus, les machines peuvent difficilement communiquer entre elles *(en local je passe par des redirections ssh)*, et il m’est impossible de faire communiquer mes machines sans ouvrir un accès. 

C’est pourquoi j’étais en pleine recherche d’une solution comme Wireguard en tant que VPN Mesh ([exemple ici](https://www.scaleway.com/en/docs/tutorials/wireguard-mesh-vpn/)), et je suis tombé sur un article de ZWindler expliquant sa solution autour de Tinc. 

Cette page n’est qu’une reprise de son tutoriel en réadaptant certains points. 

### Installation du serveur

La machine hote de l’hébergeur est une VM sur mon dédié ayant Debian 11 comme distribution. 
Tinc est directement disponible sur les dépots officiels sans aucune action (pas besoin d’ajouter les paquets unstables) 
```bash
apt install tinc
```

Dans mon cas, je créé “vpnforky” *(forky étant le nom de mon dédié)*, celui-ci doit être déclaré dans le fichier nets.boot **si vous utilisez sysvinit** *(sinon on pourra passer par systemd)*
```bash
mkdir -p /etc/tinc/vpnforky/hosts
echo "vpnforky" >> /etc/tinc/nets.boot # inutile si vous utilisez systemd
```

Nous allons créer le fichier `/etc/tinc/vpnforky/tinc.conf` pour définir le nom de notre machine. (servertinc dans mon cas)
```
Name = servertinc
AddressFamily = ipv4
Interface = tun0
```

Puis on va créer le fichier réprésentant notre machine dans le réseau du VPN ainsi que l’endpoint (ip) accessible par toutes les machines
```
Address = 100.100.100.100
Subnet = 10.0.0.1/32
```

Ce fichier sera complété par génération des clés RSA permettant l’authentification des machines du réseau. 
```bash
sudo tincd -n vpnforky -K4096
```

Nous allons également créer 2 scripts Bash pour configurer notre IP Privée dans le réseau mesh. 
 /etc/tinc/vpnforky/tinc-up
```bash
#!/bin/sh
ip link set $INTERFACE up
ip addr add 10.0.0.1/32 dev $INTERFACE
ip route add 10.0.0.0/24 dev $INTERFACE
```

 /etc/tinc/vpnforky/tinc-down
```bash
#!/bin/sh
ip route del 10.0.0.0/24 dev $INTERFACE
ip addr del 10.0.0.1/32 dev $INTERFACE
ip link set $INTERFACE down
```
et rendre ces scripts executales
```bash
chmod 755 /etc/tinc/vpnforky/tinc-*
```


Nous n’avons plus besoin de faire quoique ce soit pour configurer le serveur. (Nous reviendrons un peu plus tard pour autoriser des machines à se connecter)

On démarre le VPN
```bash
sudo systemctl status tinc@vpnforky
```

### Installation d’un client

Maintenant, on va créer notre premier hote externe au réseau. Mon client se nomme “offsite”

```bash
apt install tinc
mkdir -p /etc/tinc/vpnforky/hosts
```

On va créer notre fichier /etc/tinc/vpnforky/tinc.conf
```
Name = offsite
AddressFamily = ipv4
Interface = tun0
ConnectTo = servertinc
```
Notez que maintenant, nous avons un ConnectTo qui permettra de dire quelle machine est notre serveur. 

On créé le fichier hote (qui sera complété automatiquement)  /etc/tinc/vpnforky/hosts/offsite
```bash
Subnet = 10.0.0.2/32
```

Génération des clés
```
tincd -n vpnforky -K4096
```

Et comme pour le serveur, on créé les scripts de configuration réseau
 /etc/tinc/vpnforky/tinc-up
```bash
#!/bin/sh
ip link set $INTERFACE up
ip addr add 10.0.0.2/32 dev $INTERFACE
ip route add 10.0.0.0/24 dev $INTERFACE
```

 /etc/tinc/vpnforky/tinc-down
```bash
#!/bin/sh
ip route del 10.0.0.0/24 dev $INTERFACE
ip addr del 10.0.0.2/32 dev $INTERFACE
ip link set $INTERFACE down
```
et rendre ces scripts executales
```bash
chmod 755 /etc/tinc/vpnforky/tinc-*
```

Maintenant que notre client est bien configuré, nous allons copier le fichier `/etc/tinc/vpnforky/hosts/offsite` (*contenant notre IP-VPN et notre certificat*)  **vers** le dossier /etc/tinc/vpnforky/hosts **du serveur Tinc**. Cela permettra d’authentifier notre machine pour se connecter au réseau. 

Notre machine possède bien la bonne IP et on peut maintenant ping dans notre réseau. 
```
root@offsite:~# systemctl start tinc@vpnforky
root@offsite:~# ping -c 3 10.0.0.1
PING 10.0.0.1 (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=157 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=156 ms
64 bytes from 10.0.0.1: icmp_seq=3 ttl=64 time=156 ms
```

*(Les délais sont assez élevés, je pense que c’est dû à ma VM Tinc qui n’est pas puissante, et ne possède pas un grand débit)*

S’il faut ajouter d’autres machines, il faudra suivre la même procédure *(Installer tinc, générer certificat et fichier hôte, ajouter le fichier sur le serveur)*. 


## Configuration Nix pour rejoindre le réseau Tinc

Voici le fichier **Nix** me permettant de rejoindre le VPN avec l’ip **10.0.0.101**. 
```haskell
{ config, pkgs, ... }:

let
  myMeshIp   = "10.0.0.101";
  myMeshMask = "255.255.255.255";
  myMeshName = "vpnforky";
in {

  networking.firewall.enable = false; # todo : ajouter seulement bon port

  environment.etc = {
      "tinc/vpnforky/tinc-up".source = pkgs.writeScript "tinc-up-vpnforky" ''
          #!/bin/sh
          ${pkgs.iproute2}/bin/ip link set $INTERFACE up
          ${pkgs.iproute2}/bin/ip addr add 10.0.0.101/32 dev $INTERFACE
          ${pkgs.iproute2}/bin/ip route add 10.0.0.0/24 dev $INTERFACE
      '';
      "tinc/vpnforky/tinc-down".source = pkgs.writeScript "tinc-down-vpnforky" ''
          #!/bin/sh
          ${pkgs.iproute2}/bin/ip addr del 10.0.0.101/32 dev $INTERFACE
          ${pkgs.iproute2}/bin/ip route del 10.0.0.0/24 dev $INTERFACE
          ${pkgs.iproute2}/bin/ip link set $INTERFACE down
      '';
  };
  networking.interfaces."tinc.${myMeshName}".ipv4.addresses = [{ address = myMeshIp; prefixLength = 32; }];
  services.tinc.networks."${myMeshName}"= {

    name          = "nixwork";      # le nom de notre machine

    debugLevel    = 4;            
    chroot        = false;       
    interfaceType = "tap";      

    extraConfig   = ''
      ConnectTo  = servertinc
      ExperimentalProtocol = yes
      PrivateKeyFile        = "/etc/tinc/vpnforky/rsa_key.priv" # ce fichier doit avoir +r en permission
    '';
    hosts = {
      servertinc = ''
        Address = 100.100.100.100
        Subnet = 10.0.0.1/32

        -----BEGIN RSA PUBLIC KEY-----
        censored
        -----END RSA PUBLIC KEY-----
        '';
      nixwork = ''
        Subnet  = 10.0.0.101/32
        -----BEGIN RSA PUBLIC KEY-----
        censored
        -----END RSA PUBLIC KEY-----
 
      '';

    };
  };
 security.sudo.extraRules = [
    {
      users    = [ "tinc.vpnforky" ];
      commands = [
        {
          command  = "${pkgs.nettools}/bin/ip";
          options  = [ "NOPASSWD" ];
        }
      ];
    }
  ];
 networking.extraHosts = ''
     10.0.0.1 servertinc
     10.0.0.2 offsite
  '';

}
```
