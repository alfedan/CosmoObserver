import React, { useState } from 'react';
import { Camera, Star, Sun, Moon, Menu, X, Salad as GalaxyIcon, Telescope, Contact, User, ChevronRight, Home, ChevronDown, Search, Trophy } from 'lucide-react';
import { pb, type PhotoRecord } from './lib/pocketbase';
import { Contact as ContactPage } from './pages/Contact';
import { SkyCam } from './pages/SkyCam';
import { StarField } from './components/StarField';
import { Toaster } from 'sonner';
import { HomePage } from './pages/Home';
import { Moon as MoonPage } from './pages/Moon';
import { Admin } from './pages/Admin';
import { Other } from './pages/Other';
import { Comete } from './pages/Comete';
import { Stars } from './pages/Stars';
import { SH2 } from './pages/SH2';
import { NGC } from './pages/NGC';
import { IC } from './pages/IC';
import { Galaxy } from './pages/Galaxy';
import { Nebula } from './pages/Nebula';
import { Amas } from './pages/Amas';
import { SolarSystem } from './pages/SolarSystem';
import { Messier } from './pages/Messier';
import { ObservationPage } from './pages/ObservationPage';
import { Weather } from './pages/Weather';
import { Info } from './pages/Info';
import { Search as SearchPage } from './pages/Search';
import { RecentGallery } from './pages/RecentGallery';
import { Rewards } from './pages/Rewards';

function NavigationMenu({ isOpen, onClose, currentPage, onPageChange }: { 
  isOpen: boolean; 
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}) {
  const [isOthersOpen, setIsOthersOpen] = useState(false);

  const mainMenuItems = [
    { name: 'Accueil', icon: Home, category: 'home' },
    { name: 'Galaxies', icon: GalaxyIcon, category: 'Galaxy' },
    { name: 'Nébuleuses', icon: Star, category: 'Nebula' },
    { name: 'Messier', icon: Telescope, category: 'messier' },
    { name: 'Lune', icon: Moon, category: 'moon' },
    { name: 'SkyCam', icon: Camera, category: 'nightcam' },
    { name: 'Autres', icon: ChevronDown, submenu: true },
    { name: 'Recherche', icon: Search, category: 'search' },
    { name: 'Administrateur', icon: User, category: 'admin' },
    { name: 'Contact', icon: Contact, category: 'contact' },
    { name: 'Récompenses', icon: Trophy, category: 'rewards' }
  ];

  const othersSubmenu = [
    { name: 'Système Solaire', icon: Sun, category: 'solar_system' },
    { name: 'Etoiles', icon: Star, category: 'stars' },
    { name: 'Amas', icon: Star, category: 'amas' },
    { name: 'IC', icon: Telescope, category: 'IC' },
    { name: 'NGC', icon: Telescope, category: 'NGC' },
    { name: 'SH2', icon: Telescope, category: 'SH2' },
    { name: 'Comètes', icon: Star, category: 'comete' },
    { name: 'Autres Photo', icon: Camera, category: 'other' }
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
          {mainMenuItems.map((item) => (
            <div key={item.name}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
                onClick={() => {
                  if (item.submenu) {
                    setIsOthersOpen(!isOthersOpen);
                  } else if (item.category) {
                    onPageChange(item.category);
                    onClose();
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.submenu ? (
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOthersOpen ? 'rotate-180' : ''}`} />
                ) : (
                  item.category && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {item.submenu && isOthersOpen && (
                <div className="ml-4 border-l border-gray-700 pl-2">
                  {othersSubmenu.map((subItem) => (
                    <button
                      key={subItem.name}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
                      onClick={() => {
                        onPageChange(subItem.category);
                        onClose();
                      }}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span className="text-sm">{subItem.name}</span>
                      <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 bg-gray-900/50 hover:bg-gray-900/80 rounded-lg backdrop-blur-sm transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <NavigationMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {currentPage === 'home' && <HomePage onPageChange={setCurrentPage} />}
      {currentPage === 'search' && <SearchPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'nightcam' && <SkyCam />}
      {currentPage === 'moon' && <MoonPage />}
      {currentPage === 'admin' && <Admin />}
      {currentPage === 'other' && <Other />}
      {currentPage === 'comete' && <Comete />}
      {currentPage === 'stars' && <Stars />}
      {currentPage === 'SH2' && <SH2 />}
      {currentPage === 'NGC' && <NGC />}
      {currentPage === 'IC' && <IC />}
      {currentPage === 'Galaxy' && <Galaxy />}
      {currentPage === 'Nebula' && <Nebula />}
      {currentPage === 'amas' && <Amas />}
      {currentPage === 'solar_system' && <SolarSystem />}
      {currentPage === 'messier' && <Messier />}
      {currentPage === 'Observation' && <ObservationPage />}
      {currentPage === 'Weather' && <Weather />}
      {currentPage === 'info' && <Info />}
      {currentPage === 'RecentGallery' && <RecentGallery onPageChange={setCurrentPage}/>}
      {currentPage === 'rewards' && <Rewards />}

      <Toaster position="top-center" richColors theme="dark" />
    </div>
  );
}

export default App;