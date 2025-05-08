#!/bin/bash

# Chemins des fichiers à préserver (à adapter à ton projet)
CONFIG_FILES=(
  "src/config/auth.ts"
  "src/config/settings.ts"
  "src/lib/pocketbase.ts"
)

# Dossier temporaire de sauvegarde
BACKUP_DIR="./backup_config_$(date +%s)"
mkdir -p "$BACKUP_DIR"

echo "🔍 arret du serveur pour maintenance..."
systemctl stop serve-react || { echo "❌ Erreur lors de l'arret du serveur"; exit 1; }

echo "🗄️ Sauvegarde des fichiers de configuration..."
for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$BACKUP_DIR/"
    echo "✅ Sauvegardé : $file"
  else
    echo "⚠️ Fichier manquant : $file"
  fi
done

echo "🔄 Mise à jour du dépôt depuis GitHub..."
if ! git pull origin main; then
  echo "⚠️ Des modifications locales empêchent la mise à jour."
  echo "👉 Veux-tu forcer la mise à jour en ignorant les changements ? (o/n)"
  read -r confirm
  if [ "$confirm" = "o" ]; then
    git reset --hard HEAD && git pull origin main || { echo "❌ Erreur Git (forcée)"; exit 1; }
  else
    echo "❌ Annulé. Merci de valider ou sauvegarder vos changements."
    exit 1
  fi
fi

echo "📦 Installation des dépendances..."
npm install || { echo "❌ npm install a échoué"; exit 1; }

echo "🔍 Version de npm : $(npm -v)"

echo "🔄 Vérification des vulnérabilitées..."
npm audit fix || { echo "❌ npm audit a échoué"; exit 1; }

echo "📦 Installation des dépendances..."
npm install || { echo "❌ npm install a échoué"; exit 1; }

echo "🔧 Recompilation de l'application..."
npm run build || { echo "❌ La compilation a échoué"; exit 1; }

echo "📁 Restauration des fichiers de configuration..."
for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$BACKUP_DIR/$(basename "$file")" ]; then
    cp "$BACKUP_DIR/$(basename "$file")" "$file"
    echo "✅ Restauré : $file"
  fi
done

echo "🧹 Nettoyage..."
rm -r "$BACKUP_DIR"

echo "🔍 démarrage du serveur..."
systemctl start serve-react || { echo "❌ Erreur lors du démarrage du serveur"; exit 1; }

echo "✅ Mise à jour terminée avec succès !"
