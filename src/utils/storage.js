import { initialData } from '../data/initialData.js';

const STORAGE_KEY = 'PARK_CMMS_FAVIER_DATA_V1';

export const getStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading localStorage", e);
    return initialData;
  }
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

export const resetStoredData = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (e) {
    console.error("Error resetting localStorage", e);
    return initialData;
  }
};
