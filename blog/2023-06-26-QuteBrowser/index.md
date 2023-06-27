---
title: QuteBrowser - Un navigateur basé sur Vim
slug: QuteBrowser
---

Il est tard, je suis fatigué, et dans ces moments, je n'ai qu'une envie : apprendre une bricole de plus qui me servira peut-être un jour *(ou pas)*.

Sur les communautés de Tiling *(i3, tmux, sway …)*, on entend souvent parler de QuteBrowser. C'est un navigateur basé sur Vim qui permet de naviguer sur le web sans utiliser la souris. Il est très léger et très rapide.

Je n'ai eu qu'une brève démo de ce navigateur, mais il m'a semblé très intéressant. Je me suis donc dit que j'allais l'installer et le tester.

Un paquet NixOS existe pour QuteBrowser, je l'installe donc et …

```bash
➜  ~ nix-shell -p qutebrowser

[nix-shell:~]$ qutebrowser 
Gtk-Message: 16:00:29.759: Failed to load module "canberra-gtk-module"
Gtk-Message: 16:00:29.760: Failed to load module "canberra-gtk-module"
16:00:29 WARNING: qglx_findConfig: Failed to finding matching FBConfig for QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
16:00:29 WARNING: qglx_findConfig: Failed to finding matching FBConfig for QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
16:00:29 CRITICAL: Could not initialize GLX
Fatal Python error: Aborted

Current thread 0x00007f46eaa85740 (most recent call first):
  File "/nix/store/3zyp407rmghww5m9afxc0nirky1wf6fj-qutebrowser-2.5.4/lib/python3.10/site-packages/qutebrowser/app.py", line 558 in __init__
  File "/nix/store/3zyp407rmghww5m9afxc0nirky1wf6fj-qutebrowser-2.5.4/lib/python3.10/site-packages/qutebrowser/app.py", line 95 in run
  File "/nix/store/3zyp407rmghww5m9afxc0nirky1wf6fj-qutebrowser-2.5.4/lib/python3.10/site-packages/qutebrowser/qutebrowser.py", line 245 in main
  File "/nix/store/3zyp407rmghww5m9afxc0nirky1wf6fj-qutebrowser-2.5.4/bin/.qutebrowser-wrapped", line 34 in <module>

Extension modules: PyQt5.QtCore, PyQt5.QtGui, PyQt5.QtWidgets, markupsafe._speedups, yaml._yaml, PyQt5.QtNetwork, PyQt5.QtQml, PyQt5.QtSql, PyQt5.QtOpenGL, PyQt5.QtDBus, PyQt5.QtPrintSupport, PyQt5.QtWebEngineCore, PyQt5.QtWebChannel, PyQt5.QtWebEngineWidgets, PyQt5.QtWebEngine (total: 15)
Aborted (core dumped)
```

… c'est le drame ! Je vais ouvrir une issue sur le dépôt NixOS pour signaler le problème. Je crois que je vais devoir l'installer autrement.

Par chance, un paquet QuteBrowser existe sur Debian, Fedora et Arch. *(Des versions pré-compilées pour Windows et Mac sont disponibles sur les Github Releases)*

## Installation

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Debian" label="Debian" default>

    apt install qutebrowser

  </TabItem>
  <TabItem value="Fedora" label="Fedora">

    dnf install qutebrowser

  </TabItem>
  <TabItem value="Nix" label="Nix">

    nix-env -i qutebrowser -v

  </TabItem>
