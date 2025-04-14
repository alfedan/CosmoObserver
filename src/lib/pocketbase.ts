import PocketBase from 'pocketbase';

// Use environment variable with fallback
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

export const pb = new PocketBase(POCKETBASE_URL);

// Types pour nos collections
export interface PhotoRecord {
  id: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  category: 'galaxy' | 'nebula' | 'cluster' | 'messier' | 'ic' | 'ngc' | 'sh2' | 'solar_system' | 'moon' | 'stars' | 'comet' | 'nightcam';
  image: string;
  date: string;
  equipment?: string;
  settings?: string;
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

// Helper function to check if the error is a network error
export const isNetworkError = (error: any) => {
  return (
    error.message === 'Failed to fetch' ||
    error.message.includes('network') ||
    error.message.includes('CORS') ||
    error.message.includes('autocancelled')
  );
};