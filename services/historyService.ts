import { AdData } from '../types';

const STORAGE_KEY = 'fb_ads_saver_history';
const MAX_ITEMS = 6; // Limit to 6 items to keep the UI clean

export const getHistory = (): AdData[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn('Failed to read history from local storage', e);
    return [];
  }
};

export const addToHistory = (ad: AdData): AdData[] => {
  try {
    const current = getHistory();
    // Remove existing item with the same ID to prevent duplicates and move to top
    const filtered = current.filter(item => item.id !== ad.id);
    // Add new item to the beginning
    const updated = [ad, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save history to local storage', e);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear history', e);
  }
};