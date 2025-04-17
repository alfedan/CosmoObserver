import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { StarField } from '../components/StarField';
import { pb } from '../lib/pocketbase';
import confetti from 'canvas-confetti';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    captcha: '',
    realCaptcha: Math.floor(Math.random() * 9000 + 1000).toString(),
  });

  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fonction manquante
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.captcha !== formData.realCaptcha) {
      toast.error('❌ Le code de vérification est incorrect.');
      return;
    }

    setIsLoading(true);

    try {
      await pb.collection('messages').create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to: 'alfedan@free.fr',
      });

      toast.success('✅ Votre message a été envoyé avec succès !');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        captcha: '',
        realCaptcha: Math.floor(Math.random() * 9000 + 1000).toString(),
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Une erreur est survenue lors de l’envoi du message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-400" />
              Contact
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                  rows={5}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Code de vérification : <strong>{formData.realCaptcha}</strong>
                </label>
                <input
                  type="text"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isLoading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
