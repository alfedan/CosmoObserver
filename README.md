# CosmoObserver
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

-----------------------------------------------------------------------------------------------------------------------

# Automatiser le démarrage de PocketBase au boot

    nano /etc/systemd/system/pocketbase.service

colle le code : 

    [Unit]
    Description=PocketBase server
    After=network.target
    
    [Service]
    WorkingDirectory=/opt
    ExecStart=/opt/pocketbase serve
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

# créer la base de données

ouvre la page web de pocketbase : 

    http://192.168.X.XX:8090/\_/

Dans le menu de gauche, clique sur "Collections", puis "Create"

Nom de la collection : photos_astro

Type de collection : base (par défaut)

Coche auth pour etre le seul utilisateur a pouvoir poster

Ajoute les champs un par un :

titre → type : Text

description → type : Text → options : Long text

objet → type : Select → avec des valeurs comme :

    Galaxie, Nébuleuse, Planète, Amas, Lune, Soleil, Etoile, Comète, Astéroïde, SkyNight, Autre

date → type : Date

image → type : File → options : Max file size (ex: 10 MB), accept .jpg,.png,.webp

instrument → type : Text

camera → type : Text

Clique sur "Save"

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

