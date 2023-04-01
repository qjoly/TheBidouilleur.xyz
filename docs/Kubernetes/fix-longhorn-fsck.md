---
title: Lancer un Fsck sur Longhorn
slug: longhorn-fsck
---

En relançant un de mes pods, je suis tombé sur une sale erreur :

```none
 Events:                                                                                                                                                               │
│   Type     Reason                  Age                   From                     Message                                                                             │
│   ----     ------                  ----                  ----                     -------                                                                             │
│   Normal   Scheduled               9m46s                 default-scheduler        Successfully assigned basic-apps/ombi-dd746bc7c-kjw2x to node-0-tf                  │
│   Warning  FailedAttachVolume      9m47s                 attachdetach-controller  Multi-Attach error for volume "pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd" Volume is  │
│ already exclusively attached to one node and can't be attached to another                                                                                             │
│   Normal   SuccessfulAttachVolume  7m41s                 attachdetach-controller  AttachVolume.Attach succeeded for volume "pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd" │
│   Warning  FailedMount             99s (x10 over 5m54s)  kubelet                  MountVolume.MountDevice failed for volume "pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd │
│ " : rpc error: code = Internal desc = 'fsck' found errors on device /dev/longhorn/pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd but could not correct them: fsck from util │
│ -linux 2.36.2                                                                                                                                                         │
│ /dev/longhorn/pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd contains a file system with errors, check forced.                                                              │
│ /dev/longhorn/pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd: Resize inode not valid.                                                                                       │
│                                                                                                                                                                       │
│ /dev/longhorn/pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd: UNEXPECTED INCONSISTENCY; RUN fsck MANUALLY.                                                                  │
│            (i.e., without -a or -p options)                                                                                                                           │
│   Warning  FailedMount  53s (x4 over 7m44s)  kubelet  Unable to attach or mount volumes: unmounted volumes=[ombi-claim0], unattached volumes=[ombi-claim0 kube-api-ac │
│ ess-wb5vg[]: timed out waiting for the condition       
```

Ce volume *(géré par longhorn)* montre des traces de corruption et il ne semble pas réussir à lancer fsck.
Dans les étapes à faire :

- Se connecter sur le node hébergeant l'application
- Lancer la commande suivante :

```bash
fsck.ext4 -y /dev/longhorn/pvc-1a7be3fc-e477-454a-ae0e-c42e41ec53dd
```

- Puis tuer le pod pour que le deployment en créé un autre

```bash
kubectl delete pods <pod> --grace-period=0 --force
```

Une fois relancé, le pod démarre tranquillement.
