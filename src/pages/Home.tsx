import React, { useState, useEffect } from 'react';
import { Camera, Star, Sun, Moon } from 'lucide-react';
import { pb, type PhotoRecord } from '../lib/pocketbase';

export function HomePage({ onPageChange }: { onPageChange: (page: string) => void }) {
  const [photoOfTheDay, setPhotoOfTheDay] = useState<PhotoRecord | null>(null);
  const [recentPhotos, setRecentPhotos] = useState<PhotoRecord[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchPhotos() {
      try {
        const latestPhoto = await pb.collection('photos_astro').getList(1, 1, {
          sort: '-date',
          requestKey: null, // évite l'autocancellation de PocketBase
        });

        if (latestPhoto.items.length > 0) {
          setPhotoOfTheDay(latestPhoto.items[0] as PhotoRecord);
        }

        const recent = await pb.collection('photos_astro').getList(1, 2, {
          sort: '-date',
          filter: `id != '${latestPhoto.items[0].id}'`,
          requestKey: null,
        });

        setRecentPhotos(recent.items as PhotoRecord[]);
      } catch (error) {
        if ((error as any)?.name !== 'AbortError') {
          console.error('Erreur lors de la récupération des photos:', error);
        }
      }
    }

    fetchPhotos();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Camera className="w-10 h-10 text-blue-400" />
          <h1 className="text-4xl md:text-6xl font-bold">Cosmos Observer</h1>
          <Star className="w-10 h-10 text-yellow-300" />
        </div>
        <p className="text-xl text-gray-300">Exploration photographique de l'univers</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="col-span-full lg:col-span-2">
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg h-full">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-400" />
              Photo du Jour
            </h2>
            {photoOfTheDay ? (
              <>
                <img
                  src={pb.files.getUrl(photoOfTheDay, photoOfTheDay.image)}
                  alt={photoOfTheDay.titre}
                  className="w-full h-[400px] object-cover rounded-lg mb-4"
                />
                <p className="text-lg text-gray-300">{photoOfTheDay.titre}</p>
                <p className="text-sm text-gray-400">{photoOfTheDay.description}</p>
                {photoOfTheDay.instrument && (
                  <p className="text-sm text-gray-400 mt-2">Instrument : {photoOfTheDay.instrument}</p>
                )}
                {photoOfTheDay.camera && (
                  <p className="text-sm text-gray-400">Appareil : {photoOfTheDay.camera}</p>
                )}
              </>
            ) : (
              <div className="w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Aucune photo disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Moon className="w-6 h-6 text-gray-300" />
            Dernières Captures
          </h2>
          <div className="space-y-4">
            {recentPhotos.map((photo) => (
              <div key={photo.id}>
                <img
                  src={pb.files.getUrl(photo, photo.image)}
                  alt={photo.titre}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-300">{photo.titre}</p>
                <p className="text-xs text-gray-400">
                  {new Date(photo.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {photo.objet && (
                  <p className="text-xs text-gray-400 mt-1">
                    Objets : {Array.isArray(photo.objet) ? photo.objet.join(', ') : photo.objet}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button 
          onClick={() => onPageChange('Weather')}
          className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-transform hover:scale-105"
        >
          <Star className="w-8 h-8 mb-4 text-yellow-300 mx-auto" />
          <h2 className="text-2xl font-semibold mb-3">Météo</h2>
          <p className="text-gray-300">La météo de la nuit pour planifier les observations</p>
        </button>

        <button 
          onClick={() => onPageChange('Observation')}
          className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-transform hover:scale-105"
        >
          <Moon className="w-8 h-8 mb-4 text-gray-300 mx-auto" />
          <h2 className="text-2xl font-semibold mb-3">Observation</h2>
          <p className="text-gray-300">Que regarder dans le ciel nocturne ?</p>
        </button>

        <button 
          onClick={() => onPageChange('info')}
          className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-transform hover:scale-105"
        >
          <Sun className="w-8 h-8 mb-4 text-orange-400 mx-auto" />
          <h2 className="text-2xl font-semibold mb-3">Informations</h2>
          <p className="text-gray-300">Les informations utiles pour planifier votre soirée.</p>
        </button>
      </div>

      <footer className="mt-16 text-center text-gray-400">
        <p>
          © 2025 Cosmos Observer by{' '}
          <a
            href="https://github.com/alfedan/CosmoObserver"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Alfedan
          </a>{' '}
          - Tous droits réservés
        </p>
      </footer>
    </div>
  );
}
