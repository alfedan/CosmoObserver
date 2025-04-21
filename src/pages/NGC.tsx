import React, { useState, useEffect } from 'react';
import { Telescope as Telescope, X } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';
import { StarField } from '../components/StarField';

export function NGC() {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(1, 100, {
          filter: 'objet ~ "NGC"',
          sort: '-date',
        });
        
        setPhotos(resultList.items as PhotoRecord[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Telescope className="w-10 h-10 text-yellow-300" />
            Photos astronomique NGC
          </h1>
          <p className="text-xl text-gray-300">New General Catalogue</p>
          <p className="text-xl text-gray-200">NGC est l'abréviation anglaise de "Nouveau                     catalogue général de nébuleuses et d'amas d'étoiles". Il contient 7 840 objets du ciel             profond recensés par John Dreyer jusqu'en 1888.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="aspect-square relative">
                <img
                  src={pb.files.getUrl(photo, photo.image)}
                  alt={photo.titre}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">Cliquez pour agrandir</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{photo.titre}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(photo.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>

        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full p-4 md:p-8 flex flex-col items-center justify-center">
              <img
                src={pb.files.getUrl(selectedPhoto, selectedPhoto.image)}
                alt={selectedPhoto.titre}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold mb-2">{selectedPhoto.titre}</h2>
                <p className="text-gray-300">{selectedPhoto.description}</p>
                {selectedPhoto.objet && selectedPhoto.objet.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                  Objets : {Array.isArray(selectedPhoto.objet)
                  ? selectedPhoto.objet.join(', ')
                  : selectedPhoto.objet}
                </p>
                )}

                {selectedPhoto.instrument && (
                  <p className="text-sm text-gray-400 mt-2">
                    Équipement : {selectedPhoto.instrument}
                  </p>
                )}
                {selectedPhoto.camera && (
                  <p className="text-sm text-gray-400">
                    Appareil : {selectedPhoto.camera}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Date : {new Date(selectedPhoto.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}