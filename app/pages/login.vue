<template>
    <div class="card">
        <h1>Login</h1>
        <form @submit.prevent="onSubmit">
            <label>Username</label>
            <input v-model="username" type="text" required />
            <label>Password</label>
            <input v-model="password" type="password" required />
            <button :disabled="loading">
                {{ loading ? 'Entrando...' : 'Login' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">

const username = ref('')
const password = ref('')

const loading = ref(false)

async function onSubmit() {
    loading.value = true

    try {

        const data = {
            username: username.value,
            password: password.value,
        }

        await useApi().post('/login', data)

        await navigateTo('/dashboard')
    } catch (error) {

    } finally {
        loading.value = false
    }
}

definePageMeta({ requireAuth: false, redirectIfLogged: true })
</script>

<style scoped></style>