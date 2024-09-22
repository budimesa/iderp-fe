// src/services/api.js
import axios from 'axios';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/', // Ganti dengan URL API Anda
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true
});
export const login = async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
};
