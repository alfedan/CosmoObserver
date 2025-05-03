import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Calendar, Camera, X, Search } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PhotoRecord {
  id: string;
  created: string;
  titre: string;
  description: string;
  objet: string[];
  date: string;
  instrument: string;
  camera: string;
  mediaType: 'image' | 'video';
  image?: string;
  video?: string;
}

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

export function AdminModifyPhotos({ onBack }: { onBack: () => void }) {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(1, 100, {
          sort: '-created'
        });
        setPhotos(resultList.items as PhotoRecord[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
        toast.error('❌ Erreur lors du chargement des photos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handlePhotoSelect = (photo: PhotoRecord) => {
    setSelectedPhoto(photo);
    setFormData({
      titre: photo.titre,
      description: photo.description,
      objet: photo.objet,
      date: photo.date,
      instrument: photo.instrument || '',
      camera: photo.camera || '',
      mediaType: photo.mediaType,
      mediaFile: null
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'objet') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto) return;

    setIsUpdating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('objet', JSON.stringify(formData.objet));
      formDataToSend.append('date', formData.date);
      formDataToSend.append('instrument', formData.instrument);
      formDataToSend.append('camera', formData.camera);
      formDataToSend.append('mediaType', formData.mediaType);

      if (formData.mediaFile) {
        if (formData.mediaType === 'image') {
          formDataToSend.append('image', formData.mediaFile);
        } else {
          formDataToSend.append('video', formData.mediaFile);
        }
      }

      await pb.collection('photos_astro').update(selectedPhoto.id, formDataToSend);

      await pb.collection('admin_logs').create({
        action: 'Modification média',
        status: true,
        details: `${formData.mediaType === 'image' ? 'Photo' : 'Vidéo'} "${formData.titre}" modifiée`
      });

      toast.success('✅ Média modifié avec succès !');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Refresh photos list
      const resultList = await pb.collection('photos_astro').getList(1, 100, {
        sort: '-created'
      });
      setPhotos(resultList.items as PhotoRecord[]);
      setSelectedPhoto(null);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('❌ Une erreur est survenue lors de la modification');
      
      await pb.collection('admin_logs').create({
        action: 'Modification média',
        status: false,
        details: `Erreur lors de la modification de "${formData.titre}"`
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const objetOptions = [
    'Galaxie', 'Nébuleuse', 'Planète', 'Amas', 'Lune', 'Soleil', 'Etoile', 'Comète', 'SkyCam', 'Autre', 'NGC', 'IC', 'SH2', 'M'
  ];

  const filteredPhotos = photos.filter(photo =>
    photo.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className="text-2xl font-semibold">Modification des photos</h2>
      </div>

      {!selectedPhoto ? (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une photo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handlePhotoSelect(photo)}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors"
              >
                <div className="aspect-square relative">
                  {photo.mediaType === 'image' ? (
                    <img
                      src={pb.files.getUrl(photo, photo.image || '')}
                      alt={photo.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={pb.files.getUrl(photo, photo.video || '')}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1">{photo.titre}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(photo.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Modifier {selectedPhoto.titre}</h3>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
              </div>

              <div>
                <label className="block mb-1 font-medium">Date de prise</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Nouveau fichier (optionnel)</label>
                <input
                  type="file"
                  accept={formData.mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
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
                <label className="block mb-1 font-medium">Caméra/Appareil photo</label>
                <input
                  type="text"
                  name="camera"
                  value={formData.camera}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
                />
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
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h4 className="font-medium mb-4">Aperçu actuel</h4>
            {selectedPhoto.mediaType === 'image' ? (
              <img
                src={pb.files.getUrl(selectedPhoto, selectedPhoto.image || '')}
                alt={selectedPhoto.titre}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            ) : (
              <video
                src={pb.files.getUrl(selectedPhoto, selectedPhoto.video || '')}
                controls
                className="max-w-full max-h-96 rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}