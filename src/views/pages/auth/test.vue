<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { login } from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const token = localStorage.getItem('token');

onMounted(() => {
    if (token) {
        router.push('/');
    }
});

const handleLogin = async () => {
    try {
        const response = await login(email.value, password.value);
        localStorage.setItem('token', response.token);
        // Redirect after successful login
        router.push('/');
    } catch (error) {
        console.log(error);
        errorMessage.value = error.response?.data?.message || 'Login failed';
    }
};
</script>
