---
title: Using a Private Registry
---

As soon as you play with containers and start creating your own, you need to have your own registry. *(For simplicity, optimization, efficiency)*

## Creation of the secret

### In CLI

Here is the `kubectl` command to create a secret containing the information required to connect to a private registry.

```bash
NAMESPACE=thebidouilleur
kubectl --namespace $NAMESPACE create secret docker-registry regcred --docker-server=https://registry.thebidouilleur.xyz --docker-username=admin --docker-password=admin --docker-email=kube@kube
```

### In YAML

We will do this example with the following credentials: `user:pass`
This combination will need to be converted to **base64**. I go through my Linux terminal to perform this conversion.

```bash
echo -n "user:pass" | base64#dXNlcjpwYXNz
```

We will then create our configuration file in **JSON** *format (which is the format accepted by docker for the file*~/.docker/config*

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

*Remember to replace the registry url*.

We will have to put on **one line** json and encode it in **base64** to create our final manifest.

```bash
echo -n '{"auths":{"registry.thebidouilleur.xyz":{"auth":"dXNlcjpwYXNz"}}}' | base64 # eyJhdXRocyI6eyJyZWdpc3RyeS50aGViaWRvdWlsbGV1ci54eXoiOnsiYXV0aCI6ImRYTmxjanB3WVhOeiJ9fX0=
```

We can finally create our yaml that we will give to kubectl.

```yaml
apiVersion: v1
date:
 .dockerconfigjson: eyJhdXRocyI6eyJyZWdpc3RyeS50aGViaWRvdWlsbGV1ci54eXoiOnsiYXV0aCI6ImRYTmxjanB3WVhOeiJ9fX0=
kind: Secret
metadata:
 name: regred
 namespace: thebidouilleur
type: kubernetes.io/dockerconfigjson
```

Once ingested by our cluster. We will be able to use images from a private registry.
Example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-thebidouilleur
  labels:
    release: 4.3.4
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
        approx:
        - name: RUN_MODE
          value: "production"
        ports:
        - containerPort: 80
        livenessProbe:
          tcpSocket:
            host: 127.0.0.1
            shipping: 80
          initialDelaySeconds: 180
          periodSeconds: 3
      imagePullSecrets:
      - name: regred
```
