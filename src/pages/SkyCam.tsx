import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, ChevronRight, RefreshCw, Play, X } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';
import { StarField } from '../components/StarField';
import settings from '../config/settings';

const IMAGES_PER_PAGE = 16;

export function SkyCam() {
  const [medias, setMedias] = useState<PhotoRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedMedia, setSelectedMedia] = useState<PhotoRecord | null>(null);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(currentPage, IMAGES_PER_PAGE, {
          filter: 'objet ~ "SkyCam"',
          sort: '-date',
        });
        
        setMedias(resultList.items as PhotoRecord[]);
        setTotalPages(Math.ceil(resultList.totalItems / IMAGES_PER_PAGE));
      } catch (error) {
        console.error('Erreur lors de la récupération des médias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedias();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

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
            <Camera className="w-10 h-10 text-blue-400" />
            SkyCam
          </h1>
          <p className="text-xl text-gray-300">Surveillance du ciel en temps réel</p>
        </header>

        <div className="mb-16 bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Caméra en Direct</h2>
            <button 
              onClick={handleRefresh}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Actualiser
            </button>
          </div>
          <div className="aspect-video w-full relative">
            <iframe
              src={settings.skycam}
              className="w-full h-full"
              key={lastRefresh.toISOString()}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Archives Photos</h2>
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700'
                    } transition-colors`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
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