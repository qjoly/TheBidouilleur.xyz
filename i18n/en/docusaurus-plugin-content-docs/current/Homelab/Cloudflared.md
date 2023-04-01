---
slug: cloudflared
title: Exposing your containers without NAT with Cloudflared
---

Cloudflare is a company that is renowned for its high performance anti-ddos. This server is the name server for the domain name and will act as the intermediary between your site and the user.
Personally, I use it mainly to hide the public IP of my network and allow everyone to access my sites.

[Here you will find Cloudflare's official documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)

Cloudflare has just released a quite practical program: **cloudflared**.

## What is Cloudflared?

Cloudflare (based on Cloudflare Tunnel) allows you to make an application accessible on the Internet from a domain managed by cloudflare **without opening a port**!
Normally, this is what happens:

![Before cloudflared](/img/before-cloudflared.png)

Benefits:

- Easy to do
Inconveniences:
- My IP is visible to everyone
- Difficulties if changing IP

And this is how a site with a Cloudflared tunnel works.
![After cloudflared](/img/after-cloudflared.png)

Benefits:

- My IP is hidden
- Cache system (bandwidth saving)
Disadvantages:
- Cloudflare is not necessarily reliable
- Complex

Cloudflared is not necessarily **the right solution** for many contexts, (*and forbidden to use it in Prod or with sensitive data*) but in my case (*some simple containers, Blogs, gitea etc..), this is exactly what I need.

## How Do I Use Cloudflared?

Specifically, Cloudflared can be used as a classic Daemon. But since my infrastructure is based on Docker, I will continue to use this solution, and even for Cloudflared.

### Install Cloudflared (via Docker)

We'll create a folder that will host our Cloudflared configuration:

```bash
mkdir $HOME/cloudflared
```

We will use the Docker image **msnelling/cloudflared** which makes configuration much easier. ([Source-code here](https://github.com/msnelling/docker-cloudflared))
And we will execute the command in:

```bash
docker run -v ${HOME}/cloudflared:/root/.cloudflared msnelling/cloudflared cloudflared tunnel login
```

Result:
![first run of cloudflared](/img/cloudflared-first-run.png)
You must also specify the domain used for this tunnel.

Once logged in (via the URL provided), you will receive a confirmation message and you will have a **cert.pem** file in your *$HOME/cloudflared* folder. Cloudflared will use it to access your account.

Now we need to create the tunnel ( which can be used for multiple domains/applications )

```bash
docker run -v ${HOME}/cloudflared:/etc/cloudflared msnelling/cloudflared cloudflared tunnel create coffee_time
```

:::tip
Replace *coffee_time* with the name you want to give your tunnel.
:::

at the end of the command, you will have to have a file ending with **.json**, the name corresponds to the identifier of your tunnel, copy it.
Create the file **$HOME/cloudflared/config.yaml**

```yaml
tunnel: your-tunnel-id-here
ingress:
        - hostname: test.thoughtless.eu     # Change the domaine here
          service: http://nginx:80          # http://container_name:port
        - service: http_status:404
```

We are connected, our tunnel is created, we can now start cloudflared.

Create the **docker-compose.yml** file with the following content:

```yaml
version: '2'
services:
   cloudflared:
        image: msnelling/cloudflared
        container_name: cloudflared
        volumes:
            - ${HOME}/cloudflared:/etc/cloudflared
        command: /usr/local/bin/cloudflared tunnel --no-autoupdate run
        restart: always
        networks:
            - cloudflared
networks:
  cloudflared:
    name: cloudflared
```

```bash
docker-compose up -d
docker-compose logs
```

If no error is present ([example here](https://i.imgur.com/Ehyao5E.png)), you can directly use cloudflared for another container.

Because we have specified that the container named "*nginx*" will be accessible through the *test.thoughtless.eu* domain, we need to deploy a container with the same name in the same network as the *cloudflared* container

```yaml
version: '2'
services:
  nginx:
    image: nginx
    networks:
      - cloudflared
networks:
  cloudflared:
    external: true
    name: cloudflared
```

Start the with the command:

```bash
docker-compose up -d
```

The last step is to connect to our cloudflare panel to create a cname rule to our tunnel.
To do this, you will need to add a *CNAME* entry to *tunnel-id.cfargotunnel.com*.

Once validated, I can access the Nginx container via the domain entered in the **config.yaml**

![It Works](https://i.imgur.com/lrSkfrX.png)
