---
slug: kind
title: Kubernetes INside Docker
description: Avoir un environnement de développement est important dans tous les domaines. L'administration d'un Cluster Kubernetes n'échappe pas à la règle. Nous allons donc voir comment créer un cluster temporaire directement à partir de conteneurs Docker.
---

## Introduction

Lorsque l’on développe un chart, ou que l’on souhaite faire des tests sur Kubernetes *(ex : rbac)*, nous n’allons pas faire ces tests sur un environnement de production. Nous n’avons non-plus pas toujours de cluster dédié aux tests. 
Alors avec l’aide de **KIND** : nous allons pouvoir créer ce cluster de test, et sans devoir installer la moindre machine virtuelle. 

Comme son nom l’indique ce soft permet de créer un cluster à partir de **conteneurs Docker**. C’est d’ailleurs ce que j’utilise dans le CI présenté ici : [Créer un dépot Helm](/blog/Creer-son-registre-helm)

:::info
Ma configuration : 
- Docker  : 20.10.22
- Kind    : 0.17.0
- Linux   : Ubuntu amd64 (6.0.12)
:::


## Pré-requis si vous utilisez Docker en RootLess


:::caution Docker en Rootless
Vous pouvez passer cette partie si vous n’utilisez pas Docker en Rootless. 
:::

Vérifiez si les *cgroup v2* sont activés sur votre poste : 
```bash
➜ grep cgroup /proc/filesystems
nodev	cgroup
nodev	cgroup2
```

Si ce n’est pas le cas, vous devrez ajouter `GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=1"` à votre fichier `/etc/default/grub`, puis mettre à jour votre grub : `sudo update-grub`. 

Lancez ensuite un cluster kind : 
```bash
➜ kind create cluster      
ERROR: failed to create cluster: running kind with rootless provider requires setting systemd property "Delegate=yes", see https://kind.sigs.k8s.io/docs/user/rootless/
```
Si vous tombez sur la même erreur que moi, alors suivez les prochaines étapes. *(sinon on se retrouve un peu plus bas)*

```bash
sudo mkdir -p /etc/systemd/system/user@.service.d
sudo sh -c 'cat >/etc/systemd/system/user@.service.d/delegate.conf <<EOF
[Service]
Delegate=yes
EOF'
sudo sh -c 'cat >>/etc/modules-load.d/iptables.conf <<EOF
ip6_tables
ip6table_nat
ip_tables
iptable_nat
EOF'
sudo systemctl daemon-reload
```

Nous retentons après coup : 
```bash
➜ kind create cluster         
Creating cluster "kind" ...
 ✓ Ensuring node image (kindest/node:v1.25.3) 🖼 
 ✓ Preparing nodes 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
Set kubectl context to "kind-kind"
You can now use your cluster with:

kubectl cluster-info --context kind-kind

Have a nice day! 👋
➜ kubectl cluster-info --context kind-kind
Kubernetes control plane is running at https://127.0.0.1:45975
CoreDNS is running at https://127.0.0.1:45975/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Pour le supprimer : `kind delete cluster kind-kind`

:::caution Des limitations d’utiliser Docker en rootless
- Les montagnes *OverlayFS* ne peuvent être activé que si votre kernel est *>= 5.11*
- Impossible de mount les *block storages* *(iSCSI, Aws, Local Volume)*
- Impossible de mount un partage *NFS*
:::

:::tip Kubectx
Je vous conseille d’utiliser *Kubectx* pour changer votre context utilisé.
```
kubectx kind-kind
```
:::

Les conteneurs ‘nodes’ sont visibles directement avec la *cli* Docker. 
```bash
➜  docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED        STATUS          PORTS                      NAMES
288826f42d30   kindest/node:v1.25.3   "/usr/local/bin/entr…"   14 hours ago   Up 41 minutes   127.0.0.1:6443->6443/tcp   test-control-plane
98738fa957e4   kindest/node:v1.25.3   "/usr/local/bin/entr…"   14 hours ago   Up 41 minutes                              test-worker
```

## Configuration KIND

Si l’usage de KIND est assez simple, il est toujours possible de rajouter des petits paramètres pour l’adapter à nos besoins. 

Par exemple, il est possible de choisir le réseau des pods/services. Il suffit de créer un fichier yaml qui accueillera notre configuration :

```
# kind-config.yml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: reseau-en-192
networking:
  podSubnet: "192.168.244.0/24"
  serviceSubnet: "192.168.137.0/24"
