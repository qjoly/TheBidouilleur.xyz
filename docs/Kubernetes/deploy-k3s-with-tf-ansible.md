---
slug: k3s-terraform
title: Deployer un cluster k3s avec Terraform et Ansible
hidden: true
---
## Introduction

Kubernetes est un de mes sujets d'apprentissages principal, étant très inexpérimenté dans le domaine, j'ai besoin d'un environnement de test me permettant de pratiquer sans crainte de casser quelque chose en production, un environnement reproductible pour toujours partir de la même base.

Et la solution pour cet environnement reproductible : C'est le duo Terraform-Ansible !

:::note Qu'est-ce que Terraform?
Terraform est un outil d'Iaas (Infrastructure As A Code) permettant de mettre sous forme de fichier une configuration de machine virtuelle, une configuration réseau, ou les éléments autours des machines (Ansible, Puppet). Celui-ci va se connecter à votre Hyperviseur (AWS, ESXI, Proxmox, OpenStack…)
Exemple :

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

## Démarrer le projet

### Installation des dépendances

[Nous allons nous baser sur ce projet](https://github.com/QJoly/terraform-k3s-proxmox)

Pour le cloner :

```bash
  git clone --recursive https://github.com/QJoly/terraform-k3s-proxmox
```

:::caution attention…
Le `--recursive` est indispensable pour le projet. Le dépot Git va récupérer des fichiers depuis un **second projet** !
Sans ce paramètre, vous ne récupérerez pas le code complet.
:::

<details>
  <summary>Installer les dépendances</summary>
  <ul>
    <li> <a href="https://www.terraform.io/downloads">Terraform (>v1.1.7)</a>  </li>
    <li> <a href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-debian">Ansible (>2.11.6)</a> </li>
    <li> <a href="https://pypi.org/project/j2cli/">Jinja2-Cli</a>  </li>
   </ul>
</details>

### Configurer l'accès au Proxmox

L'accès se trouve dans le fichier `providers.tf`, c'est ce fichier que nous allons éditer.

:::note Sécurité
Je vous conseille vivement de créer un utilisateur "terraform" qui aura les permissions minimums pour gérer vos machines virtuelles.
:::

```hcl
data "vault_generic_secret" "proxmox_host" {
  path = "kv/homelab"
}

provider "proxmox" {
  pm_api_url = data.vault_generic_secret.proxmox_host.data["proxmox_url"]
  pm_user    = data.vault_generic_secret.proxmox_host.data["proxmox_user"]

  pm_password = data.vault_generic_secret.proxmox_host.data["proxmox_password"]

  pm_tls_insecure = "true"
  pm_parallel     = 5
}
```

Par défaut, j'utilise [Vault](https://vault.io) pour stocker mes identifiants. Si ce n'est pas le cas pour vous, vous devrez supprimer la fonction `vault_generic_secret` et les appels dans le provider "proxmox".

Voici à quoi devrait ressembler votre fichier `providers.tf` si jamais vous n'utilisez pas Vault :

```hcl
provider "proxmox" {
  pm_api_url = "https://10.0.0.1:8006/api2/json"
  pm_user    = "root@pam"
  pm_password = "MotDePasseTresDur!"
  pm_tls_insecure = "true"
  pm_parallel     = 5
}
```

:::danger Identifiants en clair
On ne le répète jamais assez : évitez de garder vos identifiants dans vos codes. Pensez à passer sous Vault (pour un écosystème HashiCorp), ou à envisager une solution comme SOPS (Terraform a même un provider).
En savoir plus :

- <https://blog.gruntwork.io/a-comprehensive-guide-to-managing-secrets-in-your-terraform-code-1d586955ace1>
- <https://github.com/carlpett/terraform-provider-sops>

:::

*On verra peut-être ça dans un article prochain, c'est un sujet que j'aimerais approfondir.*

### Démarrer le déploiement

Une fois le projet configuré *(avec les bons identifiants)*, il suffit de laisser Terraform faire le travail :

```bash
terraform plan  # voir ce que Terraform s'apprète à faire
terraform apply # lancer le déploiement
```

Une fois les machines déployées, Terraform va appeler le playbook k3s-ansible pour installer le cluster K3S. Je ne modifie aucun paramètre via terraform *(son seul rôle est de générer les inventaires avec les IPs récupérées via qemu-guest-agent)*.

## Conclusion

Merci d'avoir lu cette page, bien que le projet est très brouillon et pas du tout prod-friendly, j'espère qu'il vous aidera ou vous inspirera pour d'autres idées. En amélioration, il est possible d'intégrer Terragrunt (qui a complètement sa place ici) ou même d'utiliser le provider Ansible et non une commande appelant les playbooks.  
