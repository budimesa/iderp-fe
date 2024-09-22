// src/stores/auth.js
import axios from 'axios';
import { defineStore } from 'pinia';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials: true,
    withXSRFToken: true,
});

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        errorMessage: '',
    }),
    actions: {
        async login(email, password) {
            this.errorMessage = ''; // Clear previous errors
            try {
                const response = await apiClient.post('/login', { email, password });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                return response.data;
            } catch (error) {
                this.handleError(error);
                throw error; // Rethrow to handle in component
            }
        },
        async logout() {
            this.token = null;
            localStorage.removeItem('token');
        },
        handleError(error) {
            if (error.response?.data?.message) {
                this.errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).flat();
                this.errorMessage = messages.join(', '); // Combine error messages
            } else {
                this.errorMessage = 'Login failed';
            }
        },
    },
});
