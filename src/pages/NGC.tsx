import React, { useState, useEffect } from 'react';
import { Telescope, X, Play, Search, Filter } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';
import { StarField } from '../components/StarField';
import { ngcObjects } from '../data/ngcObjects';

interface NGCPhoto {
  id: string;
  latestPhoto: PhotoRecord | null;
  allPhotos: PhotoRecord[];
}

export function NGC() {
  const [ngcPhotos, setNgcPhotos] = useState<{ [key: string]: NGCPhoto }>({});
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<PhotoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(1, 500, {
          filter: 'objet ~ "NGC"',
          sort: '-date',
          requestKey: null, // évite l'autocancellation de PocketBase
        });
        
        const photos = resultList.items as PhotoRecord[];
        const ngcMap: { [key: string]: NGCPhoto } = {};

        // Initialize all NGC objects
        ngcObjects.forEach(obj => {
          ngcMap[obj.id] = {
            id: obj.id,
            latestPhoto: null,
            allPhotos: []
          };
        });

        // Group photos by NGC object
        photos.forEach(photo => {
          const title = photo.titre;
          const ngcMatch = title.match(/NGC\s*(\d+)/i);
          if (ngcMatch) {
            const ngcNumber = ngcMatch[0].replace(/\s+/g, '');
            if (!ngcMap[ngcNumber]) {
              ngcMap[ngcNumber] = {
                id: ngcNumber,
                latestPhoto: null,
                allPhotos: []
              };
            }
            if (!ngcMap[ngcNumber].latestPhoto) {
              ngcMap[ngcNumber].latestPhoto = photo;
            }
            ngcMap[ngcNumber].allPhotos.push(photo);
          }
        });

        setNgcPhotos(ngcMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const filteredObjects = ngcObjects.filter(obj => 
    obj.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedObjects = filteredObjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredObjects.length / itemsPerPage);

  const selectedObjectData = selectedObject 
    ? ngcObjects.find(obj => obj.id === selectedObject)
    : null;
  const selectedObjectPhotos = selectedObject ? ngcPhotos[selectedObject] : null;

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
            Catalogue NGC
          </h1>
          <p className="text-xl text-gray-300">New General Catalogue</p>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Le NGC est l'abréviation de "New General Catalogue of Nebulae and Clusters of Stars", 
            un catalogue astronomique contenant 7840 objets du ciel profond compilé par John Dreyer en 1888.
          </p>
        </header>

        {!selectedObject ? (
          <>
            <div className="mb-8">
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un objet NGC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginatedObjects.map((object) => {
                const photos = ngcPhotos[object.id];
                const hasPhotos = photos && photos.latestPhoto !== null;
                
                return (
                  <button
                    key={object.id}
                    onClick={() => setSelectedObject(object.id)}
                    className={`bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 ${
                      hasPhotos ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="aspect-square relative">
                      {hasPhotos ? (
                        <img
                          src={pb.files.getUrl(photos.latestPhoto!, photos.latestPhoto!.image || '')}
                          alt={object.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Telescope className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2">
                        <span className="text-lg font-bold">{object.id}</span>
                        {hasPhotos && (
                          <span className="text-sm text-blue-400">
                            {photos.allPhotos.length} photo(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="text-gray-400">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedObject(null)}
              className="mb-8 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Retour au catalogue
            </button>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">
                {selectedObjectData?.id} - {selectedObjectData?.name}
              </h2>
              <p className="text-gray-300 mb-8">{selectedObjectData?.description}</p>

              {selectedObjectPhotos?.latestPhoto ? (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-4">Dernière photo</h3>
                  <img
                    src={pb.files.getUrl(selectedObjectPhotos.latestPhoto, selectedObjectPhotos.latestPhoto.image || '')}
                    alt={selectedObjectPhotos.latestPhoto.titre}
                    className="w-full max-h-[70vh] object-contain rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-lg font-medium">{selectedObjectPhotos.latestPhoto.titre}</p>
                    <p className="text-gray-400">
                      {new Date(selectedObjectPhotos.latestPhoto.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-12 text-center text-gray-400">
                  Aucune photo disponible pour cet objet
                </div>
              )}

              {selectedObjectPhotos?.allPhotos.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Archives</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedObjectPhotos.allPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedMedia(photo)}
                        className="group relative aspect-square rounded-lg overflow-hidden"
                      >
                        {photo.mediaType === 'image' ? (
                          <img
                            src={pb.files.getUrl(photo, photo.image || '')}
                            alt={photo.titre}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="relative w-full h-full bg-gray-800">
                            <video
                              src={pb.files.getUrl(photo, photo.video || '')}
                              className="w-full h-full object-cover"
                              poster={pb.files.getUrl(photo, 'thumbnail')}
                            />
                            <Play className="absolute inset-0 m-auto w-12 h-12 text-white opacity-70" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm">
                            {photo.mediaType === 'image' ? 'Voir l\'image' : 'Voir la vidéo'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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