import React from 'react';
import { EventCalendar } from '../components/EventCalendar';
import { TonightSky } from '../components/TonightSky';
import { StarField } from '../components/StarField';

export function ObservationPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarField />
      
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Observation du Ciel</h1>
          <p className="text-xl text-gray-300">Le calendrier des observations à faire.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <TonightSky />
          </div>
          <div>
            <EventCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}