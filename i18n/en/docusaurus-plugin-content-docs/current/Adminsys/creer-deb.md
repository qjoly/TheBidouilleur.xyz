---
slug: creer-deb
title: Create your own Debian packages
tags:
  - debian
  - infra
description: Creating your own Debian packages is not as complicated as you might think. We will see how to package your own scripts/programs in an easy and efficient way.
---


## Introduction

In my project to create a self-sufficient infrastructure, I sometimes find myself installing small programs on many machines with a *Makefile* or a series of commands. And even if it's pretty clean, it's not very practical when you manage a large quantity of servers. So I had the idea to package my programs to simplify the deployment on my machines.

So we will see how to create our own `.deb` packages ! 

## The requirements are simple: 

- Be on a Debian-based system
- Install the following packages:

```bash
sudo apt install build-essential binutils lintian debhelper dh-make devscripts
```

## Create your own Debian package

I will take a simple example [*Kompose*](https://kompose.io/)

It's a small script in **Go** allowing to convert *docker-composes* into *YAML Kubernetes* files. To install it, we download the compiled executable and we put it in a folder of our `$PATH`.

I would then like to create a `.deb` that would contain the *Kompose* binary and put it in `/usr/bin`.
The official Debian documentation *([available here](https://wiki.debian.org/HowToPackageForDebian))* is very clear: we have to create a directory which will be considered as the root of our system.

Let me explain: <br></br>
If I want to drop the *kompose* file into my `/usr/bin` folder. I will then create the folder `./kompose_1.28.0-1_amd/usr/bin/`.

:::info Naming convention 

The documentation offers us a very simple naming convention, You should name your files as follows<br></br>

`name_version-revision_architecture.deb`

In my case, I name my folder `kompose_1.28.0-1_amd64` *(the .deb extension will be added at the package creation)*
:::

Now that we know how to drop files into the tree, we need to create the `DEBIAN/control` file. 

This file gathers the metadata of the *(Name, maintainer, architecture)* file, it allows dpkg to name what we just installed and its version.

```control
Package: kompose
Version: 1.28.0
Maintainer: Quentin JOLY <github@thoughtless.eu>
Architecture: amd64
Description: Kompose is a conversion tool for Docker Compose to container orchestrators such as Kubernetes (or OpenShift). 
```

It is also possible to add *conflicts* with other packages, or conversely dependencies before/after installation.

## Pre/Post scripts

If dropping files is not enough to install your package, it is still possible to run *{post,pre}{inst,rm}* scripts. These should be placed in the `DEBIAN/` folder *(the same as for the `control` file)*.

Here are the 4 possibilities of script launching: 
- pre installation (`preinst`)
- post installation (`postinstall`)
- pre delete (`prerm`)
- post removal (`postrm`)

The use of these scripts allows you to compile the necessary, drop the configuration files, or delete the logs after the deletion. 

## Create the archive

Here is our tree with the Kompose executable, my metadata file and my post-installation script.

```
└── kompose_1.28.0-1_amd64
    ├── DEBIAN
    │   ├── control
    │   └── postinst
    └── usr
        └── bin
            └── kompose
```
Now, the command for creating our *deb* is `dpkg-deb --build kompose_1.28.0-1_amd64`. 

```bash
➜ dpkg-deb --build kompose_1.28.0-1_amd64
dpkg-deb: building package 'kompose' in 'kompose_1.28.0-1_amd64.deb'.
```

Now we just need to send our `kompose_1.28.0-1_amd64.deb` file to a Debian machine and install it with `sudo dpkg -i kompose_1.28.0-1_amd64.deb`.

:::caution ZST encryption method

If you get the following error : 
```bash
# dpkg -i kompose_1.28.0-1_amd64.deb
dpkg-deb: error: archive 'kompose_1.28.0-1_amd64.deb' uses unknown compression for member 'control.tar.zst', giving up
dpkg: error processing archive kompose_1.28.0-1_amd64.deb (--install):
 dpkg-deb --control subprocess returned error exit status 2
Errors were encountered while processing:
 kompose_1.28.0-1_amd64.deb
```

This is because Debian has changed the package encryption from `zstd` to `xz`. It is possible to solve this problem by extracting the contents of the `.deb` file, and recreating it using the following procedure: 
```bash
file=kompose_1.28.0-1_amd64.deb
ar x $file
zstd -d < control.tar.zst | xz > control.tar.xz
zstd -d < data.tar.zst | xz > data.tar.xz
ar -m -c -a sdsd repacked_${file} debian-binary control.tar.xz data.tar.xz
rm debian-binary control.tar.xz data.tar.xz control.tar.zst data.tar.zst
```
:::


---
:::note Related to this page
- [Hosting your Debian repository](/docs/Adminsys/creer-repo-debian)
:::