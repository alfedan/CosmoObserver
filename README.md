# CosmoObserver
interface pour photo astronomique
---------------------------------------------------------------------
Installation de la CT débian 12 dans Proxmox 7

Créer CT → Donne-lui un nom : cosmos-observer

Template : Choisis Debian 12

Disque : 64 Go (ou plus si tu prévois pas mal d’images)

CPU : 4 core mais 1 suffit si tu es passient

RAM : 4096 (4 Go pour le confort)

SWAP : 2048 (pour le confort aussi)

Réseau : Bridge vmbr0, DHCP sur IP4 et aucun sur IP6

-----------------------------------------------------------------
Installation de PocketBase

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

