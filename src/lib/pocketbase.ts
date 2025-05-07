import PocketBase from 'pocketbase';

// Sélection dynamique de l'URL PocketBase
let pocketBaseUrl = '';

if (window.location.hostname === 'Monsite.MonFAI.fr') {
  pocketBaseUrl = 'http://Monsite.MonFAI.fr:8090';
} else if (window.location.hostname === '192.168.X.XX') {
  pocketBaseUrl = 'http://192.168.X.XX:8090';
} else {
  // Fallback local pour tests ou accès par IP différente
  pocketBaseUrl = 'http://127.0.0.1:8090';
}

console.log(`[PocketBase] URL détectée : ${pocketBaseUrl}`);

export const pb = new PocketBase(pocketBaseUrl);

// Types pour nos collections
export interface PhotoRecord {
  id: string;
  created: string;
  updated: string;
  titre: string;
  description: string;
  objet: 'Galaxie' | 'Nébuleuse' | 'Planète' | 'Amas' | 'Soleil' | 'Lune' | 'Etoile' | 'Comète' | 'Autre' | 'SkyCam';
  mediaType: 'image' | 'video';
  image?: string;
  video?: string;
  date: string;
  instrument?: string;
  camera?: string;
}

export interface UserRecord {
  id: string;
  created: string;
  updated: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AdminLogRecord {
  id: string;
  created: string;
  action: string;
  status: boolean;
  details?: string;
}
