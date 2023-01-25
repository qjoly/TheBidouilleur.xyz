---
title: Vérification configuration système (testinfra)
slug: testinfra
---


## Qu'est ce qu'un test unitaire ? 
On réserve souvent les tests unitaires pour le développement. L'idée est d'injecter des informations dans des fonctions/méthodes et d'en vérifier le traitement. 

Voici un exemple bref d'un test unitaire en python : 

```python
def convert_str_to_int(strvar):
  if strvar.isdigit():
    return str(strvar)
  else:
    return False
    
assert type(convert_str_to_int("4")) == int
```

Ainsi, on vérifie via "assert" (générant une erreur si la condition renvoie un "False") que le type de ce que retourne la fonction convert_str_to_int() est bien de type "int". 

Mais est-il possible de créer des tests unitaires pour vérifié qu'un système soit à la bonne version ou bien parametré ? 

Oui ! Grace à testinfra

## TestInfra

### Débuter avec testinfra

Installer TestInfra se faire rapidement à partir de PIP: 
```bash
python3 -m pip install pytest-testinfra
```

Une fois installé, nous pouvons créer notre premier test : 

```python
#test_host.py
def test_passwd_file(host):
    passwd = host.file("/etc/passwd")
    assert passwd.contains("root")
    assert passwd.user == "root"
    assert passwd.group == "root"
    assert passwd.mode == 0o644 
```
L'objet "host" renvoie à la machine testée. Nous vérifions que le fichier `/etc/passwd` contient bien `root`, que son utilisateur/groupe propriétaires soit bien "root", et qu'il ait bien les permissions *(octales)* 0o644.

Si on lance ce premier fichier via `py.test`, voici le résultat : 
```
└─▪py.test test_host.py       
============================================================================================= test session starts ==============================================================================================
platform linux -- Python 3.8.10, pytest-7.2.1, pluggy-1.0.0
rootdir: /app, configfile: pytest.ini
plugins: testinfra-7.0.0, xdist-3.1.0
collected 1 item                                                                                                                                                                                               
test_host.py .                                                                                                                                                                                           [100%]
============================================================================================== 1 passed in 0.33s ===============================================================================================
```
Aucune erreur dans ce test. Créons maintenant volontairement une erreur : 

```python
def test_passwd_file(host):
    passwd = host.file("/etc/passwd")
    assert passwd.contains("root")
    assert passwd.user == "root"
    assert passwd.group == "root"
    assert passwd.mode == 0o644    

def test_appdir(host):
    assert host.file("/appdir/").exists
```

```
============================================================================================= test session starts ==============================================================================================
platform linux -- Python 3.8.10, pytest-7.2.1, pluggy-1.0.0
rootdir: /app, configfile: pytest.ini
plugins: testinfra-7.0.0, xdist-3.1.0
collected 2 items                                                                                                                                                                                              

test_host.py .F                                                                                                                                                                                          [100%]

=================================================================================================== FAILURES ===================================================================================================
______________________________________________________________________________________________ test_appdir[local] ______________________________________________________________________________________________

host = <testinfra.host.Host local>

    def test_appdir(host):
>       assert host.file("/appdir/").exists
E       AssertionError: assert False
E        +  where False = <file /appdir/>.exists
E        +    where <file /appdir/> = <class 'testinfra.modules.base.GNUFile'>('/appdir/')
E        +      where <class 'testinfra.modules.base.GNUFile'> = <testinfra.host.Host local>.file

test_host.py:12: AssertionError
---------------------------------------------------------------------------------------------- Captured log call -----------------------------------------------------------------------------------------------
DEBUG    testinfra:base.py:288 RUN CommandResult(command=b'test -e /appdir/', exit_status=1, stdout=None, stderr=None)
=========================================================================================== short test summary info ============================================================================================
FAILED test_host.py::test_appdir[local] - AssertionError: assert False
========================================================================================= 1 failed, 1 passed in 0.17s ==========================================================================================
```
Nous obtenons bel et bien notre erreur, et son détail (la condition renvoyée est fausse, et nous avons la commande bash `test -e /app/dir` testée). 

à partir de cette base, nous pouvons tester de nombreux éléments comme les fichiers, les interfaces, les packages installés et bien d'autres.

:::tip Tips: Utiliser les workers

Il est possible de lancer les tests à partir de workers *(Et donc lancer plusieurs taches en une seule fois)*. 
Il suffit d'ajouter `-n auto` *(ou remplacer auto par le nombre de workers)*. 

:::

[Vous pourrez retrouver la liste des modules disponibles ici](https://testinfra.readthedocs.io/en/latest/modules.html)

## Utiliser une machine distance (ssh)

Tester notre propre machine est plutot utile, mais qu'en est-il de tester un serveur accessible par ssh ? 

Pour cela il suffit de surcharger la variable *testinfra_hosts*: 
```python
testinfra_hosts = ["root@127.0.0.1", "user@192.168.1.2", "192.168.1.3"]

def test_passwd_file(host):
    passwd = host.file("/etc/passwd")
    assert passwd.contains("root")
    assert passwd.user == "root"
    assert passwd.group == "root"
    assert passwd.mode == 0o644    
```

Il faut bien sûr avoir un accès sans mot de passe pour que le test fonctionne. *(Un peu comme Ansible)*

## Lancer le test depuis un code python

Je n'apprécie que très peu le fait de lancer `py.test` sans pouvoir rebondir sur le résultat dans un Python.

```python
import pytest
pytest.main(["-v", "--tb=native", "-rN", "-n", "auto"]) 
```

Et si on souhaite rebondir sur le résultat du test : 

```python
import pytest
result = pytest.main(["-v", "--tb=native", "-rN", "-n", "auto"]) 

if result.name == "OK":
    print("Le test est fonctionnel")
else:
    print("Il y a une erreur dans le test")
```

Pour l'instant, mon usage de testinfra s'arrète à ça. Je n'ai pas détaillé les fonctionnements des modules *(socket, file, docker etc..)* puisque la documentation est bien complète. 

