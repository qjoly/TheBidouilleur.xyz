---
slug: presentation-packer
title: Présentation rapide de Packer
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: https://git.thoughtless.eu
  image_url: https://avatars.githubusercontent.com/u/82603435?v=4
tags: [proxmox, packer, devops]
---

[ Cet article provient de mon ancien-blog, celui-ci sera également disponible dans la partie "Documentation" du site ]

## Introduction
Bientot 7 ans que mon infra principale est sous *Proxmox*. C'est l'hyperviseur dans lequel j'ai le plus confiance, et qui est également **gratuit**. Dès que je dois déployer plus de 2 machines virtuelles et qu eje peux choisir l'environnement : Proxmox sera mon premier choix. 
Il propose une webui complète et efficace, sans oublier l'avantage des outils en cli. 
Je n'exclue pas qu'un jour, je puisse changer d'environnement. Et aujourd'hui, j'ai de nouveaux besoins dans mon hyperviseur : Automatiser un déploiement complet de mon infrastructure, et comme je vais pas réinstaller **chaque** machine individuellement, je dois partir d'une "*base*" qui servira de *template* pour que le système des machines soit pré-configuré comme je le souhaite. 
Et cette fameuse template, je peux la faire à la main.... ou je peux la déployer automatiquement via **__Packer__** !
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

Avant de s'attaquer à un gros poisson comme **debian**, on va commencer par un système plus simple à installer : **Alpine**. 
L'installateur de Alpine va poser une dizaine de questions, une à une. 
Il existe un système de *fichier-réponse* qui va répondre automatiquement aux questions mais je n'ai pas réussi à executer ce fichier sous alpine. (Uniquement sous Alpine, le fichier réponse fonctionne sous debian).

*Si le sujet vous interesse, je vous renvoie vers ce lien: [Wiki Alpine Answer-file](https://docs.alpinelinux.org/user-handbook/0.1a/Installing/setup_alpine.html).*

Comme je ne peux pas utiliser de fichier réponse : nous allons répondre aux questions manuellement.

**/!\ Dans la suite de cet article, je vais me baser sur ce dépot qui est hebergé sur mon gitea: [packer-alpine-proxmox](https://git.thoughtless.eu/Cinabre/packer-alpine-proxmox).**

Voici mon fichier Packer répondant aux questions: 
```
{
    "description": "Build Alpine Linux 3 x86_64 Proxmox template",
    "variables": {

        "proxmox_url": "{{env `proxmox_url`}}",
        "proxmox_username":"{{env `proxmox_user`}}", 
        "proxmox_password": "{{env `proxmox_password`}}", 
        "proxmox_host": "{{env `proxmox_node`}}",

        "storage_name": "{{env `storage_name`}}",
        "bridge": "{{env `bridge`}}",
        "vm_id": "9001",
        "vm_name": "alpine3-tf",
        "template_description": "Alpine Linux 3.11 x86_64 template built with packer",
        "vm_memory": "1024",

        "ssh_username": "root",
        "ssh_password": "{{env `ssh_password`}}"
    },
    "sensitive-variables": ["proxmox_password", "ssh_password" ],
    "provisioners": [
      {
        "type": "ansible",
        "playbook_file": "./playbook/provisioning.yml",
        "ansible_env_vars": ["ANSIBLE_FORCE_COLOR=True" ]
      }
    ],
    "builders": [
        {
            "type": "proxmox",
            "proxmox_url":  "{{user `proxmox_url`}}",
            "insecure_skip_tls_verify": true,
            "username": "{{user `proxmox_username`}}",
            "password": "{{user `proxmox_password`}}",
            "vm_id":  "{{user `vm_id`}}",
            "vm_name": "{{user `vm_name`}}",
            "template_description":"{{user `template_description`}}",
            "memory": "{{user `vm_memory`}}",
            "cores": "2",
            "os": "l26",
            "http_directory": "http",

            "node": "{{user `proxmox_host`}}",
            "network_adapters": [
              {
                "model": "virtio",
                "bridge": "{{user `bridge`}}"
              }
            ],
            "disks": [
              {
                "type": "virtio",
                "disk_size": "16G",
                "storage_pool": "{{user `storage_name`}}",
                "storage_pool_type": "directory",
                "format": "qcow2"
              }
            ],
            "ssh_username": "{{user `ssh_username`}}",
            "ssh_password": "{{user `ssh_password`}}",
            "ssh_timeout": "15m",
            "ssh_certificate_file": "/root/id_rsa", 
            "iso_file": "{{user `storage_name`}}:iso/alpine-virt-3.15.0-x86_64.iso",
            "unmount_iso": true,
            "boot_wait": "15s",
            "boot_command": [
                "<wait25>root<enter><wait4>",
                "setup-alpine<enter><wait8>",
                "<enter><wait4>",
                "alpine-tf<enter><wait4><enter><wait4>",
                "dhcp<enter>",
                "<wait5>n<enter><wait5>",
                "{{user `ssh_password`}}<enter><wait5>",
                "{{user `ssh_password`}}<enter><wait>",
                "<wait5>",
                "Europe/Paris <enter><wait2><enter><wait5>",
                "n<enter>",
                "<wait1>1<enter><wait3>",
                "<enter><wait2>",
                "vda<enter>",
                "lvm<enter>",
                "sys<enter>",
                "<wait2>",
                "y<enter><wait35>",

                
                "reboot <enter>",
                "<wait65>",
                
                "root<enter><wait8>",
                "{{user `ssh_password`}}<enter><wait5> ",
                "<wait10>",

                "apk update && apk add curl<enter>",
                "mkdir -p ~/.ssh<enter>",
                "touch ~/.ssh/authorized_keys<enter><wait5>chmod 600 ~/.ssh/authorized_keys<enter><wait5>",
                "curl http://{{ .HTTPIP }}:{{ .HTTPPort }}/authorized_keys >> ~/.ssh/authorized_keys<enter>",
                "echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config <enter>",
                wait2>service sshd restart <enter> <wait2>",
                "curl http://{{ .HTTPIP }}:{{ .HTTPPort }}/repositories > /etc/apk/repositories<enter>",
                "<wait>apk update <enter>",

                "apk add python3<enter><wait1>",
                "curl https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py<enter> <wait2>",
                "python3 /tmp/get-pip.py <enter> <wait2>",

                "apk add qemu-guest-agent<enter><wait3>",
                "rc-update add qemu-guest-agent<enter>",
                "service qemu-guest-agent start<enter>"


            ]
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

```
#!/bin/bash
#export ssh_password=$(vault kv get -field root_password secrets/password)
export proxmox_password=$(vault kv get -field proxmox_password kv/wysux)
export proxmox_user=$(vault kv get -field proxmox_user kv/wysux)
export proxmox_node=$(vault kv get -field proxmox_node kv/wysux)
export proxmox_url=$(vault kv get -field proxmox_url kv/wysux)

export ssh_password="toto13"

export bridge="vmbr0"
export storage_name="local"

rm http/authorized_keys || true
for f in ssh/*.pub; do
        name_of_key=$(echo $f | cut -d "/" -f2 )
	echo -e "#$name_of_key" >> http/authorized_keys 
	key=$(cat $f)
	echo -e "$key" >> http/authorized_keys
done

packer build alpine-3-amd64-proxmox.json
``` 

ce fichier va donner les paramètres essentiels à Packer. Les premières variables sont les identifiants pour se connecter à proxmox

**si vous n'utilisez pas vault, n'hésitez pas à supprimer les lignes le concernant. C'est facultatif**


