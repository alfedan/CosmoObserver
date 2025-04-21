import React, { useState } from 'react';
import { ArrowLeft, Upload, Calendar, Camera } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface FormData {
  titre: string;
  description: string;
  objet: string;
  date: string;
  instrument: string;
  camera: string;
  image: File | null;
}

export function AdminUploadPhotos({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    titre: '',
    description: '',
    objet: '',
    date: new Date().toISOString().split('T')[0],
    instrument: '',
    camera: '',
    image: null
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('❌ Veuillez sélectionner une image');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('objet', formData.objet);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('instrument', formData.instrument);
      formDataToSend.append('camera', formData.camera);
      formDataToSend.append('image', formData.image);

      await pb.collection('photos_astro').create(formDataToSend);

      toast.success('✅ Photo téléchargée avec succès !');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Réinitialiser le formulaire
      setFormData({
        titre: '',
        description: '',
        objet: '',
        date: new Date().toISOString().split('T')[0],
        instrument: '',
        camera: '',
        image: null
      });

      // Réinitialiser l'input file
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Une erreur est survenue lors du téléchargement');
    } finally {
      setIsLoading(false);
    }
  };

  const objetOptions = [
    { value: 'Galaxie', label: 'Galaxie' },
    { value: 'Nébuleuse', label: 'Nébuleuse' },
    { value: 'Planète', label: 'Planète' },
    { value: 'Amas', label: 'Amas' },
    { value: 'Lune', label: 'Lune' },
    { value: 'Soleil', label: 'Soleil' },
    { value: 'Etoile', label: 'Étoile' },
    { value: 'Comète', label: 'Comète' },
    { value: 'SkyCam', label: 'SkyCam' },
    { value: 'Autre', label: 'Autre' }
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold">Téléchargement de photo</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Titre</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Type d'objet</label>
            <select
              name="objet"
              value={formData.objet}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            >
              <option value="">Sélectionner un type</option>
              {objetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Date de la photo</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Image</label>
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
              <label
                htmlFor="image"
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                {formData.image ? formData.image.name : 'Sélectionner une image'}
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Instrument</label>
            <input
              type="text"
              name="instrument"
              value={formData.instrument}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Appareil photo</label>
            <input
              type="text"
              name="camera"
              value={formData.camera}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
              Téléchargement en cours...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Télécharger la photo
            </>
          )}
        </button>
      </form>
    </div>
  );
}