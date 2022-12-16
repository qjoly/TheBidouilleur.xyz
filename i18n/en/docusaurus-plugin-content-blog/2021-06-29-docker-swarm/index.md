---
slug: presentation-docker-swarm
title: Quick presentation of Docker Swarm
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: https://git.thoughtless.eu
  image_url: https://avatars.githubusercontent.com/u/82603435?v=4
tags: [docker, swarm, containers, cluster]
---
[ This article is from my old-blog, it will also be available in the "Documentation" section of the site ]

# Docker Swarm
## Introduction
The world of containerization has brought many things into system administration, and has updated the concept of DevOps. But one of the main things that containers (and especially Docker) bring us is **automation**.

And although Docker is already complete with service deployment, we can go a little further by automating container management! And to answer that: *Docker Inc.* offers a tool suitable for automatic instance orchestration: **Docker Swarm**.
## What is Docker Swarm?
As previously stated: Docker Swarm is an orchestration tool. With this tool, we can automatically manage our containers with rules favoring High-availability, and Scalability of your services.
We can therefore imagine two scenarios that are entirely compatible:
- Your site has a peak load and requires several containers: Docker Swarm manages replication and load balancing
- A machine hosting your Dockers is down: Docker Swarm replicates your containers on other machines.

So we'll see how to configure that, and take a little look at the state of play of the features on offer.
## Create Swarm Cluster
*For testing, I will use PWD (Play With Docker) to avoid mounting this on my infra*:)

So I have 4 machines under **Alpine** on which I will start a Swarm cluster.
![](https://i.imgur.com/7mD3suS.png)

The first step is to define a Manager, this will be the head of the cluster, as well as the access points to the different machines.
In our case, we will make it very simple, the manager will be **Node1**.

To start the Swarm on the manager, simply use the 'docker swarm init' command.
**But**, if your system has a network card count greater than 1 *(Fairly easy on a server)*, you must give the listening IP.
In my case, the LAN interface IP (where VMs communicate) is *192.168.0.8*.
So the command I'm going to run is
```bash
docker swarm init èèadvertise-addr 192.168.0.8
```

Docker says:

```
Swarm initialized: current node (cdbgbq3q4jp1e6espusj48qm3) is now a manager.
To add a worker to this swarm, run the following command:
docker swarm join —token SWMTKN-1-5od5zuquln0kgkxpjybvcd45pctp4cp0l12srhdqe178ly8s2m-046hmuczuim8oddmk08gjd1fp 192.168.0.8:2377
To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.`
```

In summary: The cluster is well started, and it gives us the exact command to join the cluster from other machines!
Since Node1 is the manager, I just need to run the docker swarm join command on Node2-4.

```bash
docker swarm join --token SWMTKN-1-5od5zuquln0kgkxpjybvcd45pctp4cp0l12srhdqe178ly8s2m-046hmuczuim8oddmk08gjd1fp 192.168.0.8:2377
```
Once completed, you can view the result on the *manager* with the command 'docker node ls'
![](https://i.imgur.com/2rgU3wm.png)

## Deploy a simple service
If you are a docker run user and you refuse docker-compose, you should know one thing: i don't like you.
As you are nice to me, here is a piece of information that won't help: the equivalent of 'docker run' in Swarm is 'docker service'. But we're not going to get into that in this article.

Instead, we will use the docker-composed equivalent, which is the docker stack.
So first of all, here's the .yml file
```yml
version: "3"
services:
  viz:
    image: dockersamples/visualizer
    volumes:
       - "/var/run/docker.sock:/var/run/docker.sock"
    ports:
       - "8080:8080"
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
```
Before you start it, you'll probably notice the **deploy** part that lets you give directions to Swarm. So we can add constraints to deploy this on the manager(s), ask the host to limit the use of resources, or manage replicas for load balancing.

This first container will be used to have a simple dashboard to see where the Dashboards are positioned, and avoid going to CLI only for this function.

We will deploy this compose with the following command:

```bash
docker stack deploy —compose-file docker-compose.yml swarm-visualize
```

Once the command is complete, you simply open the manager's web server at port 8080.
![](https://i.imgur.com/sVKKmtj.png)

So we now have a web panel to track container updates.


## Simplified management of replicas

When you access a container, you must go through the manager. But there is nothing to prevent being redirected to the 3-4 node via the manager. This is why it is possible to distribute the load balancing with a system similar to HAProxy, i.e. by redirecting users to a different container each time a page is loaded.

Here is a docker-compose automatically creating replicas:


```yml
version: '3.3'
services:
    hello-world:
        container_name: web-test
        ports:
            - '80:8000'
        image: crccheck/hello-world
        deploy:
          replicas: 4
```

And the result is surprising:
![](https://i.imgur.com/27a7V2i.png)

We can also adjust the number of replica.
By decreasing it:

`docker service scale hello-world_hello-world=2`

![](https://i.imgur.com/pf4Y1ih.png)

Or by increasing it:

`docker service scale hello-world_hello-world=20`

![](https://i.imgur.com/MW5uUOq.png)

## What about High Availability?

I focused this article on the functions of Swarm, and how to use them. And if I did not address this item first, it is because every container created in this post is managed in HA!
For example, I will forcibly stop the 10th replica of the "Hello world" container, which is on **Node1**. And this one will be directly revived,
![](https://i.imgur.com/7Ni9NNG.png)

> Okay, But docker could already automatically restart containers in case of problem, how is swarm different?

And to answer that, I'm going to stop the **node4**
![](https://i.imgur.com/ejkzT7a.png)

It is noted that the other nodes distribute automatically (and without any intervention) the stopped containers. And since we only access services through managers, they will only redirect to the containers that are started.
One of the servers can therefore catch fire, the service will always be redundant, balanced, and accessible.

## Conclusion

Docker-Swarm is a gateway to application clusters that are incredibly complex without a suitable tool. Swarm is easy to meet special needs without any technical expertise.
In a production environment, it is advisable to switch to Kubernetes or Nomad which are much more complete and powerful alternatives.

I encourage you to try this kind of technology that will govern our world of tomorrow!

Thanks for reading