</Tabs>
```

## Découvrir QuteBrowser

### Navigation classique

Quand on lance QuteBrowser pour la première fois, on arrive sur DuckDuckGo. Vous pouvez très bien utiliser la souris pour naviguer, mais ce n'est pas le but.

Pour sélectionner un lien, on utilise la touche `f` qui va afficher des lettres sur les liens. On tape la lettre correspondante pour sélectionner le lien.

![Moteur de recherche](/img/QuteBrowser/duckduckgo.png)

En appuyant sur `g`, je me positionne alors sur le champ de recherche. Je peux alors taper ma recherche et appuyer sur `Entrée` pour lancer la recherche.

Dès lors que notre curseur est sur un champ `<input>` nous passons en mode `INSERT` et nous pouvons taper du texte.

Pour revenir sur la page précédente, on utilise la touche `H` et pour retourner sur la page suivante, on utilise la touche `L`.

### Onglets ?

Si vous n'avez pas vu ma présentation de Vim *([Disponible ici](https://vim.avec.une-tasse-de.cafe))*, vous ne savez peut-être pas que Vim est capable de créer des onglets.

Pour créer un onglet, on utilise la touche `O` qui va nous préremplir la barre d'adresse avec `:open -t`. On peut alors taper l'adresse du site ou un mot clé pour lancer une recherche.

![Nouvel onglet](/img/QuteBrowser/newtab.png)

Une fois que vous avez plusieurs onglets, vous pouvez naviguer entre eux avec les touches `J` et `K`. *(Pas comme dans Vim)*

### Bookmarks

Comme n'importe quel navigateur, QuteBrowser permet de sauvegarder des favoris. Pour ajouter un favori, on utilise la touche `B` qui va nous préremplir la barre d'adresse avec `:bookmark-add`. On peut alors taper l'adresse du site ou un mot clé pour lancer une recherche.

Il est possible d'ajouter le site sur lequel on se trouve en utilisant la touche `m` qui va ouvrir un menu pour choisir le nom du favori. Il est possible de l'ajouter rapidement en utilisant `M` qui va prendre le titre comme nom du favori.

Avec la commande `:bookmark-del`, on peut supprimer un favori *(les tabulations sont possibles pour compléter le nom du favori)*. Et nous pouvons ouvrir la liste de nos favoris via la commande `:bookmark-list` ou `Sq`

## Astuce de mi-temps

En reprenant l'exemple de la commande `sQ`, QuteBrowser peut vous proposer les raccourcis possibles en ne tapant que `S`

![Complétion Bookmarks](/img/QuteBrowser/completions.png)

Pratique quand on ne se souvient que du début de la combinaison.

Il est aussi possible de retrouver les combinaisons de touches de chaque commande depuis la console.

![Liste des touches](/img/QuteBrowser/liste-touches.png)

## Configuration

La partie configuration de QuteBrowser est assez complexe. Avant la version 1.0.0 *(Nous sommes à la 2.5.0)*, QuteBrowser disposait d'un fichier d'un ficher `qutebrowser.conf` qui permettait de configurer le navigateur. Depuis la version 1.0.0, QuteBrowser utilise un fichier `config.py` qui est un fichier Python.

On aime ou on aime pas, mais c'est comme ça. Je vous invite à lire la documentation officielle pour en savoir plus.

Dans ce fichier de configuration, nous avons un objet `config` dans la variable `c`. Cet objet contient tous les paramètres de configuration de QuteBrowser. Pour les modifier, il suffit de faire `c.nom_du_parametre = valeur`.

Par exemple, pour changer la page d'accueil, il suffit de faire `c.url.start_pages = "https://www.ecosia.org/?c=fr"`.

:::note Charger la configuration GUI

En plus du fichier `config.py`, il est possible de définir quelques paramètres *(avec moins de liberté)* sur l'interface graphique *(accessibles depuis l'url `qute://settings/`)*

Il est tout à fait possible de cumuler les deux méthodes de configuration.

Pour cela, il vous faut ajouter la ligne suivante dans votre fichier `config.py` pour charger la configuration GUI.

```python
config.load_autoconfig()
```

:::

## Moteur de recherche

QuteBrowser utilise DuckDuckGo en tant que moteur de recherche par défaut. Comme pour Firefox, il est possible d'utiliser plusieurs moteurs de recherche en fonction d'un préfixe.

```python
c.url.searchengines = {
    'DEFAULT':  'https://www.ecosia.org/search?method=index&q={}',
    '!a':       'https://www.amazon.fr/s?k={}',
    '!d':       'https://duckduckgo.com/?ia=web&q={}',
    '!gh':      'https://github.com/search?o=desc&q={}&s=stars',
    '!gist':    'https://gist.github.com/search?q={}',
    '!gn':      'https://news.google.com/search?q={}',
    '!m':       'https://www.google.com/maps/search/{}',
    '!r':       'https://www.reddit.com/search?q={}',
    '!tw':      'https://twitter.com/search?q={}',
    '!w':       'https://fr.wikipedia.org/wiki/{}',
    '!yt':      'https://www.youtube.com/results?search_query={}'
}
```

Ainsi, en tapant `:open -t !gh NixPkgs`, je vais lancer une recherche sur GitHub avec le mot `NixPkgs`.

## Une réelle alternative ?

Et c'est là le point le plus important. QuteBrowser est-il une réelle alternative à Firefox ou Chrome ?

La réponse est **non**, de nombreux sites auront un comportement étrange ou ne fonctionneront pas du tout. QuteBrowser dispose de toutes les fonctionnalités nécessaires à une navigation quotidienne, mais il ne faut pas s'attendre à pouvoir utiliser QuteBrowser pour tout.

Une alternative à QuteBrowser est [Tridactyl](https://addons.mozilla.org/fr/firefox/addon/tridactyl-vim/), une extension pour Firefox qui permet de naviguer avec Vim. C'est une extension très complète et très bien faite couplant Firefox (et sa compatibilité) avec Vim.

Les raccourcis sont légèrement différents, mais on retrouve la plupart des fonctionnalités de QuteBrowser.

![Tridactyl](https://raw.githubusercontent.com/tridactyl/tridactyl/master/doc/AMO_screenshots/trishowcase.gif)

## Conclusion

Quand on a l'habitude de naviguer avec Vim, QuteBrowser est un navigateur très agréable à utiliser. Il est très léger et très rapide. Il est aussi très facile à configurer. La documentation est très complète et hyper bien faite.
Je n'ai pas non-plus parlé des userscripts qui permettent d'ajouter des fonctionnalités à QuteBrowser *(comme des extensions)* et qui sont vraiment simples à créer et à installer.

Étant constamment sur Firefox *(Perso et travail)*, je ne peux pas utiliser QuteBrowser au quotidien. Tridactyl est alors la meilleure alternative et celle que je vais utiliser pour le moment.
