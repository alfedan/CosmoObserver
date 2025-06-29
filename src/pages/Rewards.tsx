import React, { useState } from 'react';
import { Trophy, Star, Award, Medal, Crown, Gift } from 'lucide-react';
import { StarField } from '../components/StarField';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function Rewards() {
  const [achievements] = useState<Achievement[]>([
    {
      id: 'first_photo',
      title: 'Premier Clic',
      description: 'Prendre votre première photo astronomique',
      icon: <Star className="w-8 h-8" />,
      unlocked: true,
      rarity: 'common'
    },
    {
      id: 'moon_observer',
      title: 'Observateur Lunaire',
      description: 'Photographier la Lune dans 5 phases différentes',
      icon: <Medal className="w-8 h-8" />,
      unlocked: true,
      progress: 3,
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: 'deep_space',
      title: 'Explorateur du Ciel Profond',
      description: 'Capturer 10 objets Messier différents',
      icon: <Award className="w-8 h-8" />,
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      rarity: 'epic'
    },
    {
      id: 'galaxy_hunter',
      title: 'Chasseur de Galaxies',
      description: 'Photographier 5 galaxies différentes',
      icon: <Crown className="w-8 h-8" />,
      unlocked: true,
      rarity: 'epic'
    },
    {
      id: 'nebula_master',
      title: 'Maître des Nébuleuses',
      description: 'Capturer 15 nébuleuses différentes',
      icon: <Trophy className="w-8 h-8" />,
      unlocked: false,
      progress: 12,
      maxProgress: 15,
      rarity: 'legendary'
    },
    {
      id: 'night_owl',
      title: 'Oiseau de Nuit',
      description: 'Passer 100 heures d\'observation nocturne',
      icon: <Gift className="w-8 h-8" />,
      unlocked: false,
      progress: 73,
      maxProgress: 100,
      rarity: 'rare'
    },
    {
      id: 'planet_photographer',
      title: 'Photographe Planétaire',
      description: 'Photographier toutes les planètes visibles',
      icon: <Medal className="w-8 h-8" />,
      unlocked: false,
      progress: 4,
      maxProgress: 8,
      rarity: 'epic'
    },
    {
      id: 'comet_chaser',
      title: 'Chasseur de Comètes',
      description: 'Capturer une comète en mouvement',
      icon: <Star className="w-8 h-8" />,
      unlocked: true,
      rarity: 'legendary'
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-900/50';
      case 'rare': return 'bg-blue-900/30';
      case 'epic': return 'bg-purple-900/30';
      case 'legendary': return 'bg-yellow-900/30';
      default: return 'bg-gray-900/50';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Récompenses
          </h1>
          <p className="text-xl text-gray-300">Vos accomplissements en astronomie</p>
          
          <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Progression Globale</h2>
            <div className="relative w-full bg-gray-700 rounded-full h-4 mb-4">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-lg">
              <span className="text-yellow-400 font-bold">{unlockedCount}</span> / {totalCount} récompenses
            </p>
            <p className="text-sm text-gray-400">{completionPercentage}% complété</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`${getRarityBg(achievement.rarity)} backdrop-blur-sm rounded-lg p-6 border-2 ${getRarityColor(achievement.rarity)} ${
                achievement.unlocked ? 'opacity-100' : 'opacity-60'
              } transition-all duration-300 hover:scale-105`}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-full mb-4 ${
                  achievement.unlocked ? getRarityColor(achievement.rarity).replace('text-', 'text-').replace('border-', 'bg-') + '/20' : 'bg-gray-800'
                }`}>
                  <div className={achievement.unlocked ? getRarityColor(achievement.rarity) : 'text-gray-500'}>
                    {achievement.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{achievement.description}</p>
                
                {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                  <div className="mb-4">
                    <div className="relative w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(achievement.rarity)} capitalize`}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlocked && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Trophy className="w-4 h-4" />
                      <span className="text-xs">Débloqué</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Système de Récompenses</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span>Commune</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span>Rare</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                <span>Épique</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <span>Légendaire</span>
              </div>
            </div>
            <p className="text-gray-400 mt-4">
              Débloquez des récompenses en explorant l'univers et en capturant ses merveilles !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}