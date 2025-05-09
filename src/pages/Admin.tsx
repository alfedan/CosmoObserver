import React, { useState } from 'react';
import { User, Mail, Trash2, Upload, X, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { StarField } from '../components/StarField';
import { adminCredentials } from '../config/auth';
import { AdminMessages } from '../components/AdminMessages';
import { AdminJournal } from '../components/AdminJournal';
import { AdminUploadPhotos } from '../components/AdminUploadPhotos';
import { AdminDeleteMessages } from '../components/AdminDeleteMessages';
import { AdminDeletePhotos } from '../components/AdminDeletePhotos';
import { AdminModifyPhotos } from '../components/AdminModifyPhotos';
import { pb } from '../lib/pocketbase';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const logAdminAction = async (action: string, status: boolean, details?: string) => {
    try {
      await pb.collection('admin_logs').create({
        action,
        status,
        details
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = username === adminCredentials.username && password === adminCredentials.password;
    
    await logAdminAction('Tentative de connexion', isValid, isValid ? undefined : 'Identifiants incorrects');
    
    if (isValid) {
      setIsAuthenticated(true);
      toast.success('✅ Bienvenu sur Cosmos Observer Administrateur');
    } else {
      setUsername('');
      setPassword('');
      toast.error('❌ Contacter l\'administrateur');
    }
  };

  const AdminMenu = () => (
    <div className="grid grid-cols-2 gap-6 mt-8">
      {[
        { id: 'messagerie', icon: Mail, label: 'Messagerie' },
        { id: 'delete-messages', icon: Trash2, label: 'Suppression de message' },
        { id: 'upload-photos', icon: Upload, label: 'Téléchargement de photo' },
        { id: 'delete-photos', icon: Trash2, label: 'Suppression de photo' },
        { id: 'modify-photos', icon: Upload, label: 'Modification de photo' },
        { id: 'journal', icon: BookOpen, label: 'Journal' }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setSelectedMenu(item.id);
            if (item.id !== 'journal') {
              logAdminAction(`Accès à ${item.label}`, true);
            }
          }}
          className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-all hover:bg-gray-800/50 flex flex-col items-center gap-4"
        >
          <item.icon className="w-12 h-12" />
          <span className="text-lg font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Identifiant</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Connexion
          </button>
        </form>
      );
    }

    if (selectedMenu === 'messagerie') {
      return <AdminMessages onBack={() => setSelectedMenu(null)} />;
    }

    if (selectedMenu === 'journal') {
      return <AdminJournal onBack={() => setSelectedMenu(null)} />;
    }

    if (selectedMenu === 'upload-photos') {
      return <AdminUploadPhotos onBack={() => setSelectedMenu(null)} />;
    }

    if (selectedMenu === 'delete-messages') {
      return <AdminDeleteMessages onBack={() => setSelectedMenu(null)} />;
    }

    if (selectedMenu === 'delete-photos') {
      return <AdminDeletePhotos onBack={() => setSelectedMenu(null)} />;
    }

    if (selectedMenu === 'modify-photos') {
      return <AdminModifyPhotos onBack={() => setSelectedMenu(null)} />;
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Menu Administrateur</h2>
          <button
            onClick={async () => {
              await logAdminAction('Déconnexion', true);
              setIsAuthenticated(false);
              setSelectedMenu(null);
            }}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <AdminMenu />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <User className="w-8 h-8 text-blue-400" />
              Administration
            </h1>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}