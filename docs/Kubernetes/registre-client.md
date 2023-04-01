---
title: Utilisation d'un registre privé
---

Dès qu'on s'amuse avec des conteneurs et qu'on commence à créer les siens, il est nécessaire d'avoir son propre registre. *(Par simplicité, optimisation, efficacité)*

## Création du secret

### En CLI

Voici la commande `kubectl` permettant de créer un secret contenant les informations requises pour se connecter à un registre privé.

```bash
NAMESPACE=thebidouilleur
kubectl --namespace $NAMESPACE create secret docker-registry regcred --docker-server=https://registry.thebidouilleur.xyz --docker-username=admin --docker-password=admin --docker-email=kube@kube
```

### En YAML

Nous allons faire cet exemple avec les identifiants suivants: `user:pass`
Il faudra convertir cette combinaison en **base64**. Je passe par mon terminal Linux pour réaliser cette conversion.

```bash
echo -n "user:pass" | base64 # dXNlcjpwYXNz
```

On va ensuite créer notre fichier de configuration en format **JSON** *(qui est le format accepté par docker pour le fichier `~/.docker/config`)*

```json
{
"auths": 
{
 "registry.thebidouilleur.xyz":
 { 
  "auth": "dXNlcjpwYXNz" }
 }
}
```

*Pensez à remplacer l'url du registre*.
Il faudra mettre notre JSON sur **une ligne** et l'encoder en **base64** pour créer notre manifest final.

```bash
echo -n '{"auths":{"registry.thebidouilleur.xyz":{"auth":"dXNlcjpwYXNz"}}}' | base64 # eyJhdXRocyI6eyJyZWdpc3RyeS50aGViaWRvdWlsbGV1ci54eXoiOnsiYXV0aCI6ImRYTmxjanB3WVhOeiJ9fX0=
```

On peut enfin créer notre yaml qu'on donnera à kubectl.

```yaml
apiVersion: v1 
data: 
 .dockerconfigjson: eyJhdXRocyI6eyJyZWdpc3RyeS50aGViaWRvdWlsbGV1ci54eXoiOnsiYXV0aCI6ImRYTmxjanB3WVhOeiJ9fX0=
kind: Secret 
metadata: 
 name: regcred 
 namespace: thebidouilleur 
type: kubernetes.io/dockerconfigjson
```

Une fois ingéré par notre cluster. Nous allons pouvoir utiliser des images provenant d'un registre privé.
Exemple:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-thebidouilleur
  labels: 
    version: 4.3.4
  annotations:
    argocd.argoproj.io/hook: PostSync
    namespace: thebidouilleur
spec:
  selector:
    matchLabels:
      app: deploy-thebidouilleur
  replicas: 1 
  template:
    metadata:
      labels:
        app: deploy-thebidouilleur 
    spec:
      containers:
      - name: thebidouilleur
        image: registry.thebidouilleur.xyz/thebidouilleur:latest
        imagePullPolicy: Always
        env:
        - name: RUN_MODE
          value: "production"
        ports:
        - containerPort: 80
        livenessProbe:
          tcpSocket:
            host: 127.0.0.1
            port: 80
          initialDelaySeconds: 180
          periodSeconds: 3
      imagePullSecrets:
      - name: regcred
```
