import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

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