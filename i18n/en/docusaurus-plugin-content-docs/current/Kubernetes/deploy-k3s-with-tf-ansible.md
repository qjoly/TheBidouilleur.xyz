---
slug: k3s-terraform
title: Deploy a full k3s cluster with terraform and ansible
---

# Introduction
Kubernetes is one of my main learning subjects, being very inexperienced in the field, I need a test environment allowing me to practice without fear of breaking something in production, a reproducible environment to always start from the same base.

And the solution for this reproducible environment: It's the Terraform-Ansible duo!

:::note What is Terraform?
Terraform is an Iaas tool (Infrastructure As A Code) allowing to file a virtual machine configuration, a network configuration, or the elements around the machines (Ansible, Puppet). This will connect to your Hypervisor (AWS, ESXI, Proxmox, OpenStack..)
Example:
```terraform
resource "proxmox_vm_qemu" "pxe-minimal-example" {
    name = "pxe-minimal-example"
    agent = 0
    boot="order=net0;scsi0"
    pxe=true
    target_node="test"
    network {
        bridge="vmbr0"
        firewall=false
        link_down=false
        model="e1000"
    }
}
```
:::

# Start the project

[We will base ourselves on this project (hosted on my Gitea)](https://git.thoughtless.eu/Cinabre/terraform-k3s-proxmox)

To clone it:
```bash
  git clone --recursive https://git.thoughtless.eu/Cinabre/terraform-k3s-proxmox
```
::: caution beware
The `--recursive` is essential for the project. The Git repository will fetch files from a **second repository**!
Without this parameter, you will only recover the main repository.
:::

<details>
  <summary>Install dependencies</summary>
  <ul>
    <li> <a href="https://www.terraform.io/downloads">Terraform (>v1.1.7)</a> </li>
    <li><a href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-debian">Ansible (>2.11.6)</a> </ li>
   </ul>
</details>
