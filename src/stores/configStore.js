// src/stores/configStore.js
import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    baseUrl: import.meta.env.VITE_APP_API_URL || '',
  }),
});
