import React, { useEffect, useState } from 'react';
import { Cloud, Thermometer, Droplets, Eye } from 'lucide-react';
import settings from '../config/settings';

interface WeatherData {
  dataseries: Array<{
    cloudcover: number;
    seeing: number;
    rh2m: number;
    temp2m: number;
    timepoint: number;
  }>;
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://www.7timer.info/bin/api.pl?lon=${settings.longitude}&lat=${settings.latitude}&product=astro&output=json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données météo');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Impossible de charger les données météo');
        console.error('Erreur météo:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
        <p className="text-red-400">{error || 'Données météo non disponibles'}</p>
      </div>
    );
  }

  const currentData = weather.dataseries[0];

  const getCloudCoverText = (cover: number) => {
    if (cover <= 2) return 'Ciel dégagé';
    if (cover <= 5) return 'Partiellement nuageux';
    if (cover <= 7) return 'Très nuageux';
    return 'Couvert';
  };

  const getSeeingText = (seeing: number) => {
    if (seeing <= 3) return 'Excellente';
    if (seeing <= 5) return 'Bonne';
    if (seeing <= 7) return 'Moyenne';
    return 'Mauvaise';
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Conditions d'Observation</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-medium">Couverture nuageuse</p>
              <p className="text-gray-400">{getCloudCoverText(currentData.cloudcover)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-green-400" />
            <div>
              <p className="font-medium">Qualité d'observation</p>
              <p className="text-gray-400">{getSeeingText(currentData.seeing)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium">Température</p>
              <p className="text-gray-400">{currentData.temp2m}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-medium">Humidité relative</p>
              <p className="text-gray-400">{currentData.rh2m}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}