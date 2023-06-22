---
title: NFS avec provisionnement dynamique
slug: nfs
description: Utiliser le provisionnement dynamique avec NFS sur Kubernetes
---

Après quelques rares mauvaises surprises avec le provisionnement dynamique de Longhorn, j'ai décidé de me tourner vers une seconde solution de provisionnement dynamique pour Kubernetes. J'ai choisi NFS, car c'est une solution simple et efficace *(et qu'il permet toujours de faire de la HA avec un cluster GlusterFS)*.

L'installation est assez simple et se fait en 2 étapes :

- Installation du Helm
- Création du storageClass

```bash
helm repo add csi-driver-nfs https://raw.githubusercontent.com/kubernetes-csi/csi-driver-nfs/master/charts\n
helm repo update
helm install csi-driver-nfs csi-driver-nfs/csi-driver-nfs \ 
    --namespace kube-system
```

Avant de passer à la suite, je vous invite à vérifier que le déploiement s'est bien passé. *(via k9s ou la commande suivante)*

```bash
kubectl wait pod --selector app.kubernetes.io/name=csi-driver-nfs --for condition=ready --namespace kube-system
```

Une fois le Helm déployé, il faut maintenant créer le storageClass *(qui aura pour but de gérer nos PersistentVolumeClaim)*. Celui-ci doit contenir les paramètres du serveur NFS ainsi que le chemin du partage. *(à adapter selon votre configuration, la syntaxe est la même pour un cluster GlusterFS)*

Voici un exemple de storageClass :
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-csi
provisioner: nfs.csi.k8s.io
parameters:
  server: 192.168.1.20
  share: /volume1/k3s/pvc
reclaimPolicy: Delete
volumeBindingMode: Immediate
mountOptions:
  - hard
  - nfsvers=4.1
```

On peut vérifier que la création du storageClass s'est bien passée avec la commande suivante :

```bash
kubectl get storageclasses.storage.k8s.io                
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
longhorn (default)     driver.longhorn.io      Delete          Immediate              true                   317d
local-path             rancher.io/local-path   Delete          WaitForFirstConsumer   false                  317d
nfs-csi                nfs.csi.k8s.io          Delete          Immediate              false                  3s
```

Et maintenant ? Il ne vous reste plus qu'à créer vos PersistentVolumeClaim.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  storageClassName: nfs-csi
```
