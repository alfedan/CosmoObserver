import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Calendar, Camera, User } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { toast } from 'sonner';

interface Photo {
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

export function AdminDeletePhotos({ onBack }: { onBack: () => void }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(1, 50, {
          sort: '-created',
          requestKey: null // évite l'autocancellation de PocketBase
        });
        setPhotos(resultList.items as Photo[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
        toast.error('❌ Erreur lors du chargement des photos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleCheckboxChange = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPhotos(new Set(photos.map(photo => photo.id)));
    } else {
      setSelectedPhotos(new Set());
    }
  };

  const handleDelete = async () => {
    setShowConfirmDialog(false);
    
    if (selectedPhotos.size === 0) {
      toast.error('❌ Aucune photo sélectionnée');
      return;
    }

    try {
      const deletePromises = Array.from(selectedPhotos).map(id =>
        pb.collection('photos_astro').delete(id)
      );
      
      await Promise.all(deletePromises);
      
      setPhotos(prevPhotos => 
        prevPhotos.filter(photo => !selectedPhotos.has(photo.id))
      );
      
      setSelectedPhotos(new Set());
      toast.success(`✅ ${selectedPhotos.size} photo(s) supprimée(s)`);
      
      await pb.collection('admin_logs').create({
        action: 'Suppression de photos',
        status: true,
        details: `${selectedPhotos.size} photo(s) supprimée(s)`
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression des photos');
      
      await pb.collection('admin_logs').create({
        action: 'Suppression de photos',
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
        <h2 className="text-2xl font-semibold">Suppression des photos</h2>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedPhotos.size === photos.length}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-gray-600"
            />
            <span className="font-medium">
              {selectedPhotos.size} photo(s) sélectionnée(s)
            </span>
          </div>
          
          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={selectedPhotos.size === 0}
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Titre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Objets</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Aperçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {photos.map((photo) => (
                <tr key={photo.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPhotos.has(photo.id)}
                      onChange={() => handleCheckboxChange(photo.id)}
                      className="w-5 h-5 rounded border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(photo.created).toLocaleDateString('fr-FR', {
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
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>{photo.titre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {photo.mediaType === 'image' ? 'Image' : 'Vidéo'}
                  </td>
                  <td className="px-6 py-4">
                    {Array.isArray(photo.objet) ? photo.objet.join(', ') : photo.objet}
                  </td>
                  <td className="px-6 py-4">
                    {photo.mediaType === 'image' ? (
                      <img
                        src={pb.files.getUrl(photo, photo.image || '')}
                        alt={photo.titre}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={pb.files.getUrl(photo, photo.video || '')}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
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
              Êtes-vous sûr de vouloir supprimer {selectedPhotos.size} photo(s) ? 
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