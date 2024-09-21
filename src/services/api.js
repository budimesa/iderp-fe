// src/services/api.js
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/', // Ganti dengan URL API Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
};

// export const getUser = async (token) => {
//     const response = await apiClient.get('/user', {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     return response.data;
// };
