import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudSun, CloudMoon, Moon, Wind, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import settings from '../config/settings';
import { StarField } from '../components/StarField';

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
  };
}

export function Weather() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${settings.latitude}&lon=${settings.longitude}&appid=${settings.openWeatherApiKey}&units=metric&lang=fr`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données météo');
        const data = await response.json();
        setForecast(data);
      } catch (err) {
        console.error('Erreur météo :', err);
        setError('Impossible de charger les données météo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (description: string, isNight = false) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return isNight ? <Moon className="w-6 h-6 text-yellow-300" /> : <Sun className="w-6 h-6 text-yellow-400" />;
    if (desc.includes('clouds')) return isNight ? <CloudMoon className="w-6 h-6 text-gray-300" /> : <CloudSun className="w-6 h-6 text-gray-400" />;
    if (desc.includes('rain')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (desc.includes('snow')) return <CloudSnow className="w-6 h-6 text-blue-200" />;
    return <Cloud className="w-6 h-6 text-gray-400" />;
  };

  const formatHour = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDay = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <StarField />
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-gray-900/70 backdrop-blur-md rounded-lg p-8 text-center">
            <p className="text-red-400">{error || 'Erreur de chargement météo'}</p>
          </div>
        </div>
      </div>
    );
  }

  const hourlyForecast = forecast.list.slice(0, 16); // 48h (16 tranches de 3h)

  // Regrouper par jour
  const forecastByDay = hourlyForecast.reduce((acc, item) => {
    const day = formatDay(item.dt);
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);

  const chartData = hourlyForecast.map(item => ({
    time: formatHour(item.dt),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    clouds: item.clouds.all,
  }));

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Prévisions Météo sur 48h</h1>
          <p className="text-xl text-gray-400">Lieu : {forecast.city.name}</p>
        </header>

        {/* Section petites tuiles groupées par jour */}
        <section className="space-y-12 mb-16">
          {Object.entries(forecastByDay).map(([day, items], dayIndex) => (
            <div key={dayIndex}>
              <h2 className="text-2xl font-bold text-center text-blue-400 mb-6 capitalize">{day}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((item, index) => {
                  const isNight = new Date(item.dt * 1000).getHours() >= 20 || new Date(item.dt * 1000).getHours() <= 6;
                  return (
                    <div key={index} className="bg-gray-900/70 backdrop-blur-md rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400 mb-2">{formatHour(item.dt)}</p>
                      <div className="flex justify-center mb-2">{getWeatherIcon(item.weather[0].main, isNight)}</div>
                      <p className="text-lg font-bold">{Math.round(item.main.temp)}°C</p>
                      <p className="text-sm text-blue-300 flex items-center justify-center gap-1">
                        <Droplets className="w-4 h-4" /> {item.main.humidity}%
                      </p>
                      <p className="text-sm text-green-300 flex items-center justify-center gap-1">
                        <Wind className="w-4 h-4" /> {(item.wind.speed * 3.6).toFixed(0)} km/h
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{item.weather[0].description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Section graphiques */}
        <section className="space-y-12">
          <div className="bg-gray-900/70 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Température (°C)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Humidité (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="humidity" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Couverture Nuageuse (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="clouds" stroke="#93c5fd" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="text-center text-sm text-gray-400 mt-12">
          Données météo fournies par OpenWeather
        </div>
      </div>
    </div>
  );
}
