---
slug: presentation-packer
title: Présentation rapide de Packer
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: 'https://github.com/qjoly/'
  image_url: 'https://avatars.githubusercontent.com/u/82603435?v=4'
tags: [proxmox, packer, devops]
---

:::info Un peu obsolète

Cette page est très certainement obsolète. Prennez-la comme une base de travail, mais je ne peux pas garantir que tout fonctionne comme prévu.

:::

## Introduction

Bientot 7 ans que mon infra principale est sous *Proxmox*. C'est l'hyperviseur dans lequel j'ai le plus confiance, et qui est également **gratuit**. Dès que je dois déployer plus de 2 machines virtuelles et qu eje peux choisir l'environnement : Proxmox sera mon premier choix.
Il propose une webui complète et efficace, sans oublier l'avantage des outils en cli.
Je n'exclue pas qu'un jour, je puisse changer d'environnement. Et aujourd'hui, j'ai de nouveaux besoins dans mon hyperviseur : Automatiser un déploiement complet de mon infrastructure, et comme je vais pas réinstaller **chaque** machine individuellement, je dois partir d'une "*base*" qui servira de *template* pour que le système des machines soit pré-configuré comme je le souhaite.
Et cette fameuse template, je peux la faire à la main.... ou je peux la déployer automatiquement via ****Packer**** !
<!--truncate-->
## Qu'est ce que Packer?

