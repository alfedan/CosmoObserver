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
git pull origin main || { echo "❌ Erreur Git"; exit 1; }

echo "📁 Restauration des fichiers de configuration..."
for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$BACKUP_DIR/$(basename "$file")" ]; then
    cp "$BACKUP_DIR/$(basename "$file")" "$file"
    echo "✅ Restauré : $file"
  fi
done

echo "📦 Installation des dépendances..."
npm install || { echo "❌ npm install a échoué"; exit 1; }

echo "🔍 Version de npm : $(npm -v)"

echo "🔄 Vérification des vulnérabilitées..."
npm audit fix || { echo "❌ npm audit a échoué"; exit 1; }

echo "🔧 Correction des vulnérabilités..."
npm audit fix --force --yes
AUDIT_STATUS=$?

if [ $AUDIT_STATUS -ne 0 ]; then
  echo "⚠️ npm audit fix --force a échoué, mais le processus continue..."
else
  echo "✅ npm audit fix --force terminé avec succès."
fi

echo "📦 Installation des dépendances..."
npm install || { echo "❌ npm install a échoué"; exit 1; }

echo "🔧 Recompilation de l'application..."
npm run build || { echo "❌ La compilation a échoué"; exit 1; }

echo "🧹 Nettoyage..."
rm -r "$BACKUP_DIR"

echo "✅ Mise à jour terminée avec succès !"
