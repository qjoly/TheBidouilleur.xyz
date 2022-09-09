Après m'être fait la main sur kubectl *(l'utilitaire permettant de gérer un cluster kubernetes)*, j'ai commencé à trouver son utilisation lente, ennuyante et peu ergonomique. 
Faire un `kubectl get pods -n monitoring` par ci, un  `kubectl logs -n thebidouilleur docusaurus-x38jsu8` par là. Ça va 2 min, mais on passe plus de temps à taper les commandes qu'à analyser le résultat.
C'est pourquoi je me suis renseigné sur une interface me permettant de faire en quelques actions les mêmes tâches récurrentes. 

Et c'est ainsi que je suis tombé sur **K9S**.
## K9S

K9S est un utilitaire fonctionnant exactement de la même manière que *kubectl*. Il va envoyer des requêtes HTTPS aux maîtres du cluster et va afficher le résultat. 

> Petite démo provenant du site officiel 
<a href="https://asciinema.org/a/305944" target="_blank"><img src="https://asciinema.org/a/305944.svg" /></a>

Je connaissais déjà l'existence de **[Lens](https://k8slens.dev/)** que je trouve lourd et complexe d'utilisation et face à ça, K9S coche toutes les cases de mes attentes. 

K9S permet de : 
- Voir les logs des pods
- Ouvrir un port vers un pod 
- Voir en Yaml le manifest d'un pod/deployment
- Éditer les configmaps
- Faire du café

k9s fonctionne avec des raccourcis similaires à ceux de **VIM**. Le binaire ne pèse que quelques mégaoctets. Et aucune dépendance n'est requise *(en dehors du fait de bien posséder le kubeconfig)*. 

