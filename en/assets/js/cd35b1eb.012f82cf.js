"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5530],{4137:(e,r,n)=>{n.d(r,{Zo:()=>u,kt:()=>v});var t=n(7294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function s(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function i(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=t.createContext({}),p=function(e){var r=t.useContext(l),n=r;return e&&(n="function"==typeof e?e(r):s(s({},r),e)),n},u=function(e){var r=p(e.components);return t.createElement(l.Provider,{value:r},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,v=m["".concat(l,".").concat(d)]||m[d]||c[d]||o;return n?t.createElement(v,s(s({ref:r},u),{},{components:n})):t.createElement(v,s({ref:r},u))}));function v(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in r)hasOwnProperty.call(r,l)&&(i[l]=r[l]);i.originalType=e,i[m]="string"==typeof e?e:a,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return t.createElement.apply(null,s)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4764:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var t=n(7462),a=(n(7294),n(4137));const o={slug:"packer-alpine",title:"Introduction \xe0 Packer"},s=void 0,i={unversionedId:"Adminsys/Packer",id:"Adminsys/Packer",title:"Introduction \xe0 Packer",description:"Introduction",source:"@site/docs/Adminsys/Packer.md",sourceDirName:"Adminsys",slug:"/Adminsys/packer-alpine",permalink:"/TheBidouilleur.xyz/en/docs/Adminsys/packer-alpine",draft:!1,editUrl:"https://github.com/QJoly/TheBidouilleur.xyz/tree/main/docs/Adminsys/Packer.md",tags:[],version:"current",lastUpdatedAt:1687789465,formattedLastUpdatedAt:"Jun 26, 2023",frontMatter:{slug:"packer-alpine",title:"Introduction \xe0 Packer"},sidebar:"tutorialSidebar",previous:{title:"Build Docker multi-architecture",permalink:"/TheBidouilleur.xyz/en/docs/Adminsys/MultiArch-Build"},next:{title:"Tinc - VPN de Mesh",permalink:"/TheBidouilleur.xyz/en/docs/Adminsys/Tinc"}},l={},p=[{value:"Introduction",id:"introduction",level:2},{value:"Qu&#39;est ce que Packer?",id:"quest-ce-que-packer",level:2},{value:"Comment fonctionne Packer ?",id:"comment-fonctionne-packer-",level:2},{value:"Un peu de vocabulaire",id:"un-peu-de-vocabulaire",level:3},{value:"Cr\xe9er notre premi\xe8re template",id:"cr\xe9er-notre-premi\xe8re-template",level:2},{value:"Build.sh, Vault, et la cr\xe9ation de authorized_keys",id:"buildsh-vault-et-la-cr\xe9ation-de-authorized_keys",level:3}],u={toc:p},m="wrapper";function c(e){let{components:r,...n}=e;return(0,a.kt)(m,(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"Bient\xf4t 7 ans que mon infra principale est sous ",(0,a.kt)("em",{parentName:"p"},"Proxmox"),". C'est l'hyperviseur dans lequel j'ai le plus confiance, et qui est \xe9galement ",(0,a.kt)("strong",{parentName:"p"},"gratuit"),". D\xe8s que je dois d\xe9ployer plus de 2 machines virtuelles et que j'ai le choix de l'environnement : Proxmox sera mon premier choix."),(0,a.kt)("p",null,"Il propose une webui compl\xe8te et efficace, sans oublier l'avantage des outils en cli.\nJe n'exclus pas qu'un jour, je puisse changer d'environnement. Et aujourd'hui, j'ai de nouveaux besoins dans mon hyperviseur : Automatiser un d\xe9ploiement complet de mon infrastructure, et comme je ne vais pas r\xe9installer ",(0,a.kt)("strong",{parentName:"p"},"chaque")," machine individuellement, je dois partir d'une \"",(0,a.kt)("em",{parentName:"p"},"base"),'" qui servira de ',(0,a.kt)("em",{parentName:"p"},"template")," pour que le syst\xe8me des machines soit pr\xe9-configur\xe9 comme je le souhaite.\nEt cette fameuse template, je peux la faire \xe0 la main\u2026. Ou je peux la d\xe9ployer automatiquement via *",(0,a.kt)("strong",{parentName:"p"},"*Packer**")," !"),(0,a.kt)("h2",{id:"quest-ce-que-packer"},"Qu'est ce que Packer?"),(0,a.kt)("p",null,"Packer est un outil d\xe9velopp\xe9 par ",(0,a.kt)("em",{parentName:"p"},"hashicorp (une entreprise qui fourni des programmes open-sources dans l'univers du devops)")," promettant de d\xe9ployer une machine virtuelle de template de mani\xe8re automatique."),(0,a.kt)("p",null,"Dans un cas pratique, Packer va se connecter \xe0 votre cloud-publique ",(0,a.kt)("em",{parentName:"p"},"(aws, oracle, scaleway)")," / hyperviseur ",(0,a.kt)("em",{parentName:"p"},"(proxmox, qemu, esxi)")," pour envoyer les instructions permettant d'installer la machine virtuelle"),(0,a.kt)("p",null,"Dans mon cas, je me suis amus\xe9 \xe0 d\xe9ployer des templates Alpine et debian sous Qemu et Proxmox."),(0,a.kt)("h2",{id:"comment-fonctionne-packer-"},"Comment fonctionne Packer ?"),(0,a.kt)("p",null,"Packer poss\xe8de peu de d\xe9pendances, il a besoin d'un hyperviseur/cloud publique, d'un acc\xe8s \xe0 \"l'\xe9cran\" de la machine virtuelle, et d'un acc\xe8s ",(0,a.kt)("em",{parentName:"p"},"ssh")," pour que Packer v\xe9rifie que l'installation s'est bien termin\xe9e (et \xe9galement pour lancer un outil de gestion de config comme ",(0,a.kt)("strong",{parentName:"p"},"ansible"),"."),(0,a.kt)("h3",{id:"un-peu-de-vocabulaire"},"Un peu de vocabulaire"),(0,a.kt)("p",null,"On appelle ",(0,a.kt)("em",{parentName:"p"},"Builder")," l'endroit o\xf9 Packer d\xe9ploie la VM, dans mon cas : c'est Proxmox ! Et le terme ",(0,a.kt)("em",{parentName:"p"},"provisionner")," d\xe9signe l'outil qui va finir la configuration de la VM apr\xe8s Packer (",(0,a.kt)("em",{parentName:"p"},"Ex: Ansible"),")."),(0,a.kt)("h2",{id:"cr\xe9er-notre-premi\xe8re-template"},"Cr\xe9er notre premi\xe8re template"),(0,a.kt)("p",null,"Pour permettre \xe0 Packer d'automatiser l'installation de notre machine virtuelle, nous devons lui fournir un fichier de configuration. Ce fichier est appel\xe9 ",(0,a.kt)("strong",{parentName:"p"},"Preseed")," dans le cas de Debian, ",(0,a.kt)("strong",{parentName:"p"},"Answer-file")," dans le cas d'Alpine, ",(0,a.kt)("strong",{parentName:"p"},"Kickstart")," dans le cas de CentOS, et ",(0,a.kt)("strong",{parentName:"p"},"Autoyast")," dans le cas de Suse."),(0,a.kt)("p",null,"Ce fichier preseed sera rendu accessible par Packer via un serveur web temporaire. Notre machine virtuelle va donc t\xe9l\xe9charger ce fichier, et l'utiliser pour installer le syst\xe8me d'exploitation."),(0,a.kt)("p",null,"Ce fichier ",(0,a.kt)("strong",{parentName:"p"},"Preseed")," est d\xe9j\xe0 pr\xe9-\xe9crit, nous n'avons qu'\xe0 le modifier pour qu'il corresponde \xe0 nos besoins. J'utilise ",(0,a.kt)("em",{parentName:"p"},"Jinja2")," pour g\xe9n\xe9rer mon fichier preseed, mais vous pouvez utiliser n'importe quel outil de templating."),(0,a.kt)("p",null,"Les variables pass\xe9es dans le fichier template sont attribu\xe9es \xe0 des variables d'environnement, qui seront ensuite r\xe9cup\xe9r\xe9es par Packer. J'utilise un script bash pour d\xe9finir ces variables."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"/!\\ Le code source de mon Packer est disponible sur mon Github: ",(0,a.kt)("a",{parentName:"strong",href:"https://github.com/QJoly/Debian-Template-Proxmox"},"Debian Template Proxmox"),".")),(0,a.kt)("p",null,"Voici mon fichier Packer r\xe9pondant aux questions:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "description": "Debian 11 (bulleyes)",\n    "variables": {\n        "proxmox_url": "{{env `proxmox_url`}}",\n        "proxmox_vm_storage": "{{env `proxmox_vm_storage`}}",\n        "proxmox_iso_storage": "{{env `proxmox_iso_storage`}}",\n        "proxmox_iso_checksum": "{{env `proxmox_iso_checksum`}}",\n        "proxmox_node": "{{env `proxmox_node`}}",\n        "proxmox_username": "{{env `proxmox_username`}}",\n        "proxmox_iso_url": "{{env `proxmox_iso_url`}}",\n        "proxmox_password": "{{env `proxmox_password`}}",\n        "vm_id": "{{env `vm_id`}}",\n        "vm_name": "{{env `vm_name`}}",\n        "template_description": "{{env `template_description`}}",\n        "vm_default_user": "{{env `vm_default_user`}}",\n        "vm_cpu": "{{env `vm_cpu`}}",\n        "vm_disk": "{{env `vm_disk`}}",\n        "vm_memory": "{{env `vm_memory`}}",\n        "ssh_username": "root",\n        "ssh_password": "{{env `ssh_password`}}",\n       "proxmox_storage": "{{env `proxmox_storage`}}",\n       "proxmox_network": "{{env `proxmox_network`}}"\n    },\n    "sensitive-variables": ["proxmox_password", "ssh_password" ],\n    "builders": [\n        {\n            "type": "proxmox",\n            "proxmox_url":  "{{user `proxmox_url`}}",\n            "node": "{{user `proxmox_node`}}",\n            "insecure_skip_tls_verify": true,\n            "username": "{{user `proxmox_username`}}",\n            "password": "{{user `proxmox_password`}}",\n            "template_description":"{{user `template_description`}}",\n            "vm_id":  "{{user `vm_id`}}",\n            "vm_name": "{{user `vm_name`}}",\n            "memory": "{{user `vm_memory`}}",\n            "cores": "{{user `vm_cpu`}}",\n            "os": "l26",\n\n            "http_directory": "http",\n\n            "network_adapters": [\n              {\n                "model": "virtio",\n                "bridge": "{{user `proxmox_network`}}"\n              }\n            ],\n\n            "disks": [\n              {\n                "type": "virtio",\n                "disk_size": "{{user `vm_disk`}}",\n                "storage_pool": "{{ user `proxmox_vm_storage`}}",\n                "storage_pool_type": "directory",\n                "format": "raw"\n              }\n            ],\n            "qemu_agent": "true",\n            "ssh_username": "{{user `ssh_username`}}",\n            "ssh_password": "{{user `ssh_password`}}",\n            "ssh_timeout": "30m",\n            "iso_url": "{{user `proxmox_iso_url`}}",  \n            "iso_storage_pool": "{{user `proxmox_iso_storage`}}",  \n            "iso_checksum": "{{user `proxmox_iso_checksum`}}",\n            "unmount_iso": true,\n            "boot_wait": "10s",\n            "boot_command": [\n                "<esc><wait>",\n                "auto <wait>",\n                "console-keymaps-at/keymap=fr <wait>",\n                "console-setup/ask_detect=false <wait>",\n                "debconf/frontend=noninteractive <wait>",\n                "debian-installer=fr_FR <wait>",\n                "fb=false <wait>",\n                "install <wait>",\n              "packer_host={{ .HTTPIP }} <wait>",\n              "packer_port={{ .HTTPPort }} <wait>",\n                "kbd-chooser/method=fr <wait>",\n                "keyboard-configuration/xkb-keymap=fr <wait>",\n                "locale=fr_FR <wait>",\n                "netcfg/get_hostname={{user `vm_name`}} <wait>",\n                "preseed/url=http://{{ .HTTPIP }}:{{ .HTTPPort }}/preseed.cfg <wait>",\n                "<enter><wait>"\n            ]\n        }\n    ],\n    "provisioners": [\n     {\n      "type": "ansible",\n      "ansible_env_vars": [ "ANSIBLE_FORCE_COLOR=1","ANSIBLE_HOST_KEY_CHECKING=False" ],\n      "playbook_file": "ansible/provisioning.yml"\n     }\n    ]\n}\n\n\n')),(0,a.kt)("p",null,"Nous allons rapidement d\xe9cortiquer la structure de ce Packer :"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},'la partie "',(0,a.kt)("em",{parentName:"li"},"Variable"),"\" concerne les variables statiques et/ou variables d'environnements ",(0,a.kt)("em",{parentName:"li"},"(On va voir \xe7a un peu plus tard)")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("em",{parentName:"li"},"Provisionner")," designe la commande que l'on va lancer ",(0,a.kt)("strong",{parentName:"li"},"apr\xe8s")," la cr\xe9ation de la template"),(0,a.kt)("li",{parentName:"ul"},"et ce qui concerne la template elle-m\xeame (param\xe8tres, hyperviseurs...) est dans la partie ",(0,a.kt)("em",{parentName:"li"},"builder"))),(0,a.kt)("p",null,"et la partie ",(0,a.kt)("em",{parentName:"p"},"boot_command")," dans ",(0,a.kt)("em",{parentName:"p"},"Builder")," est la liste de ",(0,a.kt)("strong",{parentName:"p"},"toutes")," les entr\xe9es au clavier que Packer va taper, On y place souvent le t\xe9l\xe9chargement du Preseed de Packer vers la VM."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"petite explication sur le transfert de fichier de packer vers la template :")," Packer, \xe0 son lancement, va cr\xe9er un serveur web avec le contenu du dossier ",(0,a.kt)("em",{parentName:"p"},"http/"),", si on y place des fichiers \xe0 l'interieur, on peut dire \xe0 packer de taper la commande suivante pour r\xe9cup\xe9rer des fichiers. (Ex: Preseed, cl\xe9s ssh etc..)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"curl  http://{{ .HTTPIP }}:{{ .HTTPPort }}/fichier\n")),(0,a.kt)("p",null,"Ainsi, dans cette installation d'Alpine, je vais r\xe9pondre une \xe0 une aux questions, avec des timer pr\xe9-configur\xe9s (qui se comptent en seconde).\nEt \xe0 la fin de l'installation, nous lan\xe7ons le playbook ",(0,a.kt)("strong",{parentName:"p"},"provisionning")," qui me permet d'installer les d\xe9pendances utiles \xe0 mes VMs.\nIl n'est pas necessaire d'aller tr\xe8s loin dans le playbook : \xe7a reste une template."),(0,a.kt)("h3",{id:"buildsh-vault-et-la-cr\xe9ation-de-authorized_keys"},"Build.sh, Vault, et la cr\xe9ation de authorized_keys"),(0,a.kt)("p",null,"Si vous \xeates all\xe9 voir mon d\xe9pot (dont le lien est plus haut), vous avez surement vu le fichier ",(0,a.kt)("strong",{parentName:"p"},"buid.sh"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\n# Param\xe8tres du Proxmox\nexport proxmox_url="https://IP_PROXMOX:8006/api2/json"\nexport proxmox_node="NOM_NOEUD"\nexport proxmox_username="root@pam"\nexport proxmox_password="Password" # Il est pr\xe9f\xe9rable d\'utiliser un utilisateur d\xe9di\xe9 \xe0 Proxmox\nexport proxmox_vm_storage="local-zfs"\nexport proxmox_iso_url="https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-11.6.0-amd64-netinst.iso"\nexport proxmox_iso_checksum="sha256:e482910626b30f9a7de9b0cc142c3d4a079fbfa96110083be1d0b473671ce08d"\nexport proxmox_iso_storage="local"\nexport proxmox_network="vmbr0"\n\n# Ressources attribu\xe9es \xe0 la VM\nexport vm_id=9002\nexport vm_name="debian-11-tf"\nexport template_description="VM debian"\nexport vm_default_user="root"\nexport vm_cpu=2\nexport vm_disk="8G"\nexport vm_memory=1024\n\n# Param\xe8tres de la VM Template\nexport prefix_disk="vd"\nexport ssh_username="root"\nexport ssh_password="HugePassword"\nexport userdeploy_password="HugePassword"\n\nexport vm_keys=$(echo "$(cat ~/.ssh/id_ed25519.pub)")\n\n# set variables\nj2 http/preseed.cfg.j2 > http/preseed.cfg\n\n#PACKER_LOG=1 packer build debian-test.json\npacker build debian-11-amd64-proxmox.json\n\nrm -f http/preseed.cfg\n\n\n')),(0,a.kt)("p",null,"ce fichier va donner les param\xe8tres essentiels \xe0 Packer. Les premi\xe8res variables sont les identifiants pour se connecter \xe0 proxmox"),(0,a.kt)("p",null,"Evidemment : l'usage de vault n'est pas du tout une contrainte, vous pouvez tr\xe8s bien mettre les identifiants en clair dans le fichier."))}c.isMDXComponent=!0}}]);