import React, { useState } from 'react';
import { ArrowLeft, Upload, Calendar, Camera, Film } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface FormData {
  titre: string;
  description: string;
  objet: string[];
  date: string;
  instrument: string;
  camera: string;
  mediaType: 'image' | 'video';
  mediaFile: File | null;
}

export function AdminUploadPhotos({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    titre: '',
    description: '',
    objet: [],
    date: new Date().toISOString().split('T')[0],
    instrument: '',
    camera: '',
    mediaType: 'image',
    mediaFile: null
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'objet') {
      // Pour la sélection multiple, nous devons extraire tous les éléments sélectionnés
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else if (name === 'mediaType') {
      setFormData(prev => ({
        ...prev,
        mediaType: value as 'image' | 'video',
        mediaFile: null // Réinitialiser le fichier lors du changement de type
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      mediaFile: file
    }));
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mediaFile) {
      toast.error(`❌ Veuillez sélectionner un${formData.mediaType === 'image' ? 'e image' : 'e vidéo'}`);
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('objet', JSON.stringify(formData.objet));
      formDataToSend.append('date', formData.date);
      formDataToSend.append('instrument', formData.instrument);
      formDataToSend.append('camera', formData.camera);
      formDataToSend.append('mediaType', formData.mediaType);
      
      // Utiliser le même nom de champ dans Pocketbase, mais en envoyant soit dans 'image' soit dans 'video'
      if (formData.mediaType === 'image') {
        formDataToSend.append('image', formData.mediaFile);
      } else {
        formDataToSend.append('video', formData.mediaFile);
      }

      // Utiliser une seule collection pour les deux types de médias
      await pb.collection('medias_astro').create(formDataToSend);

      toast.success(`✅ ${formData.mediaType === 'image' ? 'Photo' : 'Vidéo'} téléchargée avec succès !`);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Réinitialiser le formulaire
      setFormData({
        titre: '',
        description: '',
        objet: [],
        date: new Date().toISOString().split('T')[0],
        instrument: '',
        camera: '',
        mediaType: formData.mediaType, // Conserver le type de média actuel
        mediaFile: null
      });

      // Réinitialiser l'input file
      const fileInput = document.getElementById('mediaFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`❌ Une erreur est survenue lors du téléchargement de ${formData.mediaType === 'image' ? 'l\'image' : 'la vidéo'}`);
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
    { value: 'Autre', label: 'Autre' },
    { value: 'NGC', label: 'NGC' },
    { value: 'IC', label: 'IC' },
    { value: 'SH2', label: 'SH2' },
    { value: 'M', label: 'M' }
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
        <h2 className="text-2xl font-semibold">Téléchargement de média</h2>
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
            <label className="block mb-1 font-medium">Type d'objet (sélection multiple possible)</label>
            <select
              name="objet"
              multiple
              value={formData.objet}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              size={5}
              required
            >
              {objetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs objets
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Date de prise</label>
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
            <label className="block mb-1 font-medium">Type de média</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={formData.mediaType === 'image'}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <Camera className="w-5 h-5" />
                <span>Image</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={formData.mediaType === 'video'}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <Film className="w-5 h-5" />
                <span>Vidéo</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Fichier</label>
            <div className="relative">
              <input
                type="file"
                id="mediaFile"
                accept={formData.mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label
                htmlFor="mediaFile"
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
              >
                {formData.mediaType === 'image' ? (
                  <Camera className="w-5 h-5" />
                ) : (
                  <Film className="w-5 h-5" />
                )}
                {formData.mediaFile ? formData.mediaFile.name : `Sélectionner un${formData.mediaType === 'image' ? 'e image' : 'e vidéo'}`}
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
            <label className="block mb-1 font-medium">Appareil photo/caméra</label>
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
              Télécharger {formData.mediaType === 'image' ? 'l\'image' : 'la vidéo'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}