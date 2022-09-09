---
slug: presentation-packer
title: Quick Presentation of Packer
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: https://git.thoughtless.eu
  image_url: https://git.thoughtless.eu/avatars/05bed00fb8cb64b8e3b222f797bcd3d8
tags: [proxmox, packer, devops]
---

[ This article is from my old-blog, it will also be available in the "Documentation" section of the site ]


## Introduction
Soon 7 years since my main infrastructure is on Proxmox. It's the hypervisor I trust most, which is also free and open-source. As soon as I have to deploy more than 2 virtual machines and can choose the environment: Proxmox will be my first choice. It offers a complete and efficient webui, without forgetting the advantage of command line tools. I don't rule out that someday, I may change my environment. And today, I have new needs in my hypervisor: Automate a complete deployment of my infrastructure, and since I will not reinstall each machine individually, I must start from a "base" that will serve as a template for the machine system to be pre-configured as I wish. And this famous template, I can make by hand.... or I can deploy it automatically with Packer!


## What is Packer?

Packer is a tool developed by hashicorp (*a company that provides open-source programs in the world of devops*) allowing to deploy a template virtual machine automatically.
In a practical case, Packer will connect to your public-cloud(*aws, oracle, scaleway*) / hypervisor(*proxmox, qemu, esxi*) to send instructions to install the virtual machine. (*Like resources needed. RAM, CPU cores, type of bios*)

## How does Packer work?

Packer has few dependencies, it needs a public hypervisor/cloud, access to the "screen"\* of the virtual machine, and ssh access for Packer to verify that the installation has completed (*and also to launch a config management tool such as ansible*).

\**virtual machine screen will be used to send keystrokes.*

### A little vocabulary

The place where Packer deploys the VM is called Builder, in my case: It's Proxmox! And the term "provisioning" refers to the tool that will finish configuring the VM (Ex: Ansible). 

## Create our first template

Before we tackle a big fish like debian, we'll start with a simpler system to install: Alpine. The alpine installer will ask about ten questions, one by one. There is an answer file system that will automatically answer questions, but I could not run this file under alpine. (Only on Alpine, the answer file works on debian).

As I cannot use an answer file: we will answer questions manually (*by sending keystrokes*).


/!\ In the rest of this article, I will base myself on this deposit that is hosted on my gitea: [packer-alpine-proxmox](https://git.thoughtless.eu/Cinabre/packer-alpine-proxmox).


```json
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
                "<wait2>service sshd restart <enter> <wait2>",
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
We'll quickly go through the structure of this Packer file:
- the part "*Variable*" relates to static variables and/or environment variables *(We'll see later)* 
- *Provision* designates the command to be launched **after** the creation of the template 
- and what concerns the template itself (parameters, hypervisors...) is in the *builder*  part

and the *boot_command* part in *Builder* is the list of **all** keyboard entries that Packer will type, It often places the download of Packer's Preseed to the VM.

**small explanation about file transfer from packer to template:** Packer, at start, will create a web server with the contents of the *http/* folder, if you place files inside it, you can tell packer to type the following command to recover files. (Ex: Preseed, ssh keys etc.)

```bash
curl  http://{{ .HTTPIP }}:{{ .HTTPPort }}/fichier
```

So, in this Alpine installation, I will answer questions one by one, with pre-configured timers (which count in seconds).
And at the end of the installation, we launch the playbook **provisioning.yml** which allows me to install the dependencies useful to my VMs.
There is no need to go further in the playbook: it's still a template.

## Why running packer through shell script?

If you went to my repository (linked above), you probably saw the file buid.sh.

```bash
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

This file will provide some parameters to Packer such as variables containing passwords. I use Vault to retrieve sensitive information from a remote server.
You can choose to *not* use Vault by placing passwords directly in clear text.

