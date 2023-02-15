---
title: Cert-Manager
slug: getting-started-cert-manager
description: Cert-Manager est un programme permettant de gérer les certificats (ainsi que leurs renouvellements) sur des clusters Kubernetes. Nous allons voir comment déployer Cert-Manager et générer nos premiers certificats.
---

## Introduction 

D’habitude, lorsque je commence à écrire une documentation, je commence toujours par une définition *(provenant souvent de Wikipédia)*. Comme la page Wikipédia de cert-manager n’est pas très complète *(et aussi pour être à la mode et en parler au moins une fois)*, je vais demander à **ChatGPT** pour m’écrire cette définition. 

> Cert-manager est un outil de gestion de certificats pour Kubernetes. Il permet d’automatiser la génération, la renouvellement et la gestion des certificats SSL/TLS pour vos applications sur le cluster. Cert-manager prend en charge plusieurs fournisseurs de certification tels que Let’s Encrypt, Vault, etc.
> En utilisant Cert-manager, vous pouvez déclarer la nécessité d’un certificat pour une application spécifique via un objet Kubernetes, appelé “Certificate” ou “Issuer”. Cert-manager s’occupe alors de la génération ou du renouvellement du certificat selon les spécifications définies dans l’objet.
> Cert-manager est un composant clé pour assurer la sécurité et la confidentialité des données dans les applications sur Kubernetes. Il facilite la gestion des certificats pour les administrateurs de cluster, ce qui permet d’éviter les erreurs humaines et de garantir la disponibilité constante de certificats valides pour les applications.
> En résumé, Cert-manager est un outil puissant pour gérer les certificats SSL/TLS dans un environnement Kubernetes, permettant une gestion plus efficace et sécurisée des certificats pour vos applications.
 
*ps: Oui, oui. ChatGPT m’a écrit “la renouvellement”.* 

