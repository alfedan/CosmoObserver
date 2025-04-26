import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Calendar, Camera, Film, X } from 'lucide-react';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (formData.mediaFile) {
      const url = URL.createObjectURL(formData.mediaFile);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.mediaFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'objet') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else if (name === 'mediaType') {
      setFormData(prev => ({
        ...prev,
        mediaType: value as 'image' | 'video',
        mediaFile: null
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
    if (file && file.size > 100 * 1024 * 1024) {
      toast.error('❌ Le fichier dépasse 100Mo.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      mediaFile: file
    }));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      mediaFile: null
    }));
    const input = document.getElementById('mediaFile') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
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

      if (formData.mediaType === 'image') {
        formDataToSend.append('image', formData.mediaFile);
      } else {
        formDataToSend.append('video', formData.mediaFile);
      }

      await pb.collection('photos_astro').create(formDataToSend);

      await pb.collection('admin_logs').create({
        action: 'Téléchargement média',
        status: true,
        details: `${formData.mediaType === 'image' ? 'Photo' : 'Vidéo'} "${formData.titre}" téléchargée`
      });

      toast.success(`✅ ${formData.mediaType === 'image' ? 'Photo' : 'Vidéo'} téléchargée avec succès !`);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setFormData({
        titre: '',
        description: '',
        objet: [],
        date: new Date().toISOString().split('T')[0],
        instrument: '',
        camera: '',
        mediaType: formData.mediaType,
        mediaFile: null
      });

      const fileInput = document.getElementById('mediaFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`❌ Une erreur est survenue lors du téléchargement de ${formData.mediaType === 'image' ? 'l\'image' : 'la vidéo'}`);
      await pb.collection('admin_logs').create({
        action: 'Téléchargement média',
        status: false,
        details: `Erreur lors du téléchargement de ${formData.mediaType === 'image' ? 'la photo' : 'la vidéo'} "${formData.titre}"`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const objetOptions = [
    'Galaxie', 'Nébuleuse', 'Planète', 'Amas', 'Lune', 'Soleil', 'Étoile', 'Comète', 'SkyCam', 'Autre', 'NGC', 'IC', 'SH2', 'M'
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
          {/* Titre */}
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

          {/* Objet */}
          <div>
            <label className="block mb-1 font-medium">Type d'objet</label>
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
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Maintenez Ctrl (ou Cmd) pour plusieurs sélections
            </p>
          </div>

          {/* Date */}
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

          {/* Type de media */}
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
                />
                <Camera className="w-5 h-5" />
                Image
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="video"
                  checked={formData.mediaType === 'video'}
                  onChange={handleChange}
                />
                <Film className="w-5 h-5" />
                Vidéo
              </label>
            </div>
          </div>

          {/* Fichier */}
          <div className="col-span-1">
            <label className="block mb-1 font-medium">Fichier</label>
            <p className="text-xs text-gray-400 mt-1">Fichier ≤ 100Mo</p>
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
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
              >
                {formData.mediaFile ? (
                  <>
                    <X className="w-5 h-5" /> {formData.mediaFile.name}
                  </>
                ) : (
                  <>
                    {formData.mediaType === 'image' ? <Camera className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                    Sélectionner un fichier
                  </>
                )}
              </label>
            </div>

            {formData.mediaFile && (
              <p className="text-xs text-gray-400 mt-1">
                Poids : {(formData.mediaFile.size / (1024 * 1024)).toFixed(2)} Mo
              </p>
            )}
          </div>

          {/* Description */}
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

          {/* Instrument */}
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

          {/* Appareil Photo */}
          <div>
            <label className="block mb-1 font-medium">Caméra/Appareil photo</label>
            <input
              type="text"
              name="camera"
              value={formData.camera}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4 space-y-2">
            {formData.mediaType === 'image' ? (
              <img
                src={previewUrl}
                alt="Aperçu"
                className="max-w-full max-h-80 object-contain rounded-lg border border-gray-700 transition-all duration-500 ease-in-out hover:scale-105"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="max-w-full max-h-80 rounded-lg border border-gray-700 transition-all duration-500 ease-in-out hover:scale-105"
              />
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Supprimer le fichier sélectionné
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
              Téléchargement...
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
