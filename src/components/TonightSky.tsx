import React, { useEffect, useState } from 'react';
import { Moon, Star } from 'lucide-react';
import settings from '../config/settings';

interface SkyEvent {
  title: string;
  description: string;
  type: string;
}

export function TonightSky() {
  const [events, setEvents] = useState<SkyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTonightEvents = async () => {
      try {
        const today = new Date();
        const url = `https://in-the-sky.org/widgets/newscal.php?skin=1&date=${today.toISOString().split('T')[0]}&latitude=${settings.latitude}&longitude=${settings.longitude}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Impossible de charger les événements de ce soir');
        console.error('Erreur événements:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTonightEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Moon className="w-6 h-6" />
          À voir ce soir
        </h2>
        <p className="text-gray-400">
          {error || 'Aucun événement particulier ce soir'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Moon className="w-6 h-6" />
          À voir ce soir
        </h2>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg"
            >
              <Star className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <p className="font-medium">{event.title}</p>
                {event.description && (
                  <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}