---
slug: cluster-maj
title: Keep your clusters up-to-date
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: "https://github.com/qjoly/"
  image_url: "https://avatars.githubusercontent.com/u/82603435?v=4"
tags: [docker, swarm, kubernetes]
---

Since the DevOps movement started (or rather *Platform engineering*), the topic of high availability has been brought to the forefront. And one of the most versatile solutions to achieve high availability is to create application clusters. (and so: containers)

So I've been running a Swarm cluster for a few years and I recently switched to Kubernetes *(k3s to be precise)*. And by having clusters holding several hundreds of containers, we forget about maintenance and update.

And in this article, we will talk about updates.

## Out-of-cluster container upgrade solutions

### WatchTower

I think the best known solution is [Watchtower](https://containrrr.dev/watchtower/)

Watchtower is easy to use and is based (like many others) on **labels**. A label allows to define some parameters and to activate (or deactivate) the monitoring of updates.

:::note Updating is not always good...
Be careful not to automatically update sensitive programs! We can't check what an update and if they won't break something.
It's up to you to choose which applications to monitor, and to trigger an update or not.
:::

WatchTower will notify you in several ways:

- email
- slack
- msteams
- gotify
- shoutrrr

And among these methods, you do not have only proprietary solutions, free to you to host a shoutrrr, a gotify or to use your smtp so that this information does not leave your IS! *(I am very critical of the use of msteams, slack, discord to receive notifications)

WatchTower will scan for updates on a regular basis *(configurable)*.

### container-updater (from [@PAPAMICA](https://github.com/PAPAMICA))

The most provided/complex solution is not always the best. Papamica has set up a bash script to meet his specific needs *(which many other people must have)*: an update system notifying him through Discord and Zabbix.

This one is also based on labels and also takes care of the case where you want to update by docker-compose. (*instead of doing a docker pull, docker restart like Watchtower*)

```yaml
labels:
    - "autoupdate=true"
    - "autoupdate.docker-compose=/link/to/docker-compose.yml"
```

Even if I don't use it, I had a time when I was using Zabbix and I needed to be notified on my Zabbix. *(which notified me by Mail/Gotify)*

Papamica states that he plans to add private registry support *(for now only github registry or dockerhub)* as well as other notification methods.

## Solutions for Swarm

Swarm is probably the container orchestrator I enjoyed the most: it's ****simple****! You learn fast, you discover fast and you get quick results.
But I've already written about Swarm in [another article](/blog/presentation-docker-swarm/)...

### Sheperd

What I like in Papamica's program (and that goes with Sheperd) is that we keep bash as the central language. A language that we all know in the main thanks to Linux, and that we can read and modify if we take the time.

Shepherd's code is only [~200 lines](https://github.com/djmaze/shepherd/blob/master/shepherd) and works fine like that.

```yaml
version: "3"
services:
  ...
  shepherd:
    build: .
    image: mazzolino/shepherd
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    deploy:
      placement:
        constraints:
        - node.role == manager
```

This one will accept several private registers, which gives a nice advantage compared to the other solutions presented.
Example:

```yaml
    deploy:
        labels:
            - shepherd.enable=true
            - shepherd.auth.config=blog
```

Shepherd does not include a *(default)* notification system. That's why its creator decided to offer a [Apprise sidecar as an alternative](https://github.com/djmaze/shepherd/blob/master/docker-compose.apprise.yml). Which can redirect to many things like Telegram, SMS, Gotify, Mail, Slack, msteams etc....

I think this is the simplest and most versatile solution. I hope it will be found in other contexts. I hope it will be found in other contexts *(but I don't go into too much detail on the subject, I'd like to write an article about it)*.

I used Shepherd for a long time and I had no problems.

## Solutions for Kubernetes

For Kubernetes, we start to lose in simplicity. Especially since with the `imagePullPolicy: Always` option, you just have to restart a pod to get the last image with the same *tag*.
For a long time, I used ArgoCD to update my configurations and re-deploy my images at each update on Git.

But ArgoCD is only used to **update the configuration** and not the image. The methodology is incorrect and it is necessary to find a suitable tool for that.

### Keel.sh

Keel is a tool that meets the same need: Update pod images. But it incorporates several features not found elsewhere.

![Keel](https://keel.sh/img/keel_high_level.png)

If you want to keep the same operation as the alternatives *(i.e. regularly check for updates)*, it is possible:

```yaml
metadata:
  annotations:
    keel.sh/policy: force
    keel.sh/trigger: poll
    keel.sh/pollSchedule: "@every 3m"
```

But where Keel excels is that it offers **triggers** and **approvals**.

A trigger is an event that will trigger the update of Keel. We can imagine a webhook coming from Github, Dockerhub, Gitea which will trigger the update of the server. *(So we avoid a regular crontab and we save resources, traffic and time)
As the use of webhook has become widespread in CICD systems, it can be coupled to many use cases.

The approvals are the little gem that was missing from the other tools. Indeed, I specified that *updating images is dangerous and you should not target sensitive applications in automatic updates*. And it's just in response to that that Keel developed the *approvals*.

![Approval system of keel](https://keel.sh/img/docs/approvals.png)

The idea is to give permission to Keel to update the pod. We can choose the moment and check manually.

I think it's a pity that we have Slack or MSTeams imposed for the approvals, it's then a feature that I won't use.

:::note A UI
So for now, I use Keel without its web interface, it may bring new features, but I would like to avoid an umpteenth interface to manage.
:::

## Conclusion

Updating a container is not that easy when you are looking for automation and security. If today, I find that Keel corresponds to my needs, I have the impression that the tools are similar without offering real innovations. *(I'm thinking of tackling the canary idea one day)*
I hope to discover new solutions soon, hoping that they will better fit my needs.
