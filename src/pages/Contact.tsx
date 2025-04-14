import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { StarField } from '../components/StarField';
import { pb } from '../lib/pocketbase';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    captcha: '',
    realCaptcha: Math.floor(Math.random() * 9000 + 1000).toString(),
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.captcha !== formData.realCaptcha) {
      setStatus({
        type: 'error',
        message: 'Le code de vérification est incorrect.'
      });
      return;
    }

    try {
      await pb.collection('messages').create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to: 'alfedan@free.fr',
      });

      setStatus({
        type: 'success',
        message: 'Votre message a été envoyé avec succès!'
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        captcha: '',
        realCaptcha: Math.floor(Math.random() * 9000 + 1000).toString(),
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Une erreur est survenue lors de l\'envoi du message.'
      });
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-400" />
              Contact
            </h1>

            {status.type && (
              <div className={`mb-6 p-4 rounded-lg ${
                status.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Demande
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="captcha" className="block text-sm font-medium mb-2">
                  Code de vérification: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{formData.realCaptcha}</span>
                </label>
                <input
                  type="text"
                  id="captcha"
                  required
                  value={formData.captcha}
                  onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le code ci-dessus"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}