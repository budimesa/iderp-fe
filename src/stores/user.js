import axios from 'axios';
import { defineStore } from 'pinia';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
    }),
    actions: {
        async fetchUsers() {
            const response = await apiClient.get('/users');
            this.users = response.data;
        },
        async createUser(name, email, password) {
            await apiClient.post('/users', { name, email, password });
            await this.fetchUsers(); // Refresh the user list
        },
        async updateUser(id, name, email) {
            await apiClient.put(`/users/${id}`, { name, email });
            await this.fetchUsers(); // Refresh the user list
        },
        async deleteUser(id) {
            await apiClient.delete(`/users/${id}`);
            await this.fetchUsers(); // Refresh the user list
        },
    },
});
