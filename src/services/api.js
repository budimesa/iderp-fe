// src/services/api.js
import axios from 'axios';
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials: true,
    withXSRFToken: true
});
export const login = async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
};