Packer est un outil développé par *hashicorp (une entreprise qui fourni des programmes open-sources dans l'univers du devops)* promettant de déployer une machine virtuelle de template de manière automatique.

Dans un cas pratique, Packer va se connecter à votre cloud-publique*(aws, oracle, scaleway)* / hyperviseur*(proxmox, qemu, esxi)* pour envoyer les instructions permettant d'installer la machine virtuelle

Dans mon cas, je me suis amusé à déployer des templates Alpine et debian sous Qemu et Proxmox.

## Comment fonctionne Packer ?

Packer possède peu de dépendances, il a besoin d'un hyperviseur/cloud publique, d'un accès à "l'écran" de la machine virtuelle, et d'un accès *ssh* pour que Packer vérifie que l'installation s'est bien terminée (et également pour lancer un outil de gestion de config comme **ansible**.

### Un peu de vocabulaire

On appelle *Builder* l'endroit où Packer déploie la VM, dans mon cas : c'est Proxmox ! Et le terme *provisionner* désigne l'outil qui va finir la configuration de la VM après Packer (*Ex: Ansible*).

## Créer notre première template

Pour permettre à Packer d'automatiser l'installation de notre machine virtuelle, nous devons lui fournir un fichier de configuration. Ce fichier est appelé **Preseed** dans le cas de Debian, **Answer-file** dans le cas d'Alpine, **Kickstart** dans le cas de CentOS, et **Autoyast** dans le cas de Suse.

Ce fichier preseed sera rendu accessible par Packer via un serveur web temporaire. Notre machine virtuelle va donc télécharger ce fichier, et l'utiliser pour installer le système d'exploitation.

Ce fichier **Preseed** est déjà pré-écrit, nous n'avons qu'à le modifier pour qu'il corresponde à nos besoins. J'utilise *Jinja2* pour générer mon fichier preseed, mais vous pouvez utiliser n'importe quel outil de templating.

Les variables passées dans le fichier template sont attribuées à des variables d'environnement, qui seront ensuite récupérées par Packer. J'utilise un script bash pour définir ces variables.

**/!\ Le code source de mon Packer est disponible sur mon Github: [Debian Template Proxmox](https://github.com/QJoly/Debian-Template-Proxmox).**

Voici mon fichier Packer répondant aux questions:

```json
{
    "description": "Debian 11 (bulleyes)",
    "variables": {
        "proxmox_url": "{{env `proxmox_url`}}",
        "proxmox_vm_storage": "{{env `proxmox_vm_storage`}}",
        "proxmox_iso_storage": "{{env `proxmox_iso_storage`}}",
        "proxmox_iso_checksum": "{{env `proxmox_iso_checksum`}}",
        "proxmox_node": "{{env `proxmox_node`}}",
        "proxmox_username": "{{env `proxmox_username`}}",
        "proxmox_iso_url": "{{env `proxmox_iso_url`}}",
        "proxmox_password": "{{env `proxmox_password`}}",
        "vm_id": "{{env `vm_id`}}",
        "vm_name": "{{env `vm_name`}}",
        "template_description": "{{env `template_description`}}",
        "vm_default_user": "{{env `vm_default_user`}}",
        "vm_cpu": "{{env `vm_cpu`}}",
        "vm_disk": "{{env `vm_disk`}}",
        "vm_memory": "{{env `vm_memory`}}",
        "ssh_username": "root",
        "ssh_password": "{{env `ssh_password`}}",
       "proxmox_storage": "{{env `proxmox_storage`}}",
       "proxmox_network": "{{env `proxmox_network`}}"
    },
    "sensitive-variables": ["proxmox_password", "ssh_password" ],
    "builders": [
        {
            "type": "proxmox",
            "proxmox_url":  "{{user `proxmox_url`}}",
            "node": "{{user `proxmox_node`}}",
            "insecure_skip_tls_verify": true,
            "username": "{{user `proxmox_username`}}",
            "password": "{{user `proxmox_password`}}",
            "template_description":"{{user `template_description`}}",
            "vm_id":  "{{user `vm_id`}}",
            "vm_name": "{{user `vm_name`}}",
            "memory": "{{user `vm_memory`}}",
            "cores": "{{user `vm_cpu`}}",
            "os": "l26",

            "http_directory": "http",

            "network_adapters": [
              {
                "model": "virtio",
                "bridge": "{{user `proxmox_network`}}"
              }
            ],

            "disks": [
              {
                "type": "virtio",
                "disk_size": "{{user `vm_disk`}}",
                "storage_pool": "{{ user `proxmox_vm_storage`}}",
                "storage_pool_type": "directory",
                "format": "raw"
              }
            ],
            "qemu_agent": "true",
            "ssh_username": "{{user `ssh_username`}}",
            "ssh_password": "{{user `ssh_password`}}",
            "ssh_timeout": "30m",
            "iso_url": "{{user `proxmox_iso_url`}}",  
            "iso_storage_pool": "{{user `proxmox_iso_storage`}}",  
            "iso_checksum": "{{user `proxmox_iso_checksum`}}",
            "unmount_iso": true,
            "boot_wait": "10s",
            "boot_command": [
                "<esc><wait>",
                "auto <wait>",
                "console-keymaps-at/keymap=fr <wait>",
                "console-setup/ask_detect=false <wait>",
                "debconf/frontend=noninteractive <wait>",
                "debian-installer=fr_FR <wait>",
                "fb=false <wait>",
                "install <wait>",
              "packer_host={{ .HTTPIP }} <wait>",
              "packer_port={{ .HTTPPort }} <wait>",
                "kbd-chooser/method=fr <wait>",
                "keyboard-configuration/xkb-keymap=fr <wait>",
                "locale=fr_FR <wait>",
                "netcfg/get_hostname={{user `vm_name`}} <wait>",
                "preseed/url=http://{{ .HTTPIP }}:{{ .HTTPPort }}/preseed.cfg <wait>",
                "<enter><wait>"
            ]
        }
    ],
    "provisioners": [
     {
      "type": "ansible",
      "ansible_env_vars": [ "ANSIBLE_FORCE_COLOR=1","ANSIBLE_HOST_KEY_CHECKING=False" ],
      "playbook_file": "ansible/provisioning.yml"
     }
    ]
}


```

Nous allons rapidement décortiquer la structure de ce Packer :

- la partie "*Variable*" concerne les variables statiques et/ou variables d'environnements *(On va voir ça un peu plus tard)*
- *Provisionner* designe la commande que l'on va lancer **après** la création de la template
- et ce qui concerne la template elle-même (paramètres, hyperviseurs...) est dans la partie *builder*

et la partie *boot_command* dans *Builder* est la liste de **toutes** les entrées au clavier que Packer va taper, On y place souvent le téléchargement du Preseed de Packer vers la VM.

**petite explication sur le transfert de fichier de packer vers la template :** Packer, à son lancement, va créer un serveur web avec le contenu du dossier *http/*, si on y place des fichiers à l'interieur, on peut dire à packer de taper la commande suivante pour récupérer des fichiers. (Ex: Preseed, clés ssh etc..)

```bash
curl  http://{{ .HTTPIP }}:{{ .HTTPPort }}/fichier
```

Ainsi, dans cette installation d'Alpine, je vais répondre une à une aux questions, avec des timer pré-configurés (qui se comptent en seconde).
Et à la fin de l'installation, nous lançons le playbook **provisionning** qui me permet d'installer les dépendances utiles à mes VMs.
Il n'est pas necessaire d'aller très loin dans le playbook : ça reste une template.

### Build.sh, Vault, et la création de authorized_keys

Si vous êtes allé voir mon dépot (dont le lien est plus haut), vous avez surement vu le fichier **buid.sh**.

```bash
#!/bin/bash

# Paramètres du Proxmox
export proxmox_url="https://IP_PROXMOX:8006/api2/json"
export proxmox_node="NOM_NOEUD"
export proxmox_username="root@pam"
export proxmox_password="Password" # Il est préférable d'utiliser un utilisateur dédié à Proxmox
export proxmox_vm_storage="local-zfs"
export proxmox_iso_url="https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-11.6.0-amd64-netinst.iso"
export proxmox_iso_checksum="sha256:e482910626b30f9a7de9b0cc142c3d4a079fbfa96110083be1d0b473671ce08d"
export proxmox_iso_storage="local"
export proxmox_network="vmbr0"

# Ressources attribuées à la VM
export vm_id=9002
export vm_name="debian-11-tf"
export template_description="VM debian"
export vm_default_user="root"
export vm_cpu=2
export vm_disk="8G"
export vm_memory=1024

# Paramètres de la VM Template
export prefix_disk="vd"
export ssh_username="root"
export ssh_password="HugePassword"
export userdeploy_password="HugePassword"

export vm_keys=$(echo "$(cat ~/.ssh/id_ed25519.pub)")

# set variables
j2 http/preseed.cfg.j2 > http/preseed.cfg

#PACKER_LOG=1 packer build debian-test.json
packer build debian-11-amd64-proxmox.json

rm -f http/preseed.cfg


```

ce fichier va donner les paramètres essentiels à Packer. Les premières variables sont les identifiants pour se connecter à proxmox

Evidemment : l'usage de vault n'est pas du tout une contrainte, vous pouvez très bien mettre les identifiants en clair dans le fichier.
