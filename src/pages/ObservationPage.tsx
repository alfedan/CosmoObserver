import React, { useEffect, useState } from 'react';
import { StarField } from '../components/StarField';
import settings from '../config/settings';

interface FeedItem {
  title: string;
  link: string;
  contentSnippet: string;
  title_fr: string;
  content_fr: string;
}

export function ObservationPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndTranslate = async () => {
      try {
        const rssUrl = `https://in-the-sky.org/rss.php?feed=dfan&latitude=${settings.latitude}&longitude=${settings.longitude}&timezone=Europe/Paris`;

        // Utilisation d'un proxy RSS to JSON (ex : rss2json)
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();

        const translatedItems = await Promise.all(
          data.items.slice(0, 10).map(async (item: any) => {
            const translatedTitle = await translateText(item.title);
            const translatedContent = await translateText(item.description);
            return {
              ...item,
              title_fr: translatedTitle,
              content_fr: translatedContent
            };
          })
        );

        setItems(translatedItems);
      } catch (err) {
        console.error('Erreur lors du chargement du flux RSS:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndTranslate();
  }, []);

  const translateText = async (text: string) => {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'fr',
        format: 'text'
      })
    });

    const data = await res.json();
    return data.translatedText || text;
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <StarField />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Événements célestes à venir</h1>
        {loading ? (
          <p>Chargement en cours...</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item, idx) => (
              <li key={idx} className="bg-gray-900/70 p-4 rounded-lg shadow-md border border-gray-700">
                <h2 className="text-xl font-semibold mb-2">{item.title_fr}</h2>
                <p className="text-sm text-gray-300 mb-2">{item.content_fr}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  Voir plus →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