![Schema cert-manager](https://camo.githubusercontent.com/94e6e2096b0bc286c36b61494276534d8f70f5e7e6171587c65832f2c621f688/68747470733a2f2f636572742d6d616e616765722e696f2f696d616765732f686967682d6c6576656c2d6f766572766965772e737667)

Jusqu’à maintenant, j’utilisais Traefik en tant que Ingress. Celui-ci générait les certificats et les stockait dans un fichier texte situé dans un volume longhorn. *(en sachant pertinemment que ce n’était pas très propre)*

Aujourd’hui, c’est l’heure de la propreté.. on passe sur Cert-Manager !

![Même incroyable pour parler de propreté](https://media.tenor.com/MoHGGcCxgqYAAAAd/time-to-clean-up-dozer.gif)

## Installer Cert-Manager

Au jour où j’écris cette page, nous en sommes à la version **v1.11.0**. 
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
```

:::warning Prendre la dernière version
Pensez à récupérer la dernière version de cert-manager. Vous trouverez les versions disponibles : [ici](https://github.com/cert-manager/cert-manager/releases) 
:::


## Fonctionnement de Cert-Manager

L’installation de Cert-Manager va différents objets. Ceux qui nous intéressent sont : 
- Les Issuers
- Les certificats

Les Issuers sont les fournisseurs de certificats. Cert-Manager est compatible avec les fournisseurs suivants : 
- ACME HTTP/DNS (compatible letsencrypt)
- Auto-signé *(Je conseille plutôt de générer son propre CA)* 
- CA custom 
- [Vault](https://www.vaultproject.io/)
- Venafi

Pour le moment, seul le fournisseur LetsEncrypt nous intéresse. *(Nous verrons peut-être le cas du CA un jour)*

## Créer ses propres certificats

### Ajouter un fournisseur (Issuer)

#### ACME via challenge HTTP

Le cas le plus courant lorsqu’on génère un certificat est d’utiliser LetsEncrypt avec un challenge HTTP. *(ex, CertBot)*
Sa configuration est assez rapide, voici le manifest permettant d’ajouter le ACME de LetsEncrypt.

```yml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: votre_email@ici.tld
    privateKeySecretRef:
      name: letsencrypt
    solvers:
    - selector: {}
      http01:
        ingress:
          class: istio
```

à retenir : 
- Il faut bien donner l’ingress utilisé, le challenge a besoin d’être fait sur le port 80 en http.
- l’email fourni servira à LetsEncrypt de vous notifier lorsque le certificat doit être renouvelé. 

:::tip Rate-Limit

Si vous échouez trop de challenges *(ou que vous générez trop de fois le même certificat)*. Il se peut que vous soyez bloqué par LetsEncrypt. 
Lorsque vous voulez juste tester les procédures, il est possible d’utiliser l’API **staging** *(donc sans rate-limits).*

Les certificats ne seront pas acceptés par votre navigateur, mais à des fins de tests : c’est l’idéal. 

Il vous suffit de remplacer l’url par `https://acme-staging-v02.api.letsencrypt.org/directory`
:::


Il vous est possible de vérifier que l’Issuer est bien présent via la commande : 
```bash
➜  kubectl describe issuers.cert-manager.io letsencrypt`. 

Status:
  Acme:
    Last Registered Email:  redacted
    Uri:                    https://acme-v02.api.letsencrypt.org/acme/acct/941914187
  Conditions:
    Last Transition Time:  2023-01-31T10:05:12Z
    Message:               The ACME account was registered with the ACME server
    Observed Generation:   1
    Reason:                ACMEAccountRegistered
    Status:                True
    Type:                  Ready
Events:                    <none>
```

#### ACME via challenge DNS 

Avant tout : votre fournisseur n’est pas toujours compatible avec cette méthode. J’utilise **CloudFlare** qui *(grâce à son API)* permet de créer des entrées dans votre domaine pour résoudre le challenge.
Cette méthode possède certains avantages comme le fait que nous n’avons pas à ouvrir un port pour résoudre le challenge. 

Pour utiliser l’API, il faut créer un token pour authentifier notre requête. Rendez-vous sur [cette page](https://dash.cloudflare.com/profile/api-tokens) pour créer votre jeton. Les permissions nécéssaires sont : 
- Zone.Zone READ
- Zone.DNS WRITE

![Génération Token](/img/cloudflare-zone.png)

Avec le token, créez ce secret:
```yml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token-secret
type: Opaque
stringData:
  api-token: aaaaaabbbbbbbcccccccdddddd
```

Et d’ajouter notre fournisseur Cloudflare. *(Celui-ci utilisera notre secret)*

```yml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: cloudflare
spec:
  acme:
    email: votre_email@ici.tld
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: cloudflare
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
```

### Créer un certificat

Fournisseur configuré, il est maintenant possible de créer notre certificat. Je vais générer le mien pour mon domaine `test.thebidouilleur.xyz`.

```yml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: test-thebidouilleur
spec:
  secretName: test-thebidouilleur-tls
  issuerRef:
    name: letsencrypt
  commonName: test.thebidouilleur.xyz
  dnsNames:
  - test.thebidouilleur.xyz
```

Vérifiez bien que le certificat est généré **et** disponible. 
```bash
➜  kubectl describe certificate test-thebidouilleur
Events:
  Type    Reason     Age    From                                       Message
  ----    ------     ----   ----                                       -------
  Normal  Issuing    7m9s   cert-manager-certificates-trigger          Issuing certificate as Secret was previously issued by Issuer.cert-manager.io/letsencrypt
  Normal  Reused     7m9s   cert-manager-certificates-key-manager      Reusing private key stored in existing Secret resource "test-thebidouilleur-tls"
  Normal  Requested  7m8s   cert-manager-certificates-request-manager  Created new CertificateRequest resource "test-thebidouilleur-j8x9j"
  Normal  Issuing    5m46s  cert-manager-certificates-issuing          The certificate has been successfully issued
```

Et que le secret soit bien créé : 
```bash
➜  kubectl get secret test-thebidouilleur-tls
NAME                      TYPE                DATA   AGE
test-thebidouilleur-tls   kubernetes.io/tls   2      169m
```

## Utiliser un certificat

Voici un exemple de yaml permettant de générer un Ingress en utilisant le secret.
```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test-thebidouilleur
  annotations:
    kubernetes.io/ingress.class: "istio"
spec:
  tls:
  - hosts:
    - test.thebidouilleur.xyz
    secretName: test-thebidouilleur-tls
  rules:
  - host: "test.thebidouilleur.xyz"
    http:
      paths:
        - pathType: Prefix
          path: "/"
          backend:
            service:
              name: srvc-thebidouilleur
              port:
                number: 80
```

Ou avec un objet IngressRoute si *(comme moi)* vous utilisez Traefik.

```yml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: test-thebidouilleur
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`test.thebidouilleur.xyz`)
      kind: Rule
      services:
        - name: srvc-thebidouilleur
          port: 80
  tls:
    secretName: test-thebidouilleur-tls
```
