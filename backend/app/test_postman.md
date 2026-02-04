**Nous avons ici les instructions json à envoyer pour avoir un retoure de notre API**

### pour l'authentification dans notre app

#### TODO : register json
> POST : http://localhost:4000/auth/register
```
{
  "prenom": "Alice",
  "pseudo": "alice42",
  "email": "alice@test.com",
  "mot_de_passe": "MotDePasse123!",
  "ip_cgu": "127.0.0.1",
  "date_cgu": "2026-02-03"
}
```
#### TODO : login json
> POST : http://localhost:4000/auth/login
```
{
  "email": "alice@test.com",
  "mot_de_passe": "MotDePasse123!",
}
```
### Teste pour les utilisateurs connectés 

Pour que mon api sache que tu es connecté, il demande un token de verification si il est valide alors la route 
utilisateur/me est le tocken atendu corespondent. 

> GET : http://localhost:4000/utilisateurs/me
```
{
  "email": "alice@test.com",
  "mot_de_passe": "MotDePasse123!",
}
```
Ce **_body/row_** plus son token nous permet de lui donner l'accer a notre app car il est bien enregitré dans 
la base de donnée et peut se loguer.
> Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
> eyJpZCI6NywiZW1haWwiOiJhbGlzZS5kZWxhY3JvaXhAdGVzdC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MDE5MzI5MiwiZXhwIjoxNzcwMjAwNDkyfQ.
> twXNI2dJ40cW06pm9YNMb7A_WKVLWTbdssoopa1hFU8

### Teste pour les modifications profile utilisateur connecté 
> PUT : http://localhost:4000/utilisateurs/me
```
{
  "email": "alice@test.com",
}
```
Toujours avec le token
On peut fair les modifications suivente [prenom, pseudo, email, actif]

### Teste pour les modifications de mot de passe utilisateur connecté
```
{
  "ancien_mot_de_passe": "MotDePasse123!",
  "nouveau_mot_de_passe": "NouveauMotDePasse456!"
}
```
### Teste de permission utilisateur connecté (ADMIN et USER)
Petit rappel de mon système de JWT qui nous donne pas mal d'information dont l'ID, le mail, on peut aussi savoir son role
est bien pour ce teste, nous allons comparer 2 role. compte (ADMIN) et compte (USER)

 Étape 1 : recuperé les tokens des connexions d'admin et user puis créer un groupe

#### 1. USER
créer un groupe authorized
> POST : http://localhost:4000/groupes/

Toujours avec le token
```
{
  "nom": "Groupe USER",
  "description": "Créé par un user"
}
```
pour le role interdiction de créer un role pour USER pas le droit
> POST : http://localhost:4000/role/

toujours avec le token
```
{
  "nom": "role_USER",
  "description": "Créé par un role user"
}
```
#### 2. ADMIN
créer un groupe authorisé
> POST : http://localhost:4000/groupes/

toujours avec le token
```
{
  "nom": "Groupe USER",
  "description": "Créé par un admin"
}
```
pour le role authorisé de créer un role pour ADMIN a le droit
> POST : http://localhost:4000/role/

toujours avec le token
```
{
  "nom": "role_USER",
  "description": "Créé par un role admin"
}
```
