"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5655],{4137:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(r),d=a,k=m["".concat(l,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(k,s(s({ref:t},c),{},{components:r})):n.createElement(k,s({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var u=2;u<o;u++)s[u]=r[u];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},862:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var n=r(7462),a=(r(7294),r(4137));const o={slug:"presentation-docker-swarm",title:"Pr\xe9sentation rapide de Docker-Swarm",authors:{name:"TheBidouilleur",title:"Adorateur de trucs merdiques",url:"https://git.thoughtless.eu",image_url:"https://avatars.githubusercontent.com/u/82603435?v=4"},tags:["docker","swarm","containers","cluster"]},s=void 0,i={permalink:"/TheBidouilleur.xyz/blog/presentation-docker-swarm",editUrl:"https://github.com/QJoly/TheBidouilleur.xyz/tree/main/blog/2021-06-29-docker-swarm/index.md",source:"@site/blog/2021-06-29-docker-swarm/index.md",title:"Pr\xe9sentation rapide de Docker-Swarm",description:'[ Cet article provient de mon ancien-blog, celui-ci sera \xe9galement disponible dans la partie "Documentation" du site ]',date:"2021-06-29T00:00:00.000Z",formattedDate:"29 juin 2021",tags:[{label:"docker",permalink:"/TheBidouilleur.xyz/blog/tags/docker"},{label:"swarm",permalink:"/TheBidouilleur.xyz/blog/tags/swarm"},{label:"containers",permalink:"/TheBidouilleur.xyz/blog/tags/containers"},{label:"cluster",permalink:"/TheBidouilleur.xyz/blog/tags/cluster"}],readingTime:5.155,hasTruncateMarker:!0,authors:[{name:"TheBidouilleur",title:"Adorateur de trucs merdiques",url:"https://git.thoughtless.eu",image_url:"https://avatars.githubusercontent.com/u/82603435?v=4",imageURL:"https://avatars.githubusercontent.com/u/82603435?v=4"}],frontMatter:{slug:"presentation-docker-swarm",title:"Pr\xe9sentation rapide de Docker-Swarm",authors:{name:"TheBidouilleur",title:"Adorateur de trucs merdiques",url:"https://git.thoughtless.eu",image_url:"https://avatars.githubusercontent.com/u/82603435?v=4",imageURL:"https://avatars.githubusercontent.com/u/82603435?v=4"},tags:["docker","swarm","containers","cluster"]},prevItem:{title:"Mon voyage autour des loadbalancers",permalink:"/TheBidouilleur.xyz/blog/caddy"}},l={authorsImageUrls:[void 0]},u=[{value:"Introduction",id:"introduction",level:2},{value:"Qu&#39;est ce que Docker Swarm ?",id:"quest-ce-que-docker-swarm-",level:2},{value:"Cr\xe9er un cluster Swarm",id:"cr\xe9er-un-cluster-swarm",level:2},{value:"D\xe9ployer un service simple",id:"d\xe9ployer-un-service-simple",level:2},{value:"Gestion (simplifi\xe9e) des replicas",id:"gestion-simplifi\xe9e-des-replicas",level:2},{value:"Et la Haute-disponibilit\xe9, alors?",id:"et-la-haute-disponibilit\xe9-alors",level:2},{value:"Conclusion",id:"conclusion",level:2}],c={toc:u};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,'[ Cet article provient de mon ancien-blog, celui-ci sera \xe9galement disponible dans la partie "Documentation" du site ]'),(0,a.kt)("h1",{id:"docker-swarm"},"Docker Swarm"),(0,a.kt)("h2",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"Le monde de la conteneurisation a apport\xe9 de nombreuses choses dans l'administration syst\xe8me, et a actualis\xe9 le concept de DevOps. Mais une des choses principales que nous apporte les conteneurs (et particuli\xe8rement Docker), c'est ",(0,a.kt)("strong",{parentName:"p"},"l'automatisation"),".\nEt bien que Docker soit d\xe9j\xe0 complet avec le d\xe9ploiement de service, on peut aller un peu plus loin en automatisant la gestion des conteneurs ! Et pour r\xe9pondre \xe0 \xe7a : ",(0,a.kt)("em",{parentName:"p"},"Docker Inc.")," propose un outil adapt\xe9 pour l'orchestration automatique d'instance : ",(0,a.kt)("strong",{parentName:"p"},"Docker Swarm"),". "),(0,a.kt)("h2",{id:"quest-ce-que-docker-swarm-"},"Qu'est ce que Docker Swarm ?"),(0,a.kt)("p",null,"Comme dit pr\xe9c\xe9demment : Docker Swarm est un outil d'orchestration. Avec cet outil, on peut g\xe9rer automatiquement nos conteneurs avec des r\xe8gles favorisant la Haute-disponibilit\xe9, et l'\xe9volutivit\xe9 (Scalability) de vos services.\nOn peut donc imaginer 2 sc\xe9narios qui sont enti\xe8rement compatibles : "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Votre site a un pic de charge et n\xe9c\xe9ssite plusieurs conteneurs : Docker Swarm g\xe8re la replication et l'\xe9quilibrage des charges"),(0,a.kt)("li",{parentName:"ul"},"Une machine h\xe9bergeant vos Dockers est en panne : Docker Swarm r\xe9plique vos conteneurs sur d'autres machines. ")),(0,a.kt)("p",null,"Nous allons donc voir comment configurer \xe7a, et faire un p'tit \xe9tat des lieux des fonctionnalit\xe9s propos\xe9es. "),(0,a.kt)("h2",{id:"cr\xe9er-un-cluster-swarm"},"Cr\xe9er un cluster Swarm"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Pour les tests, j'utiliserai PWD (Play With Docker) pour m'\xe9viter de monter \xe7a sur mon infra")," :) "),(0,a.kt)("p",null,"Je dispose donc de 4 machines sous ",(0,a.kt)("strong",{parentName:"p"},"Alpine")," sur lesquelles je vais lancer d\xe9marrer un cluster Swarm.\n",(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/7mD3suS.png",alt:null})),(0,a.kt)("p",null,"La premi\xe8re \xe9tape est de d\xe9finir un Manager, celui-ci sera la t\xeate du cluster, ainsi que le points d'acc\xe8s vers les diff\xe9rentes machines.\nDans notre cas, on va faire tr\xe8s simple, le manager sera ",(0,a.kt)("strong",{parentName:"p"},"Node1"),"."),(0,a.kt)("p",null,"Pour lancer le Swarm sur le manager, il suffit d'utiliser la commande ",(0,a.kt)("inlineCode",{parentName:"p"},"docker swarm init"),".\n",(0,a.kt)("strong",{parentName:"p"},"Mais"),", si votre syst\xe8me poss\xe8de un nombre de carte r\xe9seau sup\xe9rieur \xe0 1 ",(0,a.kt)("em",{parentName:"p"},"(Assez facile sur un serveur)"),", il faut donner l'IP d'\xe9coute.\nDans mon cas, l'IP de l'interface du r\xe9seau local (dans lequel les VMs communiquent) est ",(0,a.kt)("em",{parentName:"p"},"192.168.0.8"),".\nDonc la commande que je vais lancer est "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"docker swarm init --advertise-addr 192.168.0.8\n")),(0,a.kt)("p",null,"Docker me r\xe9pond ceci : "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"Swarm initialized: current node (cdbgbq3q4jp1e6espusj48qm3) is now a manager.\nTo add a worker to this swarm, run the following command:\n    docker swarm join --token SWMTKN-1-5od5zuquln0kgkxpjybvcd45pctp4cp0l12srhdqe178ly8s2m-046hmuczuim8oddmk08gjd1fp 192.168.0.8:2377\nTo add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.`\n")),(0,a.kt)("p",null,"En r\xe9sum\xe9 : Le cluster est bien lanc\xe9, et Il nous donne la commande exacte pour rejoindre le cluster depuis d'autres machines !\nla Node1 \xe9tant le manager, il me suffit d'executer la commande ",(0,a.kt)("inlineCode",{parentName:"p"},"docker swarm join")," sur les node2-4."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"docker swarm join --token SWMTKN-1-5od5zuquln0kgkxpjybvcd45pctp4cp0l12srhdqe178ly8s2m-046hmuczuim8oddmk08gjd1fp 192.168.0.8:2377\n")),(0,a.kt)("p",null,"Une fois termin\xe9, on peut regarder le r\xe9sultat sur le ",(0,a.kt)("em",{parentName:"p"},"manageur")," avec la commande ",(0,a.kt)("inlineCode",{parentName:"p"},"docker node ls"),"\n",(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/2rgU3wm.png",alt:null})),(0,a.kt)("h2",{id:"d\xe9ployer-un-service-simple"},"D\xe9ployer un service simple"),(0,a.kt)("p",null,"Si vous \xeates adepte de la commande ",(0,a.kt)("inlineCode",{parentName:"p"},"docker run")," et que vous refusez docker-compose, sachez une chose : je ne vous aime pas.\nComme vous m'\xeates sympatique, voici une info qui ne servira pas : l'\xe9quivalent de ",(0,a.kt)("inlineCode",{parentName:"p"},"docker run")," en Swarm est ",(0,a.kt)("inlineCode",{parentName:"p"},"docker service"),". Mais nous n'allons pas aborder ce sujet dans cet article."),(0,a.kt)("p",null,"On va plutot utiliser l'\xe9quivalent de ",(0,a.kt)("inlineCode",{parentName:"p"},"docker-compose"),", qui est ",(0,a.kt)("inlineCode",{parentName:"p"},"docker stack"),".\nDonc avant-tout, voici le fichier .yml"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'version: "3"\nservices:\n  viz:\n    image: dockersamples/visualizer\n    volumes:\n       - "/var/run/docker.sock:/var/run/docker.sock"\n    ports:\n       - "8080:8080"\n    deploy:\n      replicas: 1\n      placement:\n        constraints:\n          - node.role == manager\n')),(0,a.kt)("p",null,"Avant de le d\xe9marrer, vous remarquerez surement la partie ",(0,a.kt)("strong",{parentName:"p"},"deploy")," qui permet de donner des indications \xe0 Swarm. On peut donc rajouter des contraintes pour deployer \xe7a sur le/les managers, demander \xe0 l'hote de limiter l'utilisation des ressources, ou g\xe9rer des r\xe9pliques pour l'\xe9quilibrage des charges. "),(0,a.kt)("p",null,"Ce premier conteneur servira \xe0 avoir un dashboard simple pour voir o\xf9 se positionnent les Dashboard, et \xe9viter de passer uniquement en CLI pour cette fonction."),(0,a.kt)("p",null,"On va donc d\xe9ployer ce compose avec la commande suivante: "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"docker stack deploy --compose-file docker-compose.yml swarm-visualiser\n")),(0,a.kt)("p",null,"Une fois la commande termin\xe9e, il suffit d'ouvrir le serveur web du manager au port 8080.\n",(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/sVKKmtj.png",alt:null})),(0,a.kt)("p",null,"On a donc maintenant un panel Web pour suivre les mises \xe0 jour des conteneurs. "),(0,a.kt)("h2",{id:"gestion-simplifi\xe9e-des-replicas"},"Gestion (simplifi\xe9e) des replicas"),(0,a.kt)("p",null,"Lorsque l'on acc\xe8de \xe0 un conteneur, on passe obligatoirement par le manager. Mais rien n'empeche d'\xeatre rediriger vers le noeud 3-4 en passant par le manager. C'est pourquoi il est possible de r\xe9partir la charge (Load Balancing) avec un syst\xe8me similaire \xe0 HAProxy, c.a.d. en redirigeant les utilisateurs sur un autre conteneur \xe0 chaque chargement d'un page."),(0,a.kt)("p",null,"Voici un docker-compose cr\xe9ant automatiquement des replicas :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},"version: '3.3'\nservices:\n    hello-world:\n        container_name: web-test\n        ports:\n            - '80:8000'\n        image: crccheck/hello-world\n        deploy:\n          replicas: 4\n")),(0,a.kt)("p",null,"Et le r\xe9sultat est surprenant :\n",(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/27a7V2i.png",alt:null})),(0,a.kt)("p",null,"Nous pouvons \xe9galement adapter le nombre de replica..\nEn le diminuant:"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"docker service scale hello-world_hello-world=2")),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/pf4Y1ih.png",alt:null})),(0,a.kt)("p",null,"Ou en l'augmentant: "),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"docker service scale hello-world_hello-world=20")),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/MW5uUOq.png",alt:null})),(0,a.kt)("h2",{id:"et-la-haute-disponibilit\xe9-alors"},"Et la Haute-disponibilit\xe9, alors?"),(0,a.kt)("p",null,"J'ai ax\xe9 cet article dans les fonctions de Swarm, et comment les utiliser. Et si je n'ai abord\xe9 ce point en priorit\xe9, c'est parce que chaque conteneur cr\xe9\xe9 dans ce post est g\xe9r\xe9 en HA !\nJe vais, par exemple, stopper de force la 10eme r\xe9plique du conteneur \"Hello world\", qui se trouve sur ",(0,a.kt)("strong",{parentName:"p"},"Node1"),". Et Celui-ci sera directement relanc\xe9,\n",(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/7Ni9NNG.png",alt:null})),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Okay, Mais docker pouvait d\xe9j\xe0 relancer automatiquement les conteneurs en cas de probl\xe8me, en quoi swarm est diff\xe9rent?")),(0,a.kt)("p",null,"Et pour r\xe9pondre \xe0 \xe7a, je vais me permettre de stopper le ",(0,a.kt)("strong",{parentName:"p"},"node4"),"\n",(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/ejkzT7a.png",alt:null})),(0,a.kt)("p",null,"On remarque que les autres noeuds se r\xe9partissent automatiquement, (et sans aucune intervention) les conteneurs stopp\xe9s. Et comme nous accedons aux services uniquement via les manageurs, ceux-ci ne redirigeront plus que vers les conteneurs d\xe9marr\xe9s.\nUn des serveurs peut donc prendre feu, le service sera toujours redond\xe9, \xe9quilibr\xe9, et accessible. "),(0,a.kt)("h2",{id:"conclusion"},"Conclusion"),(0,a.kt)("p",null,"Docker-Swarm est un point d'entr\xe9 vers les Clusters d'applications qui sont d'une complexit\xe9 incroyable sans un outil adapt\xe9. Swarm permet facilement de r\xe9pondre \xe0 des besoins particuliers, sans aucune comp\xe9tence technique.\nDans un environnement de production, il est conseill\xe9 de s'orienter vers Kubernetes ou Nomad qui sont des alternatives bien plus compl\xe8tes et puissantes. "),(0,a.kt)("p",null,"Je vous encourage \xe0 essayer ce genre de technologie qui gouverneront notre monde de demain ! "),(0,a.kt)("p",null,"Merci d'avoir lu"))}p.isMDXComponent=!0}}]);