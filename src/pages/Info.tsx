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
              <h2 className="text-2xl font-semibold">Carte du Ciel</h2>
              <p className="text-gray-400 mt-2">
                Visualisez le ciel en temps réel.
              </p>
            </div>
            <div className="aspect-[4/3] w-full">
              <iframe
                width="1500" 
                height="1050" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0" 
                src={`https://virtualsky.lco.global/embed/index.html?longitude=${settings.longitude}&latitude=${settings.latitude}&projection=polar&meteorshowers=true&live=true&constellations=true&constellationlabels=true&az=2.711825981875677`}
                allowTransparency="true"
              />
            </div>
          </section>         
          {/* Stéllarium */}
          <section className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-semibold">Planétarium</h2>
              <p className="text-gray-400 mt-2">
                Visualisez le ciel en temps décalé.
              </p>
            </div>
            <div className="aspect-[4/3] w-full">
              <iframe
                src={`https://stellarium-web.org/`}
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
              <iframe
                src={`https://djlorenz.github.io/astronomy/lp/overlay/dark.html`}
                className="w-full h-full border-0"
                title="Carte du ciel"
                loading="lazy"
              />
            </div>
            <div className="p-4 bg-gray-800/50 text-sm text-gray-400">
              Source: Light pollution maps by David Lorenz : djlorenz.github.io
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}