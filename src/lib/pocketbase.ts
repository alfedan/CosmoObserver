import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Types pour nos collections
export interface PhotoRecord {
  id: string;
  created: string;
  updated: string;
  titre: string;
  description: string;
  objet: 'galaxy' | 'nebula' | 'cluster' | 'messier' | 'ic' | 'ngc' | 'sh2' | 'solar_system' | 'moon' | 'stars' | 'comet' | 'nightcam';
  image: string;
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