---
title: Kubectl on client computer
---

To manage your cluster, you can connect to a *"master" machine (with the **control-plane** role)* and manage your cluster via the **kubectl** utility. 
This is a practice that works but becomes very quickly limited when you want to tunnel to a pod. 

Example: 
  kubectl port-forward pod-vaultwarden 8080:80 # will tunnel using container port 80 to local port 8080

In this case, if the *kubectl port-forward* command is executed on a node of the cluster, it has very little interest *(since the nodes have direct access to the pods)*. 
That's why we need to run this command *on our local machine* and not on a node. 

## Installing Kubectl

You can find the official documentation [here](https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/).

### To install via the binary (all distributions)
I rather recommend to use the official repositories so that kubectl is fast and easy to update 

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

You can use the binary method to get an official version. Otherwise, you can get an updated version from the community repositories: 
``bash
pacman -S kubectl
```
::: note No sudo for kubectl !
It does not require any special permission, handle this command with your personal user.
:::    

## Récupérer le kube/config

By connecting via ssh to one of the master nodes, you will be able to view the following file **/root/.kube/config** which contains the accesses to administer the whole cluster.    
Here is an example:  
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

You can download it and place it here: */home/$USER/.kube/config*. 

But running any command with *kubectl*, you get the following error message: 
```
[thebidouilleur@bertha ~]$ kubectl get nodes
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```
This is because the file contains "127.0.0.1" by default. You will have to edit the ip to put the one of the master. 

Once edited, the command will work: 

```bash
[thebidouilleur@bertha ~]$ kubectl get nodes
NAME              STATUS   ROLES                  AGE   VERSION
node-0-tf         Ready    <none>                 32d   v1.22.3+k3s1
node-1-tf         Ready    <none>                 32d   v1.22.3+k3s1
node-2-tf         Ready    <none>                 32d   v1.22.3+k3s1
kubemaster-0-tf   Ready    control-plane,master   32d   v1.22.3+k3s1
```
