import React from 'react';
import { Info as InfoIcon } from 'lucide-react';
import { StarField } from '../components/StarField';
import settings from '../config/settings';

export function Info() {
  // Calculate the year for the light pollution map
  const currentYear = new Date().getFullYear();
  const mapYear = currentYear - 1;

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <InfoIcon className="w-10 h-10 text-blue-400" />
            Informations Utiles
          </h1>
          <p className="text-xl text-gray-300">Cartes et données pour planifier vos observations</p>
        </header>

        <div className="space-y-12">
          {/* Carte du ciel */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-semibold">Carte du Ciel en Direct</h2>
              <p className="text-gray-400 mt-2">
                Visualisez le ciel en temps réel au-dessus de {settings.city}
              </p>
            </div>
            <div className="aspect-[4/3] w-full">
              <iframe
                src={`https://www.stelvision.com/carte-ciel/visu_carte.php?stelmarq=C&mode_affichage=normal&req=stel&date_j_carte=28&date_m_carte=4&date_a_carte=2025&heure_m=31&heure_h=0&longi=-0.9500000000000&lat=45.9000000000000&lieu=%C3%89chillais&tzone=2&dst_offset=0&taille_carte=848&fond_r=255&fond_v=255&fond_b=255&lang=fr`}
                className="w-full h-full border-0"
                title="Carte du ciel"
                loading="lazy"
              />
            </div>
          </section>

          {/* Carte pollution lumineuse */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-semibold">Carte de Pollution Lumineuse {mapYear}</h2>
              <p className="text-gray-400 mt-2">
                Identifiez les meilleurs sites d'observation en fonction de la pollution lumineuse
              </p>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img src={`https://djlorenz.github.io/astronomy/lp${mapYear}/Europe${mapYear}B.png`}
                alt={`Carte de pollution lumineuse ${mapYear}`}
                className="w-full h-full object-cover hover:scale-150 transition-transform duration-300 cursor-move"
              />
            </div>
            <div className="p-4 bg-gray-800/50 text-sm text-gray-400">
              Source: Light pollution maps by David Lorenz :  
            <a
            href="https://djlorenz.github.io/astronomy/lp/overlay/dark.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
            >
             (djlorenz.github.io)
          </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}