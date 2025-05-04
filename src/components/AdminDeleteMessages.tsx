import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Mail, Calendar, User } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';

interface Message {
  id: string;
  created: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function AdminDeleteMessages({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const resultList = await pb.collection('messages').getList(1, 50, {
          sort: '-created',
          requestKey: null // évite l'autocancellation de PocketBase
        });
        setMessages(resultList.items as Message[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        toast.error('❌ Erreur lors du chargement des messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleCheckboxChange = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMessages(new Set(messages.map(message => message.id)));
    } else {
      setSelectedMessages(new Set());
    }
  };

  const handleDelete = async () => {
    setShowConfirmDialog(false);
    
    if (selectedMessages.size === 0) {
      toast.error('❌ Aucun message sélectionné');
      return;
    }

    try {
      const deletePromises = Array.from(selectedMessages).map(id =>
        pb.collection('messages').delete(id)
      );
      
      await Promise.all(deletePromises);
      
      setMessages(prevMessages => 
        prevMessages.filter(message => !selectedMessages.has(message.id))
      );
      
      setSelectedMessages(new Set());
      toast.success(`✅ ${selectedMessages.size} message(s) supprimé(s)`);
      
      // Log the action
      await pb.collection('admin_logs').create({
        action: 'Suppression de messages',
        status: true,
        details: `${selectedMessages.size} message(s) supprimé(s)`
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression des messages');
      
      // Log the error
      await pb.collection('admin_logs').create({
        action: 'Suppression de messages',
        status: false,
        details: 'Erreur lors de la suppression'
      });
    }
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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold">Suppression des messages</h2>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedMessages.size === messages.length}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-gray-600"
            />
            <span className="font-medium">
              {selectedMessages.size} message(s) sélectionné(s)
            </span>
          </div>
          
          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={selectedMessages.size === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="w-12 px-6 py-4"></th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Expéditeur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Sujet</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {messages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.has(message.id)}
                      onChange={() => handleCheckboxChange(message.id)}
                      className="w-5 h-5 rounded border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(message.created).toLocaleDateString('fr-FR', {
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
                      <span>{message.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a 
                        href={`mailto:${message.email}`}
                        className="text-blue-400 hover:underline"
                      >
                        {message.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">{message.subject}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">{message.message}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer {selectedMessages.size} message(s) ? 
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
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}