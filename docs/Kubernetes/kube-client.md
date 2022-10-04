---
title: Kubectl sur machine cliente
---

Pour administrer votre cluster, vous pouvez vous connecter à une machine *"maitre" (avec le role **control-plane**)* et gérer votre cluster via l'utilitaire **kubectl**. 
C'est une pratique qui fonctionne mais qui devient très vite limité lorsque l'on veut faire du tunneling vers un pods. 

Exemple: 
  kubectl port-forward pod-vaultwarden 8080:80 # va faire un tunnel en utilisant le port 80 du conteneur vers le port 8080 local

Dans ce cas, si la commande *kubectl port-forward* est éxecuté sur un noeud du cluster, ça n'a que très peu d'interet *(puisque les noeuds ont directement accès aux pods)*. 
C'est pour cela qu'on a besoin d'éxecuter cette commande *sur notre poste local* et non sur un noeud. 

## Installation de Kubectl

Vous trouverez la documentation officielle [ici](https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/).

### Pour installer via le binaire (toutes distributions)
Je recommande plutot de passer par les dépots officiels pour que kubectl soit rapide et facile à mettre à jour 

```bash
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
kubectl version --client
```

### Debian, Ubuntu

```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
```

### Arch Linux

Vous pouvez passer par la méthode via le binaire pour obtenir une version officielle. Sinon les dépots communautaires permettent d'obtenir une version à jour: 
```bash
pacman -S kubectl
```
### Nix

Kubectl est présent sur les dépots officiels de Nix, vous pouvez créer une session temporaire avec nix-shell: 
```bash
nix-shell -p kubectl
```
:::note Pas de sudo pour kubectl !
Il ne nécéssite aucune permission particulière, manier cette commande avec votre utilisateur personnel.
:::

## Récupérer le kube/config

En vous connectant via ssh sur un des noeuds masters, vous pourrez visionner le fichier suivant **/root/.kube/config** qui contient les accès pour administrer le cluster complet. 
En voici un exemple : 
```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUyTlRZd01EQTBOREF3SGhjTk1qSXdOakl6TVRZd056SXdXaGNOTXpJd05qSXdNVFl3TnpJdwpXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUyTlRZd01EQTBOREF3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFSc2pkd0dsTFRRN1NqejVua3ZneWVzWVpvYStiWWpIZTdCamFxYnMvMFAKSE5hdnc4Qm5nenFiRUozY2hsY3ZQWlp0aDRMcm9EckxvYi9TM3lCejZ6endvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVW5lNW5hem1WQ3NVbWg5VzFFUHdXCmh6bXNRczh3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUlnS0haK1FpUElQTnRoQkpoNEE1VFZqbGVYSEJPbmhhQTQKSXA5OXZONXdrcVlDSVFDREtKYUM3MmY2eFhScFFlSVNHcHIyb3BpR1lUMDg4VHBKQ1BSZXVwNm10Zz09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrVENDQVRlZ0F3SUJBZ0lJSmtpZy83ZGdSYjB3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOalUyTURBd05EUXdNQjRYRFRJeU1EWXlNekUyTURjeU1Gb1hEVEl6TURZeQpNekUyTURjeU1Gb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJMdDZGemFONVR6QTRjS1cKT29BNm1SMkVydGVqTS9Fb1JuNUFjWkFwTzY3bFdMOGVpZkZQajNvYWs3ZG5RKzRmQWlrT0plcnJReXFyN1IvdwpDVXZxM3NpalNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCVHY4elBiaURaYVg5UTJOU2pQb2F4eHJ6N0VBVEFLQmdncWhrak9QUVFEQWdOSUFEQkYKQWlBMlB4dkNpOHJyRkVVaFArdjVoc2I4Z0ttNU5wRTc0bnZzOE0yM0JITnY1QUloQUxpT0lYUTlqaUgzSHVnRwpsRUtCTUxybHVKNC9pTFFtYnlNK3NsbUVsaDhqCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJlRENDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdFkyeHAKWlc1MExXTmhRREUyTlRZd01EQTBOREF3SGhjTk1qSXdOakl6TVRZd056SXdXaGNOTXpJd05qSXdNVFl3TnpJdwpXakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwWlc1MExXTmhRREUyTlRZd01EQTBOREF3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFUYTBmTDU2RzNneUx2OTlBOWNjaEhsZEhRdWIzZm9pZlp1SVJLcC9nTDkKVmFudmJ2UkNmN0h0RDMrWlhTMit4dWxQbXdMS0U3TWY2SG5NNFJSOGtDR1RvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVTcvTXoyNGcyV2wvVU5qVW96NkdzCmNhOCt4QUV3Q2dZSUtvWkl6ajBFQXdJRFNRQXdSZ0loQU9rN0RBbG14d2hwS0dlL0ZDWDB3SkFKeFVoUmwwbVQKUXZSTVA5eUh3bFlFQWlFQTd4RnB0b3RQVit1U0lBMWljMGdaeUZabXU1eVA5UzlzUno1ZFR3ZWh6WXM9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    client-key-data: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUd6UUxqbWY2Q3NlZ3Bybk05ZXRTeGF0cnY4Q1RVZE5qNjdHSUpVM0o4YUhvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFdTNvWE5vM2xQTURod3BZNmdEcVpIWVN1MTZNejhTaEdma0J4a0NrN3J1Vll2eDZKOFUrUAplaHFUdDJkRDdoOENLUTRsNnV0REtxdnRIL0FKUytyZXlBPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=
```

Vous pourrez le télécharger et le placer ici : */home/$USER/.kube/config*. 

Mais en lançant une quelconque commande avec *kubectl*, on obtient le message d'erreur suivant: 
```
[thebidouilleur@bertha ~]$ kubectl get nodes
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```
C'est à cause du fichier qui contient "127.0.0.1" par défaut. Il faudra donc éditer l'ip pour mettre celle du master. 

Une fois éditer, la commande fonctionnera: 
```bash
[thebidouilleur@bertha ~]$ kubectl get nodes
NAME              STATUS   ROLES                  AGE   VERSION
node-0-tf         Ready    <none>                 32d   v1.22.3+k3s1
node-1-tf         Ready    <none>                 32d   v1.22.3+k3s1
node-2-tf         Ready    <none>                 32d   v1.22.3+k3s1
kubemaster-0-tf   Ready    control-plane,master   32d   v1.22.3+k3s1
```
