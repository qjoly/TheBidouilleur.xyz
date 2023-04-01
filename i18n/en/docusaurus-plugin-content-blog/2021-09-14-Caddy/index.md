---
slug: caddy
title: Too many loadbalancers
authors:
  name: TheBidouilleur
  title: Adorateur de trucs merdiques
  url: 'https://github.com/qjoly/'
  image_url: "https://avatars.githubusercontent.com/u/82603435?v=4"
tags: [selfhost, loadbalancing]
---
[ This article is from my old-blog, it will also be available in the "Documentation" section of the site ]

*Changelog (Jan 2022) - Today I replaced Caddy with Traefik, to be seen in a future article.*

In my short life as a computer scientist, I've always had only one public IP. The one on my OVH server where you are currently viewing the site. And knowing that I have many web services, it was quickly necessary for me to look for different solutions to install an efficient **Reverse Proxy** that would be used to redirect my users to the desired application according to the domain.

In my long quest (which is certainly not complete), I had the opportunity to test *many* solutions like Haproxy, Apache2, Nginx and now.. Caddy

Haproxy has been for me the easiest and most convenient to start, good documentation, incorporates many tools to check configuration, or add authentications. I was satisfied for a few years.

(I don't count on Apache2, which was handy to get started without installing a service dedicated to my need for redirection)

Then I used **aaPanel** (which you will find an article on this site) allowing me to have a whole web panel for my sites and my redirects! *I gave up knowing that it was a well-crafted system in which I had little freedom in terms of editing config*

Then my unnecessary need for a web interface led me to **NPM** (*Nginx Proxy Manager*) for more information [here](https://nginxproxymanager.com/). Which was very convenient for me knowing that it was in the form of a Docker container, and offering an interface managing the creation of redirection as well as the SSL, still at **let's encrypt**.
But every time the certificate expired, NPM required me to manually select one-by-one each certificate to be updated: and that was unthinkable when you knew how many domains i had created.

Today, my attention is focused on **Caddy** which, for the moment, corresponds exactly to what I want, and with incredible simplicity.

## Caddy

Caddy is, as you will have understood, a fairly versatile reverse proxy and very used in some Docker containers! It automatically generates your certificates (and configures redirects automatically) without any problems with Let's Encrypt. Caddy is quite lightweight and will avoid slow configurations, here is a dumb example:

```yml
thoughtless.eu {
reverse_proxy 192.168.5.125:8062
log {
output file /var/log/caddy/thoughtless.eu_access.log
}
}
```

This line will create a reverse-proxy redirection with the default configuration:

- Caddy updatera / will generate certificates whenever necessary
- It will automatically redirect requests to <http://> to <https://>
- It will write access logs in a file

In Apache2 / Haproxy, it would have taken a lot of lines.

But let's wait and see, Caddy is still very new for me, and I'm sure my next need will point me towards another solution such as Traefik for example!

Good luck in your long quest around reverse proxies
