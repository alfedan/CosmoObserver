import React, { useEffect, useState } from 'react';
import { Calendar, Star } from 'lucide-react';
import settings from '../config/settings';

interface Event {
  date: string;
  title: string;
  description: string;
}

export function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date();
        const url = `https://in-the-sky.org/newscal.php?year=${today.getFullYear()}&month=${today.getMonth() + 1}&maxdiff=7&output=json&latitude=${settings.latitude}&longitude=${settings.longitude}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Impossible de charger les événements');
        console.error('Erreur événements:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const eventsForDate = selectedDate 
    ? events.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString())
    : [];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Calendrier Astronomique
        </h2>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Star className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-400">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
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