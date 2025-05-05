import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Play, Filter } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';
import { StarField } from '../components/StarField';

interface SearchFilters {
  title: string;
  type: string[];
  dateFrom: string;
  dateTo: string;
  instrument: string;
  camera: string;
}

export function Search() {
  const [medias, setMedias] = useState<PhotoRecord[]>([]);
  const [filteredMedias, setFilteredMedias] = useState<PhotoRecord[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<PhotoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    instruments: string[];
    cameras: string[];
  }>({
    instruments: [],
    cameras: [],
  });

  const [filters, setFilters] = useState<SearchFilters>({
    title: '',
    type: [],
    dateFrom: '',
    dateTo: '',
    instrument: '',
    camera: '',
  });

  const itemsPerPage = 100;

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const resultList = await pb.collection('photos_astro').getList(1, 1000, {
          sort: '-date',
          requestKey: null
        });
        
        const items = resultList.items as PhotoRecord[];
        setMedias(items);

        // Extract unique instruments and cameras for suggestions
        const uniqueInstruments = [...new Set(items.map(item => item.instrument).filter(Boolean))];
        const uniqueCameras = [...new Set(items.map(item => item.camera).filter(Boolean))];

        setSuggestions({
          instruments: uniqueInstruments,
          cameras: uniqueCameras,
        });

        setFilteredMedias(items);
      } catch (error) {
        console.error('Erreur lors de la récupération des médias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedias();
  }, []);

  useEffect(() => {
    const filtered = medias.filter(media => {
      const matchesTitle = media.titre.toLowerCase().includes(filters.title.toLowerCase());
      const matchesType = filters.type.length === 0 || filters.type.some(type => 
        Array.isArray(media.objet) ? media.objet.includes(type) : media.objet === type
      );
      const matchesDateFrom = !filters.dateFrom || new Date(media.date) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(media.date) <= new Date(filters.dateTo);
      const matchesInstrument = !filters.instrument || 
        media.instrument?.toLowerCase().includes(filters.instrument.toLowerCase());
      const matchesCamera = !filters.camera || 
        media.camera?.toLowerCase().includes(filters.camera.toLowerCase());

      return matchesTitle && matchesType && matchesDateFrom && matchesDateTo && 
             matchesInstrument && matchesCamera;
    });

    setFilteredMedias(filtered);
    setCurrentPage(1);
  }, [filters, medias]);

  const paginatedMedias = filteredMedias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMedias.length / itemsPerPage);

  const objectTypes = [
    'Galaxie', 'Nébuleuse', 'Planète', 'Amas', 'Lune', 'Soleil', 
    'Etoile', 'Comète', 'SkyCam', 'Autre', 'NGC', 'IC', 'SH2', 'M'
  ];

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
            <SearchIcon className="w-10 h-10 text-blue-400" />
            Recherche Avancée
          </h1>
          <p className="text-xl text-gray-300">
            {filteredMedias.length} résultat(s) trouvé(s)
          </p>
        </header>

        <div className="mb-8">
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre..."
                  value={filters.title}
                  onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filtres
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Type d'objet</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {objectTypes.map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                type: [...prev.type, type]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                type: prev.type.filter(t => t !== type)
                              }));
                            }
                          }}
                          className="rounded border-gray-600"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Période</label>
                  <div className="space-y-4">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    />
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Instrument</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.instrument}
                      onChange={(e) => setFilters(prev => ({ ...prev, instrument: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                      placeholder="Rechercher un instrument..."
                    />
                    {filters.instrument && suggestions.instruments.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
                        {suggestions.instruments
                          .filter(i => i.toLowerCase().includes(filters.instrument.toLowerCase()))
                          .map((instrument, idx) => (
                            <button
                              key={idx}
                              onClick={() => setFilters(prev => ({ ...prev, instrument }))}
                              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                            >
                              {instrument}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Appareil photo</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.camera}
                      onChange={(e) => setFilters(prev => ({ ...prev, camera: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                      placeholder="Rechercher un appareil..."
                    />
                    {filters.camera && suggestions.cameras.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
                        {suggestions.cameras
                          .filter(c => c.toLowerCase().includes(filters.camera.toLowerCase()))
                          .map((camera, idx) => (
                            <button
                              key={idx}
                              onClick={() => setFilters(prev => ({ ...prev, camera }))}
                              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                            >
                              {camera}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <button
                    onClick={() => setFilters({
                      title: '',
                      type: [],
                      dateFrom: '',
                      dateTo: '',
                      instrument: '',
                      camera: '',
                    })}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedMedias.map((media) => (
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