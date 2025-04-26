# CosmosObserver
interface pour photo astronomique
---------------------------------------------------------------------
# Installation de la CT débian 12 dans Proxmox 7

Créer CT → Donne-lui un nom : cosmos-observer

créer un mot de passe pour l'utilisateur root

Template : Choisis Debian 12

Disque : 64 Go (ou plus si tu prévois pas mal d’images)

CPU : 4 core mais 1 suffit si tu es passient

RAM : 4096 (4 Go pour le confort)

SWAP : 2048 (pour le confort aussi)

Réseau : Bridge vmbr0, DHCP sur IP4 et aucun sur IP6

lance la CT et ouvre le terminal pour la met a jour

    apt update && apt upgrade -y

installer sudo : 

    apt install sudo

obtenir l'ip de la CT : 

    ip a

rechercher quelque chose comme 192.168.X.XX

-----------------------------------------------------------------
# Installation de PocketBase

vas dans le répertoire opt : 

    cd /opt

télécharge pocketbase : 

    wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.11/pocketbase_0.22.11_linux_amd64.zip

installe unzip et décompresse pocketbase : 

    apt update && apt install unzip -y
    unzip pocketbase_0.22.11_linux_amd64.zip

Donne les bons droits au fichier : 

    chmod +x pocketbase

Lance-le pour tester :

    ./pocketbase serve

Tu verras un message du genre :

Starting PocketBase at http://127.0.0.1:8090/

instal Nginx pour accéder a pocketbase : 

    apt update && apt install nginx -y

Créer un fichier de configuration Nginx : 

    nano /etc/nginx/sites-available/pocketbase

code : 

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://127.0.0.1:8090;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

Activer la config : 

    ln -s /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/

    rm /etc/nginx/sites-enabled/default

    systemctl restart nginx

acces a pocketbase : 

    http://192.168.X.XX/_/

Crée le compte administratif pour pocketbase

Modification pour protection CORPS : 

    cd /
    nano /opt/pb_data/.pb_cors.json

et coller le comptenu : 

    {
      "enabled": true,
      "origins": [
        "http://localhost:5173",
        "http://192.168.X.XX:5173"
      ],
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
      "headers": ["Authorization", "Content-Type"],
      "exposeHeaders": [],
      "maxAge": 86400,
      "credentials": true
    }

Modification de la taille des entrée de la base

    cd /
    cd opt/pb_data

créer le fichier config.json

    nano config.json

Coller le code 

    {
      "uploadMaxFileSize": 104857600
    }

sauvegarder le fichier avec "ctrl + x"

redémarrer pocketbase

    sudo systemctl restart pocketbase

-----------------------------------------------------------------------------------------------------------------------

# Automatiser le démarrage de PocketBase au boot

    cd /
    nano /etc/systemd/system/pocketbase.service

colle le code : 

    [Unit]
    Description=PocketBase server
    After=network.target
    
    [Service]
    WorkingDirectory=/opt
    ExecStart=/opt/pocketbase serve --http 0.0.0.0:8090 --dir /opt/pb_data
    Restart=on-failure
    RestartSec=5
    StandardOutput=journal
    StandardError=journal
    User=root
    
    [Install]
    WantedBy=multi-user.target

Activer et démarrer le service : 

    systemctl daemon-reexec
    systemctl daemon-reload
    systemctl enable pocketbase
    systemctl start pocketbase
 
vérifier qu’il tourne avec :

    systemctl status pocketbase

---------------------------------------------------------------------------------------------------------------------------

# créer la base de données des photo

ouvre la page web de pocketbase : 

    http://192.168.X.XX:8090/\_/

Dans le menu de gauche, clique sur "Collections", puis "Create"

Nom de la collection : photos_astro

Type de collection : base (par défaut)

Coche auth pour etre le seul utilisateur a pouvoir poster

Ajoute les champs un par un :

titre → type : Text

description → type : Text → options : Long text

objet → type : liste ; Sélection → Multiple ; Select → avec les valeurs :

    Galaxie, Nébuleuse, Planète, Amas, Lune, Soleil, Etoile, Comète, SkyCam, Autre, SH2, NGC, IC, M

date → type : Date

image → type : File ; choix : single

instrument → type : Text

camera → type : Text

video → type : File ; choix : single

mediaType → type : liste ; sélection : single ; Select : avec les caleurs : 

    image, video

Clique sur "Save"

changer API rules de tout les champs en :

    @request.auth.id != "" || @request.auth.id = ""

# Tester l’ajout d’une photo astronomique : 

Dans le menu de gauche, clique sur ta collection photos_astro

Clique sur "Create Record" (bouton ➕ en haut à droite)

Remplis quelques champs :

titre : "Andromède"

objet : Galaxie

date : 2024-10-15

instrument : Newton 200/1000

camera : ZWO ASI294MC Pro

description : "Image empilée de 30x180s avec DOF"

Dans image, upload une belle photo (ou une image de test pour commencer)

Clique sur "Save record"

Une fois enregistrée :

Clique sur l’enregistrement pour l’ouvrir

Tu devrais voir une URL de fichier (quelque chose comme /api/files/xxxx/xxxxxx.jpg)

Essaie de cliquer dessus : si tout va bien, l’image s’affiche !

# créer la base de donner de sauvegarde des messages de contact

dans l'interface de pocketbase cliquer sur "collections" puis "new colection"

nom de la base : messages

ajouter les champs : 

text : name

email : email

text : subject

text : message

email : to

changer API rules de tout les champs en :

    @request.auth.id != "" || @request.auth.id = ""

# créer la base de donnée du journal

dans l'interface de pocketbase cliquer sur "collections" puis "new colection"

nom de la base : admin_logs

ajouter les champs : 

text : action

text : status

text : details

changer API rules de tout les champs en :

    @request.auth.id != "" || @request.auth.id = ""

------------------------------------------------------------------------------------------------------------------------------------

# Installation de l'interface utilisateur : 

Créer un dossier pour le site React : 

    cd #
    mkdir -p ~/cosmos-observer-site
    cd ~/cosmos-observer-site

Initialiser un projet React : 

    sudo apt install npm -y

puis une fois installer : 

    npm create vite@latest

Installer les dépendances utiles : 

    npm install
    npm install pocketbase react-router-dom framer-motion

télécharge l'interface utilisateur : 

    git clone https://github.com/alfedan/CosmoObserver

Installer l'interface utilisateur : 

    cd #
    cd cosmos-observer-site/CosmosObserver

Installation des effet visuel : 

    npm install sonner

et : 

    npm install canvas-confetti

puis : 

    npm install

lancer le test de l'interface utilisateur : 

    npm run dev -- --host

accéder au site généré : 

    http://192.168.X.XX:5173

-------------------------------------------------------------------------------------------------------------------------------------------------

# Intégration du formulaire d'envoie de mail



Concevoir le builde : 

    npm run build

puis : 

    npm install -g serve
    serve -s dist
