import { initialData, STORAGE_KEY } from '../constants/initialData.js';

export const getStoredData = () => {
  try {
    localStorage.removeItem('PARK_CMMS_FAVIER_DATA_V1');
    localStorage.removeItem('PARK_CMMS_PLATAFORMAPARK_DATA_V1');
    localStorage.removeItem('PARK_READ_NOTIFICATIONS_V1');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialData,
        ...parsed,
        workOrders: Array.isArray(parsed.workOrders) ? parsed.workOrders : [],
        assets: Array.isArray(parsed.assets) ? parsed.assets : [],
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
        preventiveSchedules: Array.isArray(parsed.preventiveSchedules) ? parsed.preventiveSchedules : [],
        technicians: Array.isArray(parsed.technicians) ? parsed.technicians : [],
        users: (parsed.users && parsed.users.length > 0) ? parsed.users : initialData.users
      };
    }
  } catch (e) {
    console.error("Error reading localStorage", e);
  }
  return initialData;
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving localStorage", e);
  }
};;
