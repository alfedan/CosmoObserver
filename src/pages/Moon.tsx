import React, { useState, useEffect } from 'react';
import { Moon as MoonIcon, X, Play } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';
import { StarField } from '../components/StarField';

export function Moon() {
  const [medias, setMedias] = useState<PhotoRecord[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<PhotoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(1, 100, {
          filter: 'objet ~ "Lune"',
          sort: '-date',
          requestKey: null // évite l'autocancellation de PocketBase
        });
        
        setMedias(resultList.items as PhotoRecord[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des médias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedias();
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
            <MoonIcon className="w-10 h-10 text-gray-300" />
            Photos de la Lune
          </h1>
          <p className="text-xl text-gray-300">Exploration de notre satellite naturel</p>
          <p className="text-xl text-gray-200">La Lune est un astre rocheux en orbite autour de la planète Terre. Elle a probablement été créée par la collision entre un très gros astéroïde (de la taille de Mars) et la Terre il y a 4,5 milliards d'années. Les débris de l'impact se sont agglomérés pour créer notre satellite naturel, la Lune.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medias.map((media) => (
            <button
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              className="group bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="aspect-square relative">
                {media.mediaType === 'image' ? (
                  <img
                    src={pb.files.getUrl(media, media.image || '')}
                    alt={media.titre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gray-800">
                    <video
                      src={pb.files.getUrl(media, media.video || '')}
                      className="w-full h-full object-cover"
                      poster={pb.files.getUrl(media, 'thumbnail')}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-70" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">
                    {media.mediaType === 'image' ? 'Voir l\'image' : 'Voir la vidéo'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{media.titre}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(media.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>

        {selectedMedia && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full p-4 md:p-8 flex flex-col items-center justify-center">
              {selectedMedia.mediaType === 'image' ? (
                <img
                  src={pb.files.getUrl(selectedMedia, selectedMedia.image || '')}
                  alt={selectedMedia.titre}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={pb.files.getUrl(selectedMedia, selectedMedia.video || '')}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
              )}
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold mb-2">{selectedMedia.titre}</h2>
                <p className="text-gray-300">{selectedMedia.description}</p>
                {selectedMedia.objet && selectedMedia.objet.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Objets : {Array.isArray(selectedMedia.objet)
                      ? selectedMedia.objet.join(', ')
                      : selectedMedia.objet}
                  </p>
                )}
                {selectedMedia.instrument && (
                  <p className="text-sm text-gray-400 mt-2">
                    Équipement : {selectedMedia.instrument}
                  </p>
                )}
                {selectedMedia.camera && (
                  <p className="text-sm text-gray-400">
                    Appareil : {selectedMedia.camera}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Date : {new Date(selectedMedia.date).toLocaleDateString('fr-FR', {
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