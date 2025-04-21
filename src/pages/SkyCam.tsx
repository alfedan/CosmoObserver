import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';
import { StarField } from '../components/StarField';

const IMAGES_PER_PAGE = 16;

export function SkyCam() {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(currentPage, IMAGES_PER_PAGE, {
          filter: 'objet ~ "SkyCam"',
          sort: '-date',
        });
        
        setPhotos(resultList.items as PhotoRecord[]);
        setTotalPages(Math.ceil(resultList.totalItems / IMAGES_PER_PAGE));
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
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
              src="http://alfedan.freeboxos.fr:1984/public.php"
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
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={pb.files.getUrl(photo, photo.image)}
                    alt={photo.titre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
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
                  {photo.instrument && (
                    <p className="text-xs text-gray-400">Instrument : {photo.instrument}</p>
                  )}
                  {photo.camera && (
                    <p className="text-xs text-gray-400">Appareil : {photo.camera}</p>
                  )}
                </div>
              </div>
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
      </div>
    </div>
  );
}