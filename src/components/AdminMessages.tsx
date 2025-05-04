import React from 'react';
import { Mail, Calendar, User, ArrowLeft } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  created: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function AdminMessages({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const resultList = await pb.collection('messages').getList(1, 10, {
          sort: '-created',
          requestKey: null // évite l'autocancellation de PocketBase
        });
        setMessages(resultList.items as Message[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

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
        <h2 className="text-2xl font-semibold">Messagerie</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-medium mb-4 px-2">Boîte de réception</h3>
          <div className="space-y-2">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{message.subject}</p>
                    <p className="text-sm text-gray-400 truncate">{message.name}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(message.created).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 h-[600px] overflow-y-auto">
          {selectedMessage ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">{selectedMessage.subject}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{selectedMessage.name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-blue-400 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(selectedMessage.created).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}