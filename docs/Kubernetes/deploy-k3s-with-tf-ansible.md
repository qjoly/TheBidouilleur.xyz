---
slug: k3s-terraform
title: Deployer un cluster k3s avec Terraform et Ansible
---
# Introduction
Kubernetes est un de mes sujets d'apprentissages principal, étant très inexpérimenté dans le domaine, j'ai besoin d'un environnement de test me permettant de pratiquer sans crainte de casser quelque chose en production, un environnement reproductible pour toujours partir de la même base. 

Et la solution pour cet environnement reproductible : C'est le duo Terraform-Ansible ! 

:::note Qu'est ce que Terraform? 
Terraform est un outil d'Iaas (Infrastructure As A Code) permettant de mettre sous forme de fichier une configuration de machine virtuelle, une configuration réseau, ou les éléments autours des machines (Ansible, Puppet). Celui-ci va se connecter à votre Hyperviseur (AWS, ESXI, Proxmox, OpenStack..)
Exemple: 
```terraform
resource "proxmox_vm_qemu" "pxe-minimal-example" {
    name                      = "pxe-minimal-example"
    agent                     = 0
    boot                      = "order=net0;scsi0"
    pxe                       = true
    target_node               = "test"
    network {
        bridge    = "vmbr0"
        firewall  = false
        link_down = false
        model     = "e1000"
    }
}
```
:::

# Démarrer le projet

[Nous allons nous baser sur ce projet (hébergé sur mon Gitea)](https://git.thoughtless.eu/Cinabre/terraform-k3s-proxmox)

Pour le cloner : 
```bash
  git clone --recursive https://git.thoughtless.eu/Cinabre/terraform-k3s-proxmox
```
:::caution attention
Le `--recursive` est indispensable pour le projet. Le dépot Git va récupérer des fichiers depuis un **second dépot** ! 
Sans ce paramètre, vous ne récupérerez que le dépot principal.
:::

<details>
  <summary>Installer les dépendances</summary>
  <ul>
    <li> <a href="https://www.terraform.io/downloads">Terraform (>v1.1.7)</a>  </li>
    <li> <a href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-debian">Ansible (>2.11.6)</a> </li>
   </ul> 
</details>





