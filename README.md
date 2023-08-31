# Application Archi-explorer

Bienvenu dans sur le GIT de l'application de visualisation de modèles 3D 'ARCHI-EXPLORER'

Une applciation créé par 2 étudiants de DUT Informatique en stage dans l'entreprise ARCHIMED GE (Géomêtre Expert).

## La Génèse du projet

Fruit de l'imagination du étudiante en PFE à l'INSA, l'idée vient du fait que certains clients du cabinet souhaitaient pouvoir avoir excès au relevé effectué à leur domiciles. Il fallait donc une applciation facile d'accès et d'utilisation. Une applciation Web s'est donc rapidement imposée.

## L'application

### Le frontend

Aucun framwork n'a été utilisé pour l'application du fait que l'hébergement chez IONOS est trop restrictif. Les pages sont donc en PHP natif. J'utilise toute fois la librairie AltoRouter pour le routage des pages. Cela permet une navigation plus propre dans l'applciation qu'en passant par des "location" de JS natif.
Pour la modélisation des modèle j'utilise la librairie ThreeJs qui contient des fonctions d'affichage des modèles au format obj/mtl et fbx.

### Le backend

Le backend utilise la même librairie pour le router. Cela permet une meilleure gestion de la récupération et de la vérification des scripts. A noté que les 2 partie de l'application ne sont pas sous le même nom de domaine.
