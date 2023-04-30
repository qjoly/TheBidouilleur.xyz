"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5376],{4137:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),l=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(u.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,s=e.originalType,u=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=l(r),d=a,k=m["".concat(u,".").concat(d)]||m[d]||c[d]||s;return r?n.createElement(k,i(i({ref:t},p),{},{components:r})):n.createElement(k,i({ref:t},p))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=r.length,i=new Array(s);i[0]=m;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var l=2;l<s;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},3461:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>c,frontMatter:()=>s,metadata:()=>o,toc:()=>l});var n=r(7462),a=(r(7294),r(4137));const s={slug:"traefik",title:"Traefik, le reverse-proxy multi-provider",authors:{name:"TheBidouilleur",title:"Adorateur de trucs merdiques",url:"https://github.com/qjoly/",image_url:"https://avatars.githubusercontent.com/u/82603435?v=4"},tags:["traefik","docker"]},i=void 0,o={permalink:"/TheBidouilleur.xyz/blog/traefik",editUrl:"https://github.com/QJoly/TheBidouilleur.xyz/tree/main/blog/2022-01-26-Traefik/index.md",source:"@site/blog/2022-01-26-Traefik/index.md",title:"Traefik, le reverse-proxy multi-provider",description:"L'ann\xe9e derni\xe8re, j'ai dit que j'appr\xe9ciais particuli\xe8rement Caddy qui \xe9tait simple, pratique, rapide et efficace. Caddy permet, \xe0 partir d'une ligne aussi simple que :",date:"2022-01-26T00:00:00.000Z",formattedDate:"26 janvier 2022",tags:[{label:"traefik",permalink:"/TheBidouilleur.xyz/blog/tags/traefik"},{label:"docker",permalink:"/TheBidouilleur.xyz/blog/tags/docker"}],readingTime:9.075,hasTruncateMarker:!1,authors:[{name:"TheBidouilleur",title:"Adorateur de trucs merdiques",url:"https://github.com/qjoly/",image_url:"https://avatars.githubusercontent.com/u/82603435?v=4",imageURL:"https://avatars.githubusercontent.com/u/82603435?v=4"}],frontMatter:{slug:"traefik",title:"Traefik, le reverse-proxy multi-provider",authors:{name:"TheBidouilleur",title:"Adorateur de trucs merdiques",url:"https://github.com/qjoly/",image_url:"https://avatars.githubusercontent.com/u/82603435?v=4",imageURL:"https://avatars.githubusercontent.com/u/82603435?v=4"},tags:["traefik","docker"]},prevItem:{title:"Pr\xe9sentation rapide de Packer",permalink:"/TheBidouilleur.xyz/blog/presentation-packer"},nextItem:{title:"Utilisation de Loki pour Centraliser les logs",permalink:"/TheBidouilleur.xyz/blog/loki-grafana"}},u={authorsImageUrls:[void 0]},l=[{value:"Qu&#39;est-ce que Traefik ?",id:"quest-ce-que-traefik-",level:2},{value:"Comment fonctionne Traefik ?",id:"comment-fonctionne-traefik-",level:2},{value:"Gestion des certificats https",id:"gestion-des-certificats-https",level:3},{value:"Traefik et Swarm",id:"traefik-et-swarm",level:3},{value:"Astuce pour machines isol\xe9es du cluster",id:"astuce-pour-machines-isol\xe9es-du-cluster",level:2}],p={toc:l};function c(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"L'ann\xe9e derni\xe8re, j'ai dit que j'appr\xe9ciais particuli\xe8rement ",(0,a.kt)("strong",{parentName:"p"},"Caddy")," qui \xe9tait simple, pratique, rapide et efficace. Caddy permet, \xe0 partir d'une ligne aussi simple que :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"domain.tld {\n  reverse_proxy 127.0.0.1:80\n}\n")),(0,a.kt)("p",null,"En plus de \xe7a, Caddy va constamment v\xe9rifier l'expiration de vos certificats letsencrypt et de les renouveler automatiquement sans aucune interaction n\xe9c\xe9ssaire.\nCaddy est \xe9galement facile \xe0 d\xe9ployer via Docker."),(0,a.kt)("p",null,"Que demander de plus ?"),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"De l'automatisation\u202f?")),(0,a.kt)("p",null,"Parfaitement, cher lecteur ! Vous m'\xe9tonnez toujours !\nJ'ai donc cr\xe9\xe9 un R\xf4le Ansible g\xe9n\xe9rant ma configuration automatiquement \xe0 partir d'un d\xe9p\xf4t Git avec les IP correspondant aux domaines que je souhaite utiliser.\nMaintenant, \xe0 partir de \xe7a, je peux faire un script Bash r\xe9cup\xe9rant les ports de mes conteneurs, puis push sur mon Git les nouvelles redire\u2026."),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"C'est une usine \xe0 gaz\u2026")),(0,a.kt)("p",null,"Et vous avez raison ! Ce syst\xe8me est obsol\xe8te en quelques secondes lorsqu'on utilise un syst\xe8me de ",(0,a.kt)("em",{parentName:"p"},"service discovery")," permettant de r\xe9cup\xe9rer mes services et automatiser l'ajout de ces services sur mon g\u2026. Bon d'accord, toujours \"",(0,a.kt)("em",{parentName:"p"},"usine \xe0 gaz"),'" !'),(0,a.kt)("p",null,"Pas le choix, je vais devoir en cons\xe9quence remplacer Caddy par quelque chose d'autre. Et justement : je sais exactement le soft \xe0 utiliser."),(0,a.kt)("p",null,"Place \xe0 ",(0,a.kt)("strong",{parentName:"p"},"Traefik"),", le RP (Reverse proxy) multi-provider avec du service discovery."),(0,a.kt)("p",null,"Cet article sur ",(0,a.kt)("strong",{parentName:"p"},"Traefik")," est en cours de r\xe9daction, vous pouvez me suivre sur ",(0,a.kt)("a",{parentName:"p",href:"https://twitter.com/TheBidouilleur"},"twitter")," pour \xeatre au courant des prochaines \xe9critures ainsi que mon avancement dans mes projets !"),(0,a.kt)("h2",{id:"quest-ce-que-traefik-"},"Qu'est-ce que Traefik ?"),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://i.imgur.com/XxOB7Fo.png",alt:"logo de traefik"})),(0,a.kt)("p",null,"Comme expliqu\xe9 juste au-dessus, Traefik est un reverse-proxy qui se d\xe9marque des autres par son systeme de provider et de middleware. Il ne r\xe9invente pas la roue, mais il est particuli\xe8rement efficace lorsque l'on a un grand nombre de redirections \xe0 param\xe9trer ou que nous avons des r\xe8gles qui changent r\xe9guli\xe8rement."),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://www.ionos.fr/digitalguide/serveur/know-how/quest-ce-quun-reverse-proxy-le-serveur-reverse-proxy/"},(0,a.kt)("em",{parentName:"a"},"si vous ignorez ce qu'est un reverse-proxy, je vous invite \xe0 consulter cet article de Ionos"))),(0,a.kt)("p",null,"Traefik n'est ",(0,a.kt)("strong",{parentName:"p"},"pas")," fait pour vous si :"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Vous n'utilisez pas Docker, Kubernetes ou Consul"),(0,a.kt)("li",{parentName:"ul"},"Si vous avez peu de r\xe8gles (et surtout si elles sont statiques)"),(0,a.kt)("li",{parentName:"ul"},"Vous ne vous souciez pas d'automatiser votre RP")),(0,a.kt)("p",null,"et en revanche :\nTraefik est ",(0,a.kt)("strong",{parentName:"p"},"fait")," pour vous si :"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Vos services sont r\xe9partis sur de nombreuses machines"),(0,a.kt)("li",{parentName:"ul"},"Vous avez un Swarm / Kubernetes")),(0,a.kt)("p",null,"Traefik, ce n'est pas pour tout le monde. Mais il y a de nombreux cas, et de nombreux domaines o\xf9 Traefik n'est pas employ\xe9 alors qu'il le devrait."),(0,a.kt)("h2",{id:"comment-fonctionne-traefik-"},"Comment fonctionne Traefik ?"),(0,a.kt)("p",null,"Traefik se base sur un syst\xe8me de ",(0,a.kt)("strong",{parentName:"p"},"Provider"),'. Un Provider est un moyen de r\xe9cup\xe9rer les fameuses r\xe8gles "domaine -> IP" de mani\xe8re ',(0,a.kt)("em",{parentName:"p"},"automatique")," (ou presque).\nPar exemple, sur Caddy, notre provider (la mani\xe8re dont on r\xe9cup\xe8re notre configuration) est un simple fichier.\nNotre seule mani\xe8re d'automatiser Caddy se repose donc sur notre gestion de ce fichier. (le ",(0,a.kt)("strong",{parentName:"p"},"Caddyfile"),")"),(0,a.kt)("p",null,"Et c'est justement cet unique provider qui va me faire pencher vers Traefik, qui poss\xe8de une grande liste de provider. Parmis ces providers, nous avons :"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Docker"),(0,a.kt)("li",{parentName:"ul"},"Kubernetes / Rancher"),(0,a.kt)("li",{parentName:"ul"},"Redis"),(0,a.kt)("li",{parentName:"ul"},"des Fichiers classiques"),(0,a.kt)("li",{parentName:"ul"},"Une API Json")),(0,a.kt)("p",null,"et en fonction des providers que l'on accorde \xe0 Traefik(et du contenu), celui-ci va s'adapter pour cr\xe9er les redirections de mani\xe8re automatique."),(0,a.kt)("p",null,"Nous allons tester \xe7a directement dans notre premier Traefik de test !\nOn va avant-tout cr\xe9er le r\xe9seau Docker qui permettra \xe0 notre reverse-proxy d'acc\xe9der aux conteneurs."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"docker network create --driver=overlay traefik-net\n")),(0,a.kt)("p",null,"et on va cr\xe9er notre docker-compose contenant Traefik:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'version: "3.7"\n\nservices:\n  traefik:\n    image: "traefik:v2.5"\n    container_name: "traefik"\n    hostname: "traefik"\n    networks:\n      - traefik-net\n    ports:\n      - "80:80"\n      - "443:443"\n      - "8080:8080"\n    volumes:\n      - "/var/run/docker.sock:/var/run/docker.sock:ro"\n      - "./config:/etc/traefik"\nnetworks:\n  traefik-net:\n    external: true\n    driver: overlay\n    name: traefik-net\n')),(0,a.kt)("p",null,"Puis, dans un dossier ",(0,a.kt)("strong",{parentName:"p"},"./config"),", nous allons cr\xe9er le fichier ",(0,a.kt)("strong",{parentName:"p"},"traefik.yml")," qui va contenir notre configuration, et nos providers."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'# fichier traefik.yml, \xe0 mettre dans un dossier ./config\n---\nlog:\n  level: "INFO"\n  format: "common"\n\nproviders:\n  docker:\n    endpoint: "unix:///var/run/docker.sock"   # Provider Docker sur la machine locale\n    exposedByDefault: false                   # Par d\xe9faut, les conteneurs ne poss\xe8dent pas de redirection\n    network: "traefik-net"                    # Le r\xe9seau docker dans lequel il y aura.\n    watch: true   \n  file:\n    filename: "/etc/traefik/dynamic.yml"      # Fichier contenant les r\xe8gles statiques\n    watch: true                               # Va actualiser son contenu r\xe9guli\xe8rement pour mettre les r\xe8gles \xe0 jour\n  providersThrottleDuration: 10               # Va actualiser les r\xe8gles chaque 10s\n\napi:                                          # Va rendre le Dashboard de Traefik accessible en http\n  dashboard: true\n  debug: false\n  insecure: true\n\nentryPoints:                                  # Notre entr\xe9e, nous acceptons les requetes via https sur le port 80\n  insecure:\n    address: ":80"\n')),(0,a.kt)("p",null,"Et notre fichier ",(0,a.kt)("strong",{parentName:"p"},"dynamic.yml")," qui contiendra nos r\xe8gles statiques :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'http:\n  routers:\n    helloworld-http:\n      rule: "Host(`hello-world.tld`)" \n      service: hello-world\n      entryPoints:\n        - insecure \n\n  services:\n    hello-world:\n      loadBalancer:\n        servers:\n           - url: "http://192.168.128.1:80"\n')),(0,a.kt)("p",null,"En d\xe9marrant Traefik, on on remarque qu'il va se mettre \xe0 jour chaque 10s en interrogeant le daemon Docker ainsi que le fichier."),(0,a.kt)("p",null,"On peut maintenant cr\xe9er notre premier conteneur \xe0 rajouter de cette mani\xe8re:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'version: "3.7"\n\nservices:\n  whoami:\n    image: "containous/whoami"\n    container_name: "whoami"\n    hostname: "whoami"\n    labels:\n      - "traefik.enable=true"\n      - "traefik.http.routers.whoami.entrypoints=insecure"\n      - "traefik.http.routers.whoami.rule=Host(`whoami-tf.thebidouilleur.xyz`)"\n      - "traefik.http.routers.whoami.tls.certresolver=letsencrypt"\n\nnetworks:\n  default:\n    external:\n      name: traefik_net\n\n')),(0,a.kt)("p",null,'Nous avons alors cr\xe9\xe9 la r\xe8gle "whoami-tf.thebidouilleur.xyz" vers notre conteneur. On remarque que ',(0,a.kt)("strong",{parentName:"p"},"nous n'avons pas expos\xe9 de port"),", Traefik va passer par le r\xe9seau interne ",(0,a.kt)("em",{parentName:"p"},"traefik_net")," pour acc\xe9der au service.  C'est une couche de s\xe9curit\xe9 \xe0 ne pas n\xe9gliger, vos services seront accessibles entre eux, et via le reverse-proxy."),(0,a.kt)("h3",{id:"gestion-des-certificats-https"},"Gestion des certificats https"),(0,a.kt)("p",null,"Maintenant, si vous passez par internet pour acc\xe9der \xe0 vos services.. C'est peut-\xeatre pratique d'avoir du https, et justement\xa0: Traefik g\xe8rera vos certificats de mani\xe8re automatique.\nTraefik utilise l'api gratuite de ",(0,a.kt)("strong",{parentName:"p"},"LetsEncrypt")," pour obtenir ses certificats, nous devons donc cr\xe9er une entr\xe9e d\xe9di\xe9e au https sur le port 443"),(0,a.kt)("p",null,"On va donc mettre \xe0 jour notre configuration comme ceci\xa0:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'entryPoints:\n  insecure:\n    address: ":80"\n    http:\n     redirections:\n       entryPoint:\n         to: secure\n  secure:\n    address: ":443" \n\ncertificatesResolvers:\n  letsencrypt:\n    acme:\n      email: "contact@thoughtless.eu"\n      storage: "/etc/traefik/acme.json"\n        #      caServer: "https://acme-staging-v02.api.letsencrypt.org/directory"\n      keyType: "EC256"\n      httpChallenge:\n        entryPoint: "insecure"\n')),(0,a.kt)("p",null,"Red\xe9marrez Traefik, et celui-ci tentera de g\xe9n\xe9rer les certificats pour les domaines configur\xe9s !\nEn acc\xe9dant \xe0 la page suivante\xa0: ",(0,a.kt)("em",{parentName:"p"},(0,a.kt)("a",{parentName:"em",href:"http://traefik:8080"},"http://traefik:8080")),' ,vous aurez un dashboard sur lequel vous verrez les routeurs "domaines d\'entr\xe9s", les "services" (redirections), et si ce symbole apparait : Traefik a bien appliqu\xe9 un certificat \xe0 ce router.'),(0,a.kt)("p",null,"Il est \xe9galement possible, avec un peu plus de configuration, d'obtenir un certificat ",(0,a.kt)("strong",{parentName:"p"},"Wildcard")," (",(0,a.kt)("em",{parentName:"p"},"certificat valide pour un domaine entier"),")  avec Traefik. Pour le moment : je n'ai pas besoin d'un wildcard pour mes domaines.\nSi le sujet vous int\xe9resse, voici un lien pour approfondir \xe7a : ",(0,a.kt)("a",{parentName:"p",href:"https://computerz.solutions/traefik-ssl-wildcard-letsencrypt/"},"Certificat Wildcard Traefik")),(0,a.kt)("p",null,"Et si on allait plus loin ?"),(0,a.kt)("h3",{id:"traefik-et-swarm"},"Traefik et Swarm"),(0,a.kt)("p",null,"Depuis maintenant un peu plus d'un an, mes conteneurs tournent sur un ",(0,a.kt)("strong",{parentName:"p"},"cluster swarm")," ",(0,a.kt)("em",{parentName:"p"},"(Si vous ne savez pas ce qu'est un Swarm, je vous renvoie vers ",(0,a.kt)("a",{parentName:"em",href:"https://thebidouilleur.xyz/posts/DockerSwarm/"},"cet article"),")"),", et \xe7a peut complexifier les choses lorsque les labels (permettant \xe0 traefik de comprendre quel docker correspond \xe0 quel domaine) fonctionnent un peu diff\xe9remment."),(0,a.kt)("p",null,"Les labels classiquent ne fonctionnent que sur la machine ",(0,a.kt)("em",{parentName:"p"},"hote")," (par exemple: ",(0,a.kt)("em",{parentName:"p"},"Worker01"),") mais si Traefik est sur la machine ",(0,a.kt)("em",{parentName:"p"},"Worker02"),", les labels des conteneurs ne seront pas visibles.\nPour palier \xe0 ce probl\xe8me, nous devons utiliser les m\xeames labels \u2026 dans la section ",(0,a.kt)("strong",{parentName:"p"},"deploy")," d'un docker-compose."),(0,a.kt)("p",null,"Voici le docker-compose whoami adapt\xe9 pour Swarm:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},'version: "3.7"\n\nservices:\n  whoami:\n    image: "containous/whoami"\n    container_name: "whoami"\n    hostname: "whoami"\n    deploy:\n      labels:\n        - "traefik.enable=true"\n        - "traefik.http.routers.whoami.entrypoints=insecure"\n        - "traefik.http.routers.whoami.rule=Host(`whoami-tf.thebidouilleur.xyz`)"\n        - "traefik.http.routers.whoami.tls.certresolver=letsencrypt"\n\nnetworks:\n  default:\n    external:\n      name: traefik_net\n\n')),(0,a.kt)("admonition",{type:"danger"},(0,a.kt)("p",{parentName:"admonition"},"\xe0 noter que cette structure ne fonctionne qu'avec les docker-compose de version >3.7")),(0,a.kt)("p",null,"Et pour que le conteneur traefik puisse lire ces labels.. Il doit \xeatre s\xfbr ",(0,a.kt)("strong",{parentName:"p"},"un manager")," du swarm. Nous devons donc \xe9galement mettre \xe0 jour notre docker-compose de Traefik :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},'version: "3.7"\n\nservices:\n  traefik:\n    image: "traefik:v2.5"\n    container_name: "traefik"\n    hostname: "traefik"\n    networks:\n      - traefik-net\n    ports:\n      - "80:80"\n      - "443:443"\n      - "8080:8080"\n    volumes:\n      - "/var/run/docker.sock:/var/run/docker.sock:ro"\n      - "./config:/etc/traefik"\n    deploy:\n      placement:\n        constraints:\n          - node.role == manager\n      labels:\n        - "traefik.enable=true"\n        - "traefik.http.routers.traefik.entrypoints=secure"\n        - "traefik.http.routers.traefik.rule=Host(`traefik.forky.ovh`)"\n        - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"\n        - "traefik.http.services.traefik.loadbalancer.server.port=8080"\n\n\nnetworks:\n  traefik-net:\n    external: true\n    driver: overlay\n    name: traefik-net\n')),(0,a.kt)("p",null,"et nous pouvons le d\xe9ployer dans le swarm avec la commande"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"docker stack deploy -c docker-compose.yml traefik\n")),(0,a.kt)("p",null,"Autre sp\xe9cificit\xe9 du Swarm : Si le port d'\xe9coute du service n'est ",(0,a.kt)("strong",{parentName:"p"},"pas 80"),", il faudra pr\xe9ciser \xe0 Traefik le port \xe0 utiliser. C'est ce qu'on peut voir sur le docker-compose ci-dessus avec ",(0,a.kt)("inlineCode",{parentName:"p"},"traefik.http.services.traefik.loadbalancer.server.port"),", \xe7a sera la derni\xe8re diff\xe9rence entre Traefik sur une machine standalone et un cluster."),(0,a.kt)("p",null,"Maintenant, comment faire si nous voulons cr\xe9er une r\xe8gle automatique avec une machine qui n'est ",(0,a.kt)("strong",{parentName:"p"},"pas")," dans notre swarm ?"),(0,a.kt)("h2",{id:"astuce-pour-machines-isol\xe9es-du-cluster"},"Astuce pour machines isol\xe9es du cluster"),(0,a.kt)("p",null,"Jusque-l\xe0, nous avons ",(0,a.kt)("strong",{parentName:"p"},"2 providers")," : le provider ",(0,a.kt)("em",{parentName:"p"},"Docker (pour le cluster)")," et le provider ",(0,a.kt)("em",{parentName:"p"},"file")," qui concerne les r\xe8gles statiques ",(0,a.kt)("em",{parentName:"p"},"(comme mon pfsense)"),".\nTraefik n'accepte pas qu'on ait ",(0,a.kt)("em",{parentName:"p"},"2 providers du m\xeame type"),", ce qui veut dire que je ne peux pas surveiller le daemon docker de ma machine, ainsi que celui d'une machine distante."),(0,a.kt)("p",null,"Par exemple, mon ",(0,a.kt)("em",{parentName:"p"},"Gitea")," est un conteneur qui n'est pas dans mon swarm, et comme c'est une machine que je redeploie r\xe9guli\xe8rement (et donc IP diff\xe9rente), j'aimerai beaucoup laisser traefik faire son travail, mais en le laissant en m\xeame temps s'occuper du swarm !"),(0,a.kt)("p",null,"C'est l\xe0 que j'ai d\xe9couvert un projet Github r\xe9pondant \xe0 ce besoin : ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/jittering/traefik-kop"},"Traefik-pop")),(0,a.kt)("p",null,"Le sch\xe9ma ASCII du d\xe9p\xf4t parle de lui-m\xeame\xa0:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-scheme"},"                        +---------------------+          +---------------------+\n                        |                     |          |                     |\n+---------+     :443    |  +---------+        |     :3000|  +------------+     |\n|   WAN   |---------------\x3e| traefik |---------------------\x3e|    gitea   |     |\n+---------+             |  +---------+        |          |  +------------+     |\n                        |       |             |          |                     |\n                        |  +---------+        |          |  +-------------+    |\n                        |  |  redis  |<---------------------| traefik-kop |    |\n                        |  +---------+        |          |  +-------------+    |\n                        |             swarm   |          |             gitea   |\n                        +---------------------+          +---------------------+\n\n")),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"J'ai un peu modifi\xe9 le dessin pour qu'il colle \xe0 mon exemple"),"."),(0,a.kt)("p",null,"Si le dessin est un peu compliqu\xe9 : Nous allons cr\xe9er une base de donn\xe9e ",(0,a.kt)("strong",{parentName:"p"},"Redis")," ",(0,a.kt)("em",{parentName:"p"},"(C'est plus facile pour moi de le mettre sur le swamr, mais th\xe9oriquement, vous pouvez la mettre o\xf9 vous voulez)"),". Cette bdd, sera utilis\xe9e en tant que ",(0,a.kt)("strong",{parentName:"p"},"provider Traefik")," pour mettre \xe0 jour les r\xe8gles automatiquements !\nLe docker-compose de mon gitea devient donc :"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'version: "3"\nnetworks:\n  gitea:\n    external: false\nservices:\n  server:\n    image: gitea/gitea:latest\n    container_name: gitea\n    environment:\n      - USER_UID=1000\n      - USER_GID=1000\n      - GIT_DISCOVERY_ACROSS_FILESYSTEM=1\n    restart: always\n    networks:\n      - gitea\n    volumes:\n      - ./gitea:/data\n      - /etc/timezone:/etc/timezone:ro\n      - /etc/localtime:/etc/localtime:ro\n    ports:\n      - "3000:3000"\n      - "2200:22"\n    labels:\n      - "traefik.enable=true"\n      - "traefik.http.routers.gitea.entrypoints=secure"\n      - "traefik.http.routers.gitea.rule=Host(`git.thoughtless.eu`)"\n      - "traefik.http.routers.gitea.tls.certresolver=letsencrypt"\n      - "traefik.http.services.gitea.loadbalancer.server.port=3000"\n')),(0,a.kt)("p",null,"En red\xe9marrant Traefik, et en acc\xe9dant au panel, on remarque un nouvel provider : ",(0,a.kt)("em",{parentName:"p"},"Redis"),"."),(0,a.kt)("p",null,"et en visualisant les r\xe8gles : nous avons bien notre r\xe8gle concernant Gitea !"),(0,a.kt)("h1",{id:"conclusion"},"Conclusion"),(0,a.kt)("p",null,"Traefik est un des meilleurs reverses-proxy pour les infrastructures grandissantes. Celui-ci s'adapte \xe0 de nombreux besoins en proposant une couche d'automatisation sans n\xe9gliger la gestion statique et manuelle.\nCelui-ci demande un temps d'adaptation qui sera vite rentabilis\xe9."),(0,a.kt)("p",null,"J'esp\xe8re que ce reverse-proxy vous inspirera pour une infrastructure scalable simple et fiable."),(0,a.kt)("p",null,"Merci de m'avoir lu !"))}c.isMDXComponent=!0}}]);