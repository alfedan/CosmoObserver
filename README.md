# CosmosObserver
interface pour photo astronomique

![image](https://github.com/user-attachments/assets/2924f66d-9154-4c3f-a87f-107aac0c0953)

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

    cd /
    cd opt

télécharge pocketbase : 

    wget https://github.com/pocketbase/pocketbase/releases/download/v0.27.2/pocketbase_0.27.2_linux_amd64.zip

installe unzip et décompresse pocketbase : 

    apt update && apt install unzip -y
    unzip pocketbase_0.27.2_linux_amd64.zip

Donne les bons droits au fichier : 

    chmod +x pocketbase

vérifier la version PocketBase v0.27.2: 

    ./pocketbase --version

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

et coller le comptenu en modifian l'IP 192.168... par la votre : 

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

Dans le menu de gauche, clique sur "Settings", puis "Import collections"

cliquer sur "Load from JSON file" et fournir le fichier "pb_schema.json"

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

------------------------------------------------------------------------------------------------------------------------------------

# Installation de l'interface utilisateur : 

Créer un dossier pour le site React : 

    cd #
    mkdir -p ~/cosmos-observer-site
    cd ~/cosmos-observer-site

Initialiser un projet React : 

    sudo apt install npm -y

Installer les dépendances utiles : 

    npm install pocketbase react-router-dom framer-motion sonner canvas-confetti recharts axios

télécharge l'interface utilisateur : 

    git clone https://github.com/alfedan/CosmoObserver

Modifier les paramètres de personalisation : 

Modification login et mot de passe administrateur : 

    cd /CosmosObserver
    nano /src/config/auth.ts

Modifier les paramètres de lieu : 

    nano /src/config/settings.ts

voici les paramètres :

  city: "XXXXX", <-- le nom de la ville de résidence
  latitude: YY.YYYY, <-- latitude de la ville de résidence
  longitude: Z.ZZZZ, <-- longitude de la ville de résidence
  timezone: "Europe/Paris", <-- fuseau horaire de la ville de résidence
  openWeatherApiKey: "A1234567890B1234567890C" <-- votre clé API de OpenwWeather https://openweathermap.org/

Modification de l'IP de la base de donnée PocketBase : 

    nano /src/lib/pocketbase.ts

et modifier l'IP :

    export const pb = new PocketBase('http://127.0.0.1:8090'); <-- type http://192.168.X.X:8090 (accessible qu'en local) ou http://monsite.org:8090 (pour un acces en extérieur avec port ouvert et redirection fait dans le routeur)

Installer l'interface utilisateur : 

    cd #
    cd cosmos-observer-site/CosmosObserver

puis : 

    npm install

lancer le test de l'interface utilisateur : 

    npm run dev -- --host

accéder au site généré : 

    http://192.168.X.XX:5173

-------------------------------------------------------------------------------------------------------------------------------------------------

# Compiler la version définitive de CosmosObserver



Concevoir le builde : 

    npm run build

puis : 

    npm install -g serve
    serve -s dist
