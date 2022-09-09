---
slug: kaniko
title: Build une image docker sur un cluster kubernetes
---

Pour build une image sur un cluster Kubernetes, j'ai trouvé la solution de [**Kaniko**](https://github.com/GoogleContainerTools/kaniko). 
Il permet de lancer un build à partir d'un manifest yaml tout comme on aurait lancé un pod ou un déploiement. 

Voici le manifest à déployer pour créer ce blog
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kaniko-demo
spec:
  containers:
  - name: kaniko-demo
    image: gcr.io/kaniko-project/executor:latest
    args: ["--context=git://git.thoughtless.eu/Cinabre/TheBidouilleur-kubernetes",
            "--destination=thoughtlesshub/thebidouilleur:kaniko",
            "--dockerfile=Dockerfile"]
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
  restartPolicy: Never
  volumes:
    - name: kaniko-secret
      secret:
        secretName: reg-credentials
        items:
          - key: .dockerconfigjson
            path: config.json
```


secret: 
```bash
kubectl create secret docker-registry reg-credentials --docker-server=https://index.docker.io/v1/ --docker-username=xx --docker-password=xxxx --docker-email=xx
```
