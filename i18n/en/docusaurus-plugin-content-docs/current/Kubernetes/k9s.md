After getting my hands on kubectl *(the utility for managing a kubernetes cluster)*, I started to find its use slow, boring and unwieldy.
Do a `kubectl get pods -n monitoring` here, a `kubectl logs -n thebidouilleur docusaurus-x38jsu8` there. It takes 2 minutes, but we spend more time typing commands than analyzing the result.
This is why I inquired about an interface allowing me to perform the same recurring tasks in a few actions.

And that's how I came across **K9S**.

## K9S

K9S is a utility that works exactly the same way as *kubectl*. It will send HTTPS requests to cluster masters and display the result.

> Small demo from the official site
<a href="https://asciinema.org/a/305944" target="_blank"><img src="https://asciinema.org/a/305944.svg" /></a>

I already knew of the existence of **[Lens](https://k8slens.dev/)** which I find cumbersome and complex to use and faced with that, K9S ticks all the boxes of my expectations.

K9S allows to:
- View pod logs
- Open a port to a pod
- See in Yaml the manifest of a pod/deployment
- Edit configmaps
- Make coffee

k9s works with shortcuts similar to **VIM**. The binary weighs only a few megabytes. And no dependencies are required *(apart from owning the kubeconfig)*.