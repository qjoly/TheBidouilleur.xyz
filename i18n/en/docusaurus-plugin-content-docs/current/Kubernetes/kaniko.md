---
slug: kaniko
title: Build docker image on a k3s cluster
---

To build an image on a Kubernetes cluster, I found the solution from [**Kaniko**](https://github.com/GoogleContainerTools/kaniko).
It allows you to launch a build from a yaml manifest just like you would have launched a pod or a deployment.
    
Here is the manifest to deploy to create this blog
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
