import React, { useState, useEffect } from 'react';
import { Camera, Star, Sun, Moon, Menu, X, Salad as Galaxy, Telescope, Contact, User, ChevronRight } from 'lucide-react';
import { pb, type PhotoRecord } from './lib/pocketbase';

function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => {
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const size = Math.random() < 0.5 ? 'small' : Math.random() < 0.8 ? 'medium' : 'large';
        const delay = Math.random() < 0.3 ? 'twinkle-delay-1' : Math.random() < 0.6 ? 'twinkle-delay-2' : '';
        
        return (
          <div
            key={i}
            className={`star star-${size} twinkle ${delay}`}
            style={{ top, left }}
          />
        );
      })}
    </div>
  );
}

function NavigationMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems = [
    { name: 'Galaxie', icon: Galaxy, category: 'galaxy' },
    { name: 'Nébuleuse', icon: Star, category: 'nebula' },
    { name: 'Amas', icon: Star, category: 'cluster' },
    { name: 'Messier', icon: Telescope, category: 'messier' },
    { name: 'IC', icon: Telescope, category: 'ic' },
    { name: 'NGC', icon: Telescope, category: 'ngc' },
    { name: 'SH2', icon: Telescope, category: 'sh2' },
    { name: 'Système Solaire', icon: Sun, category: 'solar_system' },
    { name: 'Lune', icon: Moon, category: 'moon' },
    { name: 'Etoiles', icon: Star, category: 'stars' },
    { name: 'Comète', icon: Star, category: 'comet' },
    { name: 'NightCam', icon: Camera, category: 'nightcam' },
    { name: 'Administrateur', icon: User },
    { name: 'Contact', icon: Contact }
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm transform transition-transform z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.category ? `#${item.category}` : '#'}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={(e) => {
                if (!item.category) e.preventDefault();
                onClose();
              }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photoOfTheDay, setPhotoOfTheDay] = useState<PhotoRecord | null>(null);
  const [recentPhotos, setRecentPhotos] = useState<PhotoRecord[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // Récupérer la photo du jour (la plus récente)
        const latestPhoto = await pb.collection('photos').getList(1, 1, {
          sort: '-created'
        });
        
        if (latestPhoto.items.length > 0) {
          setPhotoOfTheDay(latestPhoto.items[0] as PhotoRecord);
        }

        // Récupérer les photos récentes
        const recent = await pb.collection('photos').getList(1, 2, {
          sort: '-created',
          filter: `id != '${latestPhoto.items[0].id}'`
        });
        
        setRecentPhotos(recent.items as PhotoRecord[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 bg-gray-900/50 hover:bg-gray-900/80 rounded-lg backdrop-blur-sm transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
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
                    alt={photoOfTheDay.title}
                    className="w-full h-[400px] object-cover rounded-lg mb-4"
                  />
                  <p className="text-lg text-gray-300">{photoOfTheDay.title}</p>
                  <p className="text-sm text-gray-400">{photoOfTheDay.description}</p>
                </>
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a"
                  alt="Photo astronomique du jour"
                  className="w-full h-[400px] object-cover rounded-lg mb-4"
                />
              )}
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Moon className="w-6 h-6 text-gray-300" />
              Dernières Captures
            </h2>
            <div className="space-y-4">
              {recentPhotos.length > 0 ? (
                recentPhotos.map((photo) => (
                  <div key={photo.id}>
                    <img
                      src={pb.files.getUrl(photo, photo.image)}
                      alt={photo.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-300">{photo.title} - {new Date(photo.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1435224668334-0f82ec57b605"
                      alt="La Lune"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-300">Phase lunaire - 15 Mars 2024</p>
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45"
                      alt="Les Pléiades"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-300">Les Pléiades - 12 Mars 2024</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href="#galaxy" className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-transform hover:scale-105">
            <Star className="w-8 h-8 mb-4 text-yellow-300" />
            <h2 className="text-2xl font-semibold mb-3">Galaxies</h2>
            <p className="text-gray-300">Collection de photographies de galaxies lointaines et leurs structures spectaculaires.</p>
          </a>

          <a href="#solar_system" className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-transform hover:scale-105">
            <Moon className="w-8 h-8 mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-3">Système Solaire</h2>
            <p className="text-gray-300">Observations détaillées des planètes, de la Lune et du Soleil.</p>
          </a>

          <a href="#nebula" className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg transition-transform hover:scale-105">
            <Sun className="w-8 h-8 mb-4 text-orange-400" />
            <h2 className="text-2xl font-semibold mb-3">Nébuleuses</h2>
            <p className="text-gray-300">Captures des plus belles nébuleuses et leurs couleurs étonnantes.</p>
          </a>
        </div>

        <footer className="mt-16 text-center text-gray-400">
          <p>© 2024 Cosmos Observer - Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
}

export default App;