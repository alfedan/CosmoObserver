![image](https://github.com/user-attachments/assets/7d51ccea-98e5-4b7c-af96-23680bb3daf7)

interface pour photo astronomique

![image](https://github.com/user-attachments/assets/2924f66d-9154-4c3f-a87f-107aac0c0953)

---------------------------------------------------------------------
# Installation de la CT débian 12 dans Proxmox 7

Créer CT → Donne-lui un nom : cosmos-observer

créer un mot de passe pour l'utilisateur root

Template : Choisis Debian 12

Disque : 64 Go (ou plus si tu prévois pas mal d’images et vidéo mais cela peut etre ajuster plus tard)

CPU : 4 core mais 1 suffit si tu es passient (ce qui n'est pas mon cas)

RAM : 4096 (4 Go pour le confort)

SWAP : 2048 (pour le confort aussi)

Réseau : Bridge vmbr0, DHCP sur IP4 et aucun sur IP6

lance la CT et ouvre le terminal pour la met a jour

    apt update && apt upgrade -y

installer sudo : 

    apt install sudo

obtenir l'ip de la CT : 

    ip a

rechercher quelque chose comme 192.168.X.XX et mémorise le c'est important

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

acces a pocketbase, ouvre un navigateur et va sur : 

    http://192.168.X.XX/_/

Crée le compte administratif pour pocketbase, ne perd pas les données !

Modification pour protection CORPS : 

    cd /
    nano /opt/pb_data/.pb_cors.json

et coller le comptenu en modifian l'IP 192.168.X.XX par la votre : 

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

tout est vert.
"Ctrl + C" pour sortir de l'affichage et revenir aux commandes

---------------------------------------------------------------------------------------------------------------------------

# créer la base de données des photo

ouvre la page web de pocketbase : 

    http://192.168.X.XX:8090/\_/

Dans le menu de gauche, clique sur "Settings", puis "Import collections"

cliquer sur "Load from JSON file" et fournir le fichier "pb_schema.json" disponible sur le github. cela va créer toutes les bases de données utile.

# Tester l’ajout d’une photo astronomique : 

Dans le menu de gauche, clique sur ta collection photos_astro

Clique sur "Create Record" (bouton ➕ en haut à droite)

Remplis quelques champs pour test :

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

Initialiser un projet React : 

    sudo apt install npm -y

Installer les dépendances utiles : 

    npm install pocketbase react-router-dom framer-motion sonner canvas-confetti recharts axios

ainsi que :

    npm install --save rss-parser

télécharge l'interface utilisateur : 

    git clone https://github.com/alfedan/CosmoObserver

Modifier les paramètres de personalisation : 

Modification login et mot de passe administrateur : 

    cd CosmoObserver
    nano src/config/auth.ts

Modifier les paramètres de lieu : 

    nano src/config/settings.ts

voici les paramètres :

    city: "XXXXX", <-- le nom de la ville de résidence
    latitude: YY.YYYY, <-- latitude de la ville de résidence
    longitude: Z.ZZZZ, <-- longitude de la ville de résidence
    timezone: "Europe/Paris", <-- fuseau horaire de la ville de résidence
    openWeatherApiKey: "A1234567890B1234567890C" <-- votre clé API de OpenwWeather https://openweathermap.org/
    skycam:"http://Monsite.MonFAI.fr:PortDeRedirection/public.php" <-- l'adresse pour la AllSky si tu en a une (https://github.com/AllskyTeam/allsky)

Modification de l'IP de la base de donnée PocketBase : 

    nano src/lib/pocketbase.ts

et modifier les IP :

    import PocketBase from 'pocketbase';
    
    // Sélection dynamique de l'URL PocketBase
    let pocketBaseUrl = '';
    
    if (window.location.hostname === 'Monsite.MonFAI.fr') { <-- a modifier suivant votre FAI pour un acces en externe
      pocketBaseUrl = 'http://Monsite.MonFAI.fr:8090'; <-- même information que si dessus
    } else if (window.location.hostname === '192.168.X.XX') { <-- a dodifier avec ce qui a été vue précédament pour un acces en interne
      pocketBaseUrl = 'http://192.168.X.XX:8090'; <-- même information que si dessus
    } else {
      // Fallback local pour tests ou accès par IP différente
      pocketBaseUrl = 'http://127.0.0.1:8090';
    }

Installer l'interface utilisateur : 

    npm install

lancer le test de l'interface utilisateur : 

    npm run dev -- --host

accéder au site généré : 

    http://192.168.X.XX:5173

-------------------------------------------------------------------------------------------------------------------------------------------------

# Compiler la version définitive de CosmosObserver

Concevoir le build : 

    cd CosmoObserver

puis : 

    npm install

corriger les vulnérabilité : 

    npm audit fix

puis :

    npm audit fix --force

Vérifie qu'il n'y a plus de vulnérabilité : 

    npm install

Consevoir le build : 

    npm run build

S'il y a besoin de créer un nouveau build :

    rm -rf dist
    npm run build

Installation du serveur : 

    npm install -g serve
    serve -s dist

le site est accessible a l'adresse http://192.168.X.XX:3000

Démarrage automatique du serveur : 

    which serve

tu dois avoir : /usr/local/bin/serve

Crée un service systemd :

    sudo nano /etc/systemd/system/serve-react.service

et colle cela, tu peux modifier le port 3000 si tu veux : 

    [Unit]
    Description=Serve React App
    After=network.target
    
    [Service]
    Type=simple
    User=root
    WorkingDirectory=/root/CosmoObserver
    ExecStart=/usr/local/bin/serve -s dist -l 3000
    Restart=always
    
    [Install]
    WantedBy=multi-user.target

Active et démarre le service : 

    sudo systemctl daemon-reexec
    sudo systemctl daemon-reload
    sudo systemctl enable serve-react
    sudo systemctl start serve-react

Vérifie que tout fonctionne :

    systemctl status serve-react

et 

    http://192.168.X.XX:3000

Si besoin d'arreter le serveur : 

    sudo systemctl stop serve-react

puis cela pour le démarrer : 

    sudo systemctl start serve-react

profiter bien de l'application et que le ciel soit claire !

----------------------------------------------------------------------------------------------------------------------------------

# Installer l'aplication sur vos appareil.

![image](https://github.com/user-attachments/assets/df29960b-e961-4447-b2ce-a8ac9e9c4b0b)

sur apple, android et smartphone windows : 

Accédez au site web via un navigateur.

Cliquez sur option dans la barre d'outils, puis choisissez « Ajouter au Dock », "A l'écran d'accueil"...

Cliquez sur Ajouter.

Sur PC Windows créer un racourci sur le bureau, vous pouvez modifier l'icone avec l'icone fourni dans le répertoire img.

----------------------------------------------------------------------------------------------------------------------------------

quelque photo de l'application : 

![image](https://github.com/user-attachments/assets/b0262a97-d705-4395-8db8-90f462d13393)

![image](https://github.com/user-attachments/assets/06fbed7d-0e11-4323-ab58-29dcefbf53c9)

![image](https://github.com/user-attachments/assets/738a7093-956d-4bfc-9e15-98b1a1425b6d)

![image](https://github.com/user-attachments/assets/9804c9fd-b19f-4129-b49b-2abc0f969fde)

![image](https://github.com/user-attachments/assets/68e79173-d14b-4c28-964e-893b0350fc7e)
