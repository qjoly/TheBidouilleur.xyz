---
slug: caddy
title: Mon voyage autour des loadbalancers
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: https://git.thoughtless.eu
  image_url: https://git.thoughtless.eu/avatars/05bed00fb8cb64b8e3b222f797bcd3d8
tags: [proxmox, packer, devops]
---

*Changelog (janv 2022) - Aujourd'hui, j'ai remplacé Caddy par Traefik, à voir dans un futur article*

Dans ma courte vie d'informaticien, je n'ai toujours eu qu'une seule IP publique. Celle de mon serveur OVH sur lequel vous visualisez le site actuellement. Et en sachant que j'ai de nombreux services Web, il m'a rapidement été nécéssaire de chercher les différents solutions permettant d'installer un **Reverse Proxy** efficace qui servirait à rediriger mes utilisateurs vers l'application voulue en fonction du domaine. 

Dans ma longue quête (qui n'est certainement pas achevée), j'ai eu l'occassion de tester de *nombreuses* solutions comme Haproxy, Apache2, Nginx et maintenant.. Caddy

Haproxy a été pour moi le plus facile et le plus pratique pour démarrer, bonne documentation, incorpore de nombreux outils permettant de vérifier la configuration, ou rajouter des authentifications. J'ai été satisfait durant quelques années. 

(Je ne compte pas Apache2, qui a été pratique pour débuter sans installer un service dédié à mon besoin de redirection)

Ensuite, j'ai utilisé **aaPanel** (dont vous trouverez un article sur ce site) me permettant d'avoir une toute un panel web pour mes sites et mes redirections ! *J'ai abandonné en sachant que c'était un système bien ficelé dans lequel j'avais peu de liberté en terme d'édition de config*

Puis mon besoin inutile d'avoir une interface Web m'a mené vers **NPM** (*Nginx Proxy Manager*) dont vous trouverez plus d'information [ici](https://nginxproxymanager.com/). Qui m'était très pratique en sachant qu'il était sous forme de conteneur Docker, et proposant une interface gérant la création de redirection ainsi que le SSL, toujours chez **let's encrypt**. 
Mais à chaque expiration de certificat, NPM m'obligeait à aller manuellement séléctionner un-par-un chaque certificat à update : et ça, c'était impensable en sachant le nombre de domaine que j'ai créé. 


Aujourd'hui, mon attention se porte vers **Caddy** qui, pour l'instant, correspond exactement à ce que je souhaite, et avec une simplicité incroyable. 

# Caddy 

Caddy est, comme vous l'aurez compris, un reverse-proxy assez polyvalent et très utilisé dans certains conteneurs Docker ! Celui-ci génère automatiquement vos certificats (et configure les redirections automatiquement) sans aucun soucis avec Let's Encrypt. Caddy est assez léger et vous évitera les configurations à ralonge, voici un exemple bête : 


```yml
thoughtless.eu {
	reverse_proxy 192.168.5.125:8062
	log {
		output file /var/log/caddy/thoughtless.eu_access.log
	}
}
```

Cette ligne créera une redirection en reverse-proxy avec la configuration par défault : 

- Caddy updatera / generera des certificats chaque fois que c'est nécéssaire
- Il redirigera automatiquement les requetes en http:// vers le https://
- Il écriera des logs des accès dans un fichier

En apache2 / Haproxy, ça aurait pris un chouïa + de lignes. 


Mais attendons de voir, Caddy est encore très neuf pour moi, et je suis sûr que mon prochain besoin m'orientera vers une autre solution telle que Traefik par exemple ! 

Bonne courage dans votre longue quête autour des reverse-proxy
 

