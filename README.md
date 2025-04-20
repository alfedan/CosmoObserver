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



-----------------------------------------------------------------------------------------------------------------------

# Automatiser le démarrage de PocketBase au boot

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

# créer la base de bonner de sauvegarde des messages de contact

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

------------------------------------------------------------------------------------------------------------------------------------

# Installation de l'interface utilisateur : 

Créer un dossier pour le site React : 

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

    cd ~/cosmos-observer-site/CosmosObserver

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

Installation de GO : 

    cd /tmp
    curl -LO https://go.dev/dl/go1.22.2.linux-amd64.tar.gz

suprime les ancienne version :

    rm -rf /usr/local/go

décompresse l'archive : 

    tar -C /usr/local -xzf go1.22.2.linux-amd64.tar.gz

Ajouter Go au PATH
Ajoute ceci à la fin du fichier ~/.bashrc

    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    source ~/.bashrc

Vérifier que Go fonctionne

    go version

tu doit avoir : go version go1.22.2 linux/amd64

ajout de CURL : 

    apt update && apt install curl -y

et ajoute y GO : 

    curl -LO https://go.dev/dl/go1.22.2.linux-amd64.tar.gz

Cloner le dépôt officiel de PocketBase : 

    cd
    cd /opt
    mkdir pocketbase-custom
    cd pocketbase-custom

puis : 

    git clone https://github.com/pocketbase/pocketbase.git
    cd pocketbase

module Go : 
remplace XXXXX par ton compte github

    go mod init github.com/XXXXX/cosmos-ob-pb
    go mod tidy

supression de l'ancien systeme de mail : 

    cd /opt
    go get github.com/go-mail/mail

créer le hooks : 

    cd /opt
    mkdir -p pb_hooks

puis crer le message : 

    nano pb_hooks/messages.go

et coller le code en modifiant "ton-adresse@email.com", "utilisateur@email.com", "mot_de_passe", "smtp.exemple.com", "smtp.exemple.com:587", "expediteur@email.com"

    package pb_hooks
    
    import (
        "log"
        "net/smtp"
    
        "github.com/pocketbase/pocketbase"
        "github.com/pocketbase/pocketbase/models"
        "github.com/pocketbase/pocketbase/hooks"
    )
    
    func Register(app *pocketbase.PocketBase) {
        hooks.AfterRecordCreate(app, "messages", func(e *hooks.RecordEvent) error {
            name := e.Record.GetString("name")
            email := e.Record.GetString("email")
            subject := e.Record.GetString("subject")
            message := e.Record.GetString("message")

            // Adresse de destination (ton adresse mail)
            to := "ton-adresse@email.com"

            body := "Subject: Nouveau message de contact\n\n" +
                "Nom: " + name + "\n" +
                "Email: " + email + "\n" +
                "Sujet: " + subject + "\n" +
                "Message:\n" + message
    
            // Configuration SMTP (à adapter selon ton fournisseur d'email)
            auth := smtp.PlainAuth("", "utilisateur@email.com", "mot_de_passe", "smtp.exemple.com")
            err := smtp.SendMail("smtp.exemple.com:587", auth, "expediteur@email.com", []string{to}, []byte(body))
            if err != nil {
                log.Println("Erreur envoi mail:", err)
                return err
            }

            log.Println("📩 Notification envoyée à", to)
            return nil
        })
    }

créer le main : 

    nano pb_hooks/main.go

colle le code en le complétant avec les information du mail : 

    // /opt/pb_hooks/main.go
    package main
    
    import (
        "log"
        "net/smtp"
        "github.com/pocketbase/pocketbase"
        "github.com/pocketbase/pocketbase/plugins/hooks"
        "github.com/pocketbase/pocketbase/models"
    )
    
    func main() {
        hooks.OnRecordAfterCreateRequest().Add(func(e *hooks.RecordEvent) error {
            if e.Record.Collection().Name != "messages" {
                return nil
            }
    
            from := "tonemail@example.com"
            pass := "TON_MOT_DE_PASSE"
            to := "tonemail@example.com" // ou une autre adresse
    
            subject := "💌 Nouveau message sur Cosmos Observer"
            body := "De: " + e.Record.GetString("name") + "\n" +
                "Email: " + e.Record.GetString("email") + "\n" +
                "Sujet: " + e.Record.GetString("subject") + "\n\n" +
                e.Record.GetString("message")
    
            msg := "Subject: " + subject + "\n\n" + body
    
            err := smtp.SendMail("smtp.example.com:587",
                smtp.PlainAuth("", from, pass, "smtp.example.com"),
                from, []string{to}, []byte(msg))
    
            if err != nil {
                log.Println("Erreur d'envoi email :", err)
            }
    
            return nil
        })
    }

Puis créer le fichier email.ts : 

    nano pb_hooks/email.ts

colle le code en changant l'adresse mail 

    import type { RequestEvent } from "pocketbase";
    
    export default async function (event: RequestEvent) {
        const data = event.record;
    
    const response = await event.mailer.send({
        from: "noreply@cosmos-observer.local",
        to: "ton.email@domaine.com", // ← Remplace par ton adresse e-mail
        subject: `📬 Nouveau message de ${data.name}`,
        html: `
            <h2>📩 Nouveau message via le formulaire de contact</h2>
            <p><strong>Nom:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Sujet:</strong> ${data.subject}</p>
            <p><strong>Message:</strong><br/>${data.message}</p>
        `,
        });
    
        console.log('Notification envoyée:', response);
    }


et en fin le fichier index.ts : 

    nano pb_hooks/index.ts

colle le code : 

    import type { RequestEvent } from "pocketbase";
    import emailHook from "./email";
    
    export default function registerHooks(app: any) {
        app.onRecordAfterCreateRequest("messages", async (event: RequestEvent) => {
        await emailHook(event);
        });
    }

compile le tout : 

    cd /opt/pb_hooks
    go mod init pb_hooks
    go mod tidy
    go build -buildmode=plugin -o pb_hooks.so main.go

tuer l'ancienne instance de pocketbase : 

    lsof -i :8090

tu dois avoir quelque chose comme "pocketbas  12345   root   12u  IPv4"

repere les chiffres apres pocketbase et remplace le 12345 par les chiffres affiché précédament :

    kill 12345

lance pocketbase avec le hooks : 

    ./pocketbase serve

attend quelque minute et sort de l'interface avec "ctrl + c"

créer le fichier de configuration de pocketbase : 

    nano /opt/pb_data/config.json

colle et modifie le code suivant avec les donnée de ton FAI : 

    {
        "smtp": {
        "enabled": true,
        "host": "smtp.free.fr",
        "port": 587,
        "username": "ton@email.free.fr",
        "password": "ton_mot_de_passe",
        "encryption": "tls",
        "fromAddress": "ton@email.free.fr",
        "fromName": "Cosmos Observer"
        }
    }

lance pocket base avec le systeme : 

    systemctl restart pocketbase

attend quelque minute et controle ton acces en allant sur :

    http://192.168.X.XX/_/


Concevoir le builde : 

    npm run build

puis : 

    npm install -g serve
    serve -s dist
