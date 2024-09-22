// import axios from 'axios';
// import { defineStore } from 'pinia';

// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         user: null,
//         token: localStorage.getItem('token') || null,
//     }),
//     actions: {
//         async register(name, email, password) {
//             await axios.post('http://your-laravel-app/api/register', { name, email, password });
//         },
//         async login(email, password) {
//             const response = await axios.post('http://your-laravel-app/api/login', { email, password });
//             this.token = response.data;
//             localStorage.setItem('token', this.token);
//             axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
//         },
//         async logout() {
//             await axios.post('http://your-laravel-app/api/logout');
//             this.token = null;
//             localStorage.removeItem('token');
//             delete axios.defaults.headers.common['Authorization'];
//         },
//         async fetchUser() {
//             const response = await axios.get('http://your-laravel-app/api/user');
//             this.user = response.data;
//         },
//     },
// });
