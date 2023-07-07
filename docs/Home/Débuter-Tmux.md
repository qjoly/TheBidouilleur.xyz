---
title: Débuter avec Tmux
slug: Tmux
tags: [Tmux, Vim]
description: Tmux est un utilitaire permettant de créer des sessions de terminal. Celui-ci est très utile pour lancer des commandes en fond et pouvoir fermer le terminal sans crainte que le processus ne soit stoppé, nous allons voir comment l'utiliser
---

Tmux est un multiplexeur de terminal, celui-ci permet de créer et contrôler des sessions. Il est souvent utilisé pour lancer une commande en fond et pouvoir fermer le terminal sans crainte que le processus ne soit stoppé.

Ainsi, dès lors que l'on démarre Tmux, celui-ci va initier une session stockée *(par défaut)* dans votre dossier `/tmp`. En fermant notre fenêtre, en rouvrant un terminal et en lançant `tmux attach`, on retrouve nos processus.

Il est également possible d'ouvrir plusieurs sessions Tmux en même temps, pour cela, il suffit de lancer `tmux new -s {nom de la session}`.

Dès lors que vous avez plusieurs sessions, il vous sera possible de lister toutes les sessions via `tmux ls` et vous rattacher à une session avec `tmux attach -t {numéro ou nom de la session}`.

## Ouvrir plusieurs fenêtres

Comme dit plus haut : une session ne représente pas un seul terminal, voyons alors plusieurs raccourcis pour gérer les fenêtres.

Par exemple, commençons par `ctrl+b`, suivi *(en relâchant les touches)* par `c` *(create).*

Nous obtenons ensuite une nouvelle fenêtre :

![Nouvelle fenêtre](/img/Tmux/tmux-nom.png)

- Il vous est possible de revenir à la précédente fenêtre via `ctrl+b` et `p` *(previous)*
- à l'inverse, il est possible d'aller à la prochaine fenêtre via `ctrl+b` et `n` *(next)*
- Si vous avez trop de fenêtres, vous pouvez aussi cibler un numéro en particuler via : `ctrl+b {numéro}`.

Notez que les noms des fenêtres affichent par défaut la dernière commande lancée et sont modifiables via `ctrl+b` et `,`.

![Nommage fenêtre](/img/Tmux/tmux-session.png)

Il est possible de quitter Tmux **sans tuer les processus** via `ctrl+b` et `d` *(deattach)*. Pour quitter Tmux et tuer les processus, il suffit de faire `ctrl+b` et `x` *(kill)*.

## Ouvrir plusieurs panneaux

Il est possible d'ouvrir plusieurs panneaux *(split)* dans une fenêtre, pour cela, il suffit de faire `ctrl+b` et `"` *(double quote)* qui va séparer la fenêtre de manière horizontale. Pour ouvrir une fenêtre en vertical, il suffit de faire `ctrl+b` et `%` *(percent)* qui va séparer la fenêtre de manière verticale.

En cumulant les deux, vous pouvez obtenir un résultat comme celui-ci :

![Multi-fenetres](/img/Tmux/multifenetrage.png)

Pour naviguer entre les panneaux, il suffit de faire `ctrl+b` et la flèche directionnelle correspondante.

Il est possible d'utiliser la souris pour naviguer entre les panneaux, pour cela, il faut faire `ctrl+b` et `:` puis `set -g mouse on`. Vous pouvez également créer un fichier `~/.tmux.conf` dans votre dossier utilisateur et y ajouter la ligne `set -g mouse on` pour que la souris soit activée par défaut.

## Cheatsheet

Je ne vais pas vous détailler toutes les commandes, mais voici un petit récapitulatif des commandes les plus utiles :

<details>
<summary>Raccourcis Tmux</summary>

### Commandes de base

- `tmux new` : Créer une nouvelle session Tmux
- `tmux attach -t <session_name>` : Se connecter à une session Tmux existante
- `tmux switch -t <session_name>` : Changer de session Tmux
- `tmux list-sessions` : Afficher la liste des sessions Tmux
- `tmux detach` (ou `Ctrl-b d`) : Se détacher d'une session Tmux en cours
- `tmux kill-session -t <session_name>` : Fermer une session Tmux

## Commandes de préfixe

- `Ctrl-b` : Touche de préfixe par défaut (peut être modifiée)
- `Ctrl-b c` : Créer une nouvelle fenêtre
- `Ctrl-b n` : Aller à la fenêtre suivante
- `Ctrl-b p` : Aller à la fenêtre précédente
- `Ctrl-b l` : Basculer vers la dernière fenêtre utilisée
- `Ctrl-b 0-9` : Aller à la fenêtre numérotée
- `Ctrl-b &` : Fermer la fenêtre actuelle
- `Ctrl-b ,` : Renommer la fenêtre actuelle

## Commandes de division de fenêtre

