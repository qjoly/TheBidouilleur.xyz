---
slug: rootless-libvirt
title: Using libvirt as non-root user
tags:
  - virtualisation
---

## What is libvirt?

> libvirt is a library, an API, a daemon and tools in free software for virtualization management. It is notably used by KVM, Xen, VMware ESX, QEMU and other virtualization solutions. 

I am a fan of Proxmox as a Hypervisor, I use it in my "production" environments. But when I don't have the need for such an environment, I prefer to turn to Libvirt which I find lighter and more pleasant to use on a daily basis.
So, whether it's a server or a workstation, I always install libvirt *(even before I need it)*. 

This page will show you the steps to follow to use libvirt on your workstation without having to switch to `root`.

:::caution Libvirt is already rootless

Libvirt already offers a rootless socket. The interest of giving access to the socket `qemu:///system` *(only for root by default)* is to allow several users to have the same VM pool.
``bash
virsh -c qemu:///session list
```
:::

## Using libvirt in rootless

We will not allow your user to connect to the Libvirt system socket directly. Instead, we will change his permissions to allow a full group to have access. 
This group will be `libvirt`, which should already be present on your machine.

Check the existence of the `libvirt` group: 
``bash
└─▪grep libvirt /etc/group
libvirt:x:138:libvirtdbus
libvirt-qemu:x:64055:libvirt-qemu
libvirt-dnsmasq:x:139:
libvirtdbus:x:141:
```

If the group does not exist, you will have to create it with the command `sudo groupadd --system libvirt`. 

Then, add your user to the `libvirt` group *(in my case, my user is *kiko*)*: `sudo usermod -a -G libvirt kiko`

:::tip Make sure your user is in the `libvirt` group

The `id` command won't show the change right away, try a `id $(whoami)` again.
:::

Once our user is in the `libvirt` group, we will tell libvirt that the socket should have permissions.
In the `/etc/libvirt/libvirtd.conf` file, uncomment these two lines: 
```ini
unix_sock_group = "libvirt
unix_sock_rw_perms = "0770"
```

Now you just have to restart the libvirt service: `sudo systemctl restart libvirtd.service`

To test: `virsh -c qemu:///system list`
