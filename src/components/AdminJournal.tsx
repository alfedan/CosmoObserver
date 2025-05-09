import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  created: string;
  action: string;
  status: boolean;
  details?: string;
}

export function AdminJournal({ onBack }: { onBack: () => void }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const resultList = await pb.collection('admin_logs').getList(1, 50, {
          sort: '-created',
          requestKey: null // évite l'autocancellation de PocketBase
        });
        setLogs(resultList.items as LogEntry[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleDeleteLogs = async () => {
    try {
      const records = await pb.collection('admin_logs').getFullList();
      const deletePromises = records.map(record => 
        pb.collection('admin_logs').delete(record.id)
      );
      
      await Promise.all(deletePromises);
      setLogs([]);
      toast.success('✅ Journal effacé avec succès');
      
      // Créer une nouvelle entrée pour l'effacement du journal
      await pb.collection('admin_logs').create({
        action: 'Effacement du journal',
        status: true,
        details: 'Journal administratif effacé'
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'effacement du journal:', error);
      toast.error('❌ Erreur lors de l\'effacement du journal');
      
      await pb.collection('admin_logs').create({
        action: 'Effacement du journal',
        status: false,
        details: 'Erreur lors de l\'effacement'
      });
    }
    setShowConfirmDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold">Journal d'administration</h2>
        </div>
        
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Effacer le journal
        </button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(log.created).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span>{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={log.status ? 'text-green-400' : 'text-red-400'}>
                        {log.status ? 'Succès' : 'Échec'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{log.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirmer l'effacement</h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir effacer tout l'historique du journal ? 
              Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteLogs}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}