- `Ctrl-b %` : Diviser la fenêtre verticalement
- `Ctrl-b "` : Diviser la fenêtre horizontalement
- `Ctrl-b flèche directionnelle` : Naviguer entre les panneaux
- `Ctrl-b espace` : Basculer le layout du panneau
- `Ctrl-b z` : Mettre le panneau en plein écran
- `Ctrl-b {` : Déplacer le panneau actif vers la gauche
- `Ctrl-b }` : Déplacer le panneau actif vers la droite
- `Ctrl-b Ctrl-flèche directionnelle` : Redimensionner le panneau actif

## Autres commandes utiles

- `Ctrl-b ?` : Afficher la liste des commandes disponibles
- `Ctrl-b :` : Accéder au mode de commande
- `Ctrl-b d` : Se détacher de la session en cours
- `Ctrl-b t` : Afficher l'horloge
- `Ctrl-b [` : Activer le mode de copie (navigation avec les touches fléchées, espace pour commencer la sélection, entrée pour copier)
- `Ctrl-b ]` : Coller le texte copié précédemment
- `Ctrl-b !` : Déplacer la fenêtre actuelle dans une nouvelle session
- `Ctrl-b $` : Renommer la session en cours

</details>

## Personnalisation

Il est possible de personnaliser Tmux via un fichier de configuration, celui-ci se nomme `.tmux.conf` et se trouve dans votre dossier utilisateur.

Il est, par exemple, possible de modifier le préfixe de Tmux via la ligne suivante :

```bash
set-option -g prefix C-Space
```

Ainsi, on remplace `ctrl+b` par `ctrl+espace`.

Pour recharger la configuration, il suffit de lancer `tmux source ~/.tmux.conf` directement dans Tmux.

Vous pouvez alors ajouter des raccourcis personnalisés, par exemple :

```bash
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D
```

Qui permet de naviguer entre les panneaux via `alt+[flèche directionnelle]`.

## Aller plus loin avec les plugins

Il existe de nombreux plugins pour Tmux que l'on peut trouver sur [GitHub](https://github.com/tmux-plugins/list).

Par exemple, il est possible d'installer un plugin Dracula pour rendre l'interface de Tmux un peu plus jolie :

![Dracula](/img/Tmux/theme-dracula.png)

Pour cela, il vous faudra installer [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm) :

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

Placer ensuite les lignes suivantes dans votre fichier `.tmux.conf` :

```bash
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible' # plugin qui ajoute des options par défaut, optionnel
set -g @plugin 'dracula/tmux' # plugin Dracula
run '~/.tmux/plugins/tpm/tpm' # cette ligne doit être la dernière du fichier
```

Rafraichissez ensuite la configuration de Tmux via `tmux source ~/.tmux.conf` et installez le plugin Dracula via `ctrl-b I` *(C'est un i majuscule)*.

```bash Réponse
Already installed "tpm"                                                                                                                                                [0/0]
Already installed "tmux"                   

TMUX environment reloaded.                 

Done, press ENTER to continue. 
```

Et après le redémarrage de Tmux, vous devriez avoir un résultat comme celui-ci :

![Dracula](/img/Tmux/dracula-default.png)

Bon, la météo, et voir la batterie de mon ordinateur, c'est sympa, mais ce ne sont pas des informations que j'ai besoin de voir en permanence. Je propose alors ces paramètres qui affichent mon usage CPU, ma RAM utilisée, ma carte réseau principale, ma latence et mon contexte Kubernetes :

```bash
set -g @plugin 'dracula/tmux'
# available plugins: battery, cpu-usage, git, gpu-usage, ram-usage, network, network-bandwidth, network-ping, attached-clients, network-vpn, weather, time, spotify-tui, kubernetes-context
set -g @dracula-plugins "cpu-usage ram-usage network network-ping ram-usage, network-bandwidth, kubernetes-context"
set -g @dracula-show-empty-plugins false
## available colors: white, gray, dark_gray, light_purple, dark_purple, cyan, green, orange, red, pink, yellow
set -g @dracula-cpu-usage-colors "red dark_gray"
set -g @dracula-ram-usage-colors "dark_purple dark_gray"
set -g @dracula-network-colors "light_purple dark_gray"
set -g @dracula-network-ping-colors "yellow dark_gray"
set -g @dracula-kubernetes-context-colors "cyan dark_gray"
```

Résultat :

![Dracula perso](/img/Tmux/dracula-perso.png)

## Conclusion

Tmux est un outil très puissant qui permet de gérer des sessions et des panneaux, et qui peut être personnalisé à l'infini. Il est très utile pour les personnes qui travaillent sur des serveurs distants, mais aussi pour les développeurs qui ont besoin de lancer plusieurs commandes en même temps.

Personnellement, je l'utilise tous les jours, et Tmux est l'un des premiers outils que j'installe sur mes machines.