```

Et nous créons ce cluster à partir de notre fichier `kind-config.yml`.
```bash
➜ kind create cluster --config=kind-config.yml
```
Et nous observons les IPs choisies par notre cluster: 
```bash
➜  kubectl get pods -A -o wide
NAMESPACE            NAME                                                  READY   STATUS    RESTARTS   AGE   IP              NODE                          NOMINATED NODE   READINESS GATES
kube-system          coredns-565d847f94-pmgqf                              1/1     Running   0          28s   192.168.244.2   reseau-en-192-control-plane   <none>           <none>
kube-system          coredns-565d847f94-rd5jh                              1/1     Running   0          28s   192.168.244.3   reseau-en-192-control-plane   <none>           <none>
kube-system          etcd-reseau-en-192-control-plane                      1/1     Running   0          42s   172.18.0.2      reseau-en-192-control-plane   <none>           <none>
kube-system          kindnet-4bhxr                                         1/1     Running   0          28s   172.18.0.2      reseau-en-192-control-plane   <none>           <none>
kube-system          kube-apiserver-reseau-en-192-control-plane            1/1     Running   0          42s   172.18.0.2      reseau-en-192-control-plane   <none>           <none>
kube-system          kube-controller-manager-reseau-en-192-control-plane   1/1     Running   0          42s   172.18.0.2      reseau-en-192-control-plane   <none>           <none>
kube-system          kube-proxy-g88wr                                      1/1     Running   0          28s   172.18.0.2      reseau-en-192-control-plane   <none>           <none>
kube-system          kube-scheduler-reseau-en-192-control-plane            1/1     Running   0          43s   172.18.0.2      reseau-en-192-control-plane   <none>           <none>
local-path-storage   local-path-provisioner-684f458cdd-bdnmt               1/1     Running   0          28s   192.168.244.4   reseau-en-192-control-plane   <none>           <none>
➜  kubectl get service -A -o wide
NAMESPACE     NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                  AGE   SELECTOR
default       kubernetes   ClusterIP   192.168.137.1    <none>        443/TCP                  75s   <none>
kube-system   kube-dns     ClusterIP   192.168.137.10   <none>        53/UDP,53/TCP,9153/TCP   74s   k8s-app=kube-dns
```
Nous avons bien nos pods sur le réseau 192.168.244.0/24, et les services sur 192.168.137.0/24. 

:::info Réseau en 172.18.0.0/16
Ce réseau est géré par Docker, Kind n’a pas la main-mise sur le choix des IPs. 
C’est un réseau Docker indépendant des autres conteneurs. 
Pour voir sa configuration : `docker network inspect kind`
:::

Si l’on souhaite avoir un second noeud, il suffit de mettre l’instruction : 
```yaml
[...]
nodes:
- role: control-plane
- role: worker
```
On peut également ajouter des labels aux nodes :

```yml
[...]
- role: worker
  labels:
    role: db-controler
```

Les possibilités sont vastes, la documentation de KIND est très claire et montre de nombreux cas d’utilisations. Voici le fichier que j’utilise au quotidien dans mes différents tests : 

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: mon-petit-cluster
networking:
  apiServerAddress: "127.0.0.1"
  apiServerPort: 6443
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 3000
    hostPort: 3000
    listenAddress: "127.0.0.1"
    protocol: TCP
- role: worker
  labels:
    tier: backend
```

