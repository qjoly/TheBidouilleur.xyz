"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5611],{4137:(e,r,n)=>{n.d(r,{Zo:()=>c,kt:()=>u});var t=n(7294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function s(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function o(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=t.createContext({}),l=function(e){var r=t.useContext(p),n=r;return e&&(n="function"==typeof e?e(r):s(s({},r),e)),n},c=function(e){var r=l(e.components);return t.createElement(p.Provider,{value:r},e.children)},m={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=l(n),u=a,k=d["".concat(p,".").concat(u)]||d[u]||m[u]||i;return n?t.createElement(k,s(s({ref:r},c),{},{components:n})):t.createElement(k,s({ref:r},c))}));function u(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=n.length,s=new Array(i);s[0]=d;var o={};for(var p in r)hasOwnProperty.call(r,p)&&(o[p]=r[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var l=2;l<i;l++)s[l]=n[l];return t.createElement.apply(null,s)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9049:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>p,contentTitle:()=>s,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var t=n(7462),a=(n(7294),n(4137));const i={slug:"creer-deb",title:"Cr\xe9er ses propres packages Debian",tags:["debian","infra"],description:"Cr\xe9er ses propres packages Debian n'est pas aussi compliqu\xe9 qu'on peut le croire. Nous allons voir comment packager ses propres scripts/programmes de mani\xe8re facile et efficace."},s=void 0,o={unversionedId:"Adminsys/creer-deb",id:"Adminsys/creer-deb",title:"Cr\xe9er ses propres packages Debian",description:"Cr\xe9er ses propres packages Debian n'est pas aussi compliqu\xe9 qu'on peut le croire. Nous allons voir comment packager ses propres scripts/programmes de mani\xe8re facile et efficace.",source:"@site/docs/Adminsys/creer-deb.md",sourceDirName:"Adminsys",slug:"/Adminsys/creer-deb",permalink:"/TheBidouilleur.xyz/en/docs/Adminsys/creer-deb",draft:!1,editUrl:"https://github.com/QJoly/TheBidouilleur.xyz/tree/main/docs/Adminsys/creer-deb.md",tags:[{label:"debian",permalink:"/TheBidouilleur.xyz/en/docs/tags/debian"},{label:"infra",permalink:"/TheBidouilleur.xyz/en/docs/tags/infra"}],version:"current",frontMatter:{slug:"creer-deb",title:"Cr\xe9er ses propres packages Debian",tags:["debian","infra"],description:"Cr\xe9er ses propres packages Debian n'est pas aussi compliqu\xe9 qu'on peut le croire. Nous allons voir comment packager ses propres scripts/programmes de mani\xe8re facile et efficace."},sidebar:"tutorialSidebar",previous:{title:"Tinc - VPN de Mesh",permalink:"/TheBidouilleur.xyz/en/docs/Adminsys/Tinc"},next:{title:"Cr\xe9er son d\xe9pot Debian",permalink:"/TheBidouilleur.xyz/en/docs/Adminsys/creer-repo-debian"}},p={},l=[{value:"Introduction",id:"introduction",level:2},{value:"Les Pr\xe9-requis sont simples :",id:"les-pr\xe9-requis-sont-simples-",level:2},{value:"Cr\xe9er son propre package",id:"cr\xe9er-son-propre-package",level:2},{value:"Scripts pre/post",id:"scripts-prepost",level:2},{value:"Cr\xe9er l\u2019archive",id:"cr\xe9er-larchive",level:2}],c={toc:l};function m(e){let{components:r,...n}=e;return(0,a.kt)("wrapper",(0,t.Z)({},c,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"Dans mon projet de cr\xe9er une infrastructure auto-suffisante, je me retrouve parfois \xe0 installer des petits programmes sur de nombreuses machines via les ",(0,a.kt)("em",{parentName:"p"},"Makefile")," ou une s\xe9rie de commandes. Et m\xeame si c\u2019est plutot propre, ce n\u2019est pas tr\xe8s pratique lorsque l\u2019on g\xe8re une grande quantit\xe9 de serveur. L\u2019id\xe9e est donc de packager un programme pour simplifier son installation."),(0,a.kt)("p",null,"Nous allons donc voir comment cr\xe9er nos propres packages ",(0,a.kt)("inlineCode",{parentName:"p"},".deb")," ! "),(0,a.kt)("h2",{id:"les-pr\xe9-requis-sont-simples-"},"Les Pr\xe9-requis sont simples :"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\xcatre sur un syst\xe8me bas\xe9 sur Debian"),(0,a.kt)("li",{parentName:"ul"},"Installer les paquets suivants\xa0:")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"sudo apt install build-essential binutils lintian debhelper dh-make devscripts\n")),(0,a.kt)("h2",{id:"cr\xe9er-son-propre-package"},"Cr\xe9er son propre package"),(0,a.kt)("p",null,"Je vais prendre un exemple simple : ",(0,a.kt)("a",{parentName:"p",href:"https://kompose.io/"},(0,a.kt)("em",{parentName:"a"},"Kompose"))),(0,a.kt)("p",null,"C\u2019est un petit script ",(0,a.kt)("strong",{parentName:"p"},"Go")," permettant de convertir les ",(0,a.kt)("em",{parentName:"p"},"docker-composes")," en fichiers ",(0,a.kt)("em",{parentName:"p"},"YAML Kubernetes"),". Pour l\u2019installer, on t\xe9l\xe9charge l\u2019ex\xe9cutable compil\xe9 et on le place dans un dossier de notre ",(0,a.kt)("inlineCode",{parentName:"p"},"$PATH"),"."),(0,a.kt)("p",null,"J\u2019aimerais donc cr\xe9er un ",(0,a.kt)("inlineCode",{parentName:"p"},".deb")," qui contiendrait le binaire de ",(0,a.kt)("em",{parentName:"p"},"Kompose")," qui le d\xe9poserait dans ",(0,a.kt)("inlineCode",{parentName:"p"},"/usr/bin"),".\nLa documentation officielle de Debian ",(0,a.kt)("em",{parentName:"p"},"(",(0,a.kt)("a",{parentName:"em",href:"https://wiki.debian.org/HowToPackageForDebian"},"disponible ici"),")")," est tr\xe8s claire : il faut cr\xe9er un r\xe9pertoire qui sera consid\xe9r\xe9 comme la racine de notre syst\xe8me."),(0,a.kt)("p",null,"Je m\u2019explique\xa0: ",(0,a.kt)("br",null),"\nSi je souhaite d\xe9poser le fichier ",(0,a.kt)("em",{parentName:"p"},"kompose")," dans mon dossier ",(0,a.kt)("inlineCode",{parentName:"p"},"/usr/bin"),". Je vais alors cr\xe9er le dossier ",(0,a.kt)("inlineCode",{parentName:"p"},"./kompose_1.28.0-1_amd/usr/bin/"),"."),(0,a.kt)("admonition",{title:"Conventions de nommage",type:"info"},(0,a.kt)("p",{parentName:"admonition"},"La documentation nous propose une nomenclature tr\xe8s simple. Il faut nommer vos fichiers comme ci-dessous"),(0,a.kt)("br",null),(0,a.kt)("p",{parentName:"admonition"},(0,a.kt)("inlineCode",{parentName:"p"},"name_version-revision_architecture.deb")),(0,a.kt)("p",{parentName:"admonition"},"Dans mon cas, je nomme mon dossier ",(0,a.kt)("inlineCode",{parentName:"p"},"kompose_1.28.0-1_amd64")," ",(0,a.kt)("em",{parentName:"p"},"(l\u2019extension .deb sera rajout\xe9 \xe0 la cr\xe9ation du package)"))),(0,a.kt)("p",null,"Maintenant que nous savons comment d\xe9poser des fichiers dans l\u2019arborescence, nous devons cr\xe9er le fichier ",(0,a.kt)("inlineCode",{parentName:"p"},"DEBIAN/control"),". "),(0,a.kt)("p",null,"Ce fichier regroupe les m\xe9tadonn\xe9es du fichier ",(0,a.kt)("em",{parentName:"p"},"(Nom, mainteneur, architecture)"),", il permet \xe0 dpkg de nommer ce qu\u2019on vient d\u2019installer ainsi que sa version."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-control"},"Package: kompose\nVersion: 1.28.0\nMaintainer: Quentin JOLY <github@thoughtless.eu>\nArchitecture: amd64\nDescription: Kompose is a conversion tool for Docker Compose to container orchestrators such as Kubernetes (or OpenShift). \n")),(0,a.kt)("p",null,"Il est \xe9galement possible de rajouter les ",(0,a.kt)("em",{parentName:"p"},"conflits")," avec d\u2019autres paquets, ou \xe0 l\u2019inverse les d\xe9pendances avant/apr\xe8s l\u2019installation."),(0,a.kt)("h2",{id:"scripts-prepost"},"Scripts pre/post"),(0,a.kt)("p",null,"Si d\xe9poser des fichiers n\u2019est pas suffisant pour installer votre paquet, il est toujours possible d\u2019ex\xe9cuter des scripts ",(0,a.kt)("em",{parentName:"p"},"{post,pre}{inst,rm}"),". Ceux-ci doivent se placer dans le dossier ",(0,a.kt)("inlineCode",{parentName:"p"},"DEBIAN/")," ",(0,a.kt)("em",{parentName:"p"},"(le m\xeame que pour le fichier ",(0,a.kt)("inlineCode",{parentName:"em"},"control"),")")),(0,a.kt)("p",null,"Voici les 4 possibilit\xe9s de lancement de script\xa0: "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"pre installation (",(0,a.kt)("inlineCode",{parentName:"li"},"preinst"),")"),(0,a.kt)("li",{parentName:"ul"},"post installation (",(0,a.kt)("inlineCode",{parentName:"li"},"postinstall"),")"),(0,a.kt)("li",{parentName:"ul"},"pre suppression (",(0,a.kt)("inlineCode",{parentName:"li"},"prerm"),")"),(0,a.kt)("li",{parentName:"ul"},"post suppression (",(0,a.kt)("inlineCode",{parentName:"li"},"postrm"),")")),(0,a.kt)("p",null,"L\u2019usage de ces scripts permet de compiler le n\xe9c\xe9ssaire, d\xe9poser les fichiers de configurations, ou supprimer les logs apr\xe8s la suppression. "),(0,a.kt)("h2",{id:"cr\xe9er-larchive"},"Cr\xe9er l\u2019archive"),(0,a.kt)("p",null,"Voil\xe0 notre arborescence avec l\u2019ex\xe9cutable de Kompose, mon fichier de m\xe9tadonn\xe9e et mon script de post-installation."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"\u2514\u2500\u2500 kompose_1.28.0-1_amd64\n    \u251c\u2500\u2500 DEBIAN\n    \u2502\xa0\xa0 \u251c\u2500\u2500 control\n    \u2502\xa0\xa0 \u2514\u2500\u2500 postinst\n    \u2514\u2500\u2500 usr\n        \u2514\u2500\u2500 bin\n            \u2514\u2500\u2500 kompose\n")),(0,a.kt)("p",null,"Maintenant, la commande pour cr\xe9er notre ",(0,a.kt)("em",{parentName:"p"},"deb")," est ",(0,a.kt)("inlineCode",{parentName:"p"},"dpkg-deb --build kompose_1.28.0-1_amd64"),". "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"\u279c dpkg-deb --build kompose_1.28.0-1_amd64\ndpkg-deb: building package 'kompose' in 'kompose_1.28.0-1_amd64.deb'.\n")),(0,a.kt)("p",null,"Il suffit \xe0 pr\xe9sent d\u2019envoyer notre fichier ",(0,a.kt)("inlineCode",{parentName:"p"},"kompose_1.28.0-1_amd64.deb")," sur une machine Debian et de l\u2019installer avec ",(0,a.kt)("inlineCode",{parentName:"p"},"sudo dpkg -i kompose_1.28.0-1_amd64.deb"),"."),(0,a.kt)("admonition",{title:"M\xe9thode chiffrement ZST",type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"Si vous tombez sur l\u2019erreur suivante : "),(0,a.kt)("pre",{parentName:"admonition"},(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# dpkg -i kompose_1.28.0-1_amd64.deb\ndpkg-deb: error: archive 'kompose_1.28.0-1_amd64.deb' uses unknown compression for member 'control.tar.zst', giving up\ndpkg: error processing archive kompose_1.28.0-1_amd64.deb (--install):\n dpkg-deb --control subprocess returned error exit status 2\nErrors were encountered while processing:\n kompose_1.28.0-1_amd64.deb\n")),(0,a.kt)("p",{parentName:"admonition"},"C\u2019est parce que Debian a chang\xe9 le chiffrement du package en passant du ",(0,a.kt)("inlineCode",{parentName:"p"},"zstd")," au ",(0,a.kt)("inlineCode",{parentName:"p"},"xz"),". Il est possible de "),(0,a.kt)("pre",{parentName:"admonition"},(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"fichier=kompose_1.28.0-1_amd64.deb\nar x $fichier\nzstd -d < control.tar.zst | xz > control.tar.xz\nzstd -d < data.tar.zst | xz > data.tar.xz\nar -m -c -a sdsd repacked_${fichier} debian-binary control.tar.xz data.tar.xz\nrm debian-binary control.tar.xz data.tar.xz control.tar.zst data.tar.zst\n"))),(0,a.kt)("hr",null),(0,a.kt)("p",null,"Cette page est maintenant termin\xe9e, je n\u2019h\xe9siterais pas \xe0 la compl\xe9ter si j\u2019approfondis le sujet."),(0,a.kt)("hr",null),(0,a.kt)("admonition",{title:"En lien avec cette page",type:"note"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/Adminsys/creer-repo-debian"},"H\xe9berger son d\xe9p\xf4t Debian")))))}m.isMDXComponent=!0}}]);