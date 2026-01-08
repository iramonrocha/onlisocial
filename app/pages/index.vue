<template>
    <div class="card">
        <h1>Ganhe Seguidores</h1>
        <p class="subtitle">Digite seu username</p>

        <form v-if="step === 'check'" @submit.prevent="checkUsername">
            <label>Username</label>
            <input v-model="username" type="text" required />

            <button :disabled="loading">
                {{ loading ? 'Verificando...' : 'Continuar' }}
            </button>
        </form>

        <div v-if="step === 'login'">
            <p class="mensagem sucesso">
                Usuário já cadastrado. Faça login 👇
            </p>

            <Alert v-if="alert" :type="alert.type" :text="alert.message" :params="alert.params" />

            <NuxtLink to="login">
                <button>
                    Login
                </button>
            </NuxtLink>
        </div>

        <div v-if="step === 'register'">

            <p class="mensagem sucesso">
                Complete seu cadastro para continuar ganhando seguidores 👇
            </p>

            <Alert v-if="alert" :type="alert.type" :text="alert.message" :params="alert.params" />

            <NuxtLink to="register">
                <button>
                    Registrar
                </button>
            </NuxtLink>
        </div>

        <button @click="criarPix">Pagar com PIX</button>

        <div v-if="pix">
            <img :src="pix.qr_codes[0].links[0].href" />
            <p>{{ pix.qr_codes[0].text }}</p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ requireAuth: false })

type Step = 'check' | 'login' | 'register'

const step = ref<Step>('check')
const username = ref('')
const loading = ref(false)

const alert = ref<{ type: string; message: string; params?: Record<string, string | number> } | null>(null)

const setAlert = (type: string, message: string, params?: Record<string, string | number>) => {
    alert.value = { type, message, params }
}

async function checkUsername() {
    loading.value = true

    try {

        const response = await useApi().post('/getFollowers', {
            username: username.value
        })

        console.log(response)

        if (response.exists) {
            if (response.type === 'already_registered') {
                step.value = 'login'
                setAlert('success', response.message)
            }

            if (response.type === 'already_got_followers') {
                step.value = 'register'
                setAlert('success', response.message)
            }

        } else {
            step.value = 'register'
            setAlert('success', 'Cadastro concluído!')
        }

    } catch (error) {
        setAlert('danger', 'Erro ao verificar usuário.')
        console.log(error)
    } finally {
        loading.value = false
    }
}

const pix = ref(null)

async function criarPix() {
    pix.value = await useApi().post('/create-order', {
        name: 'João da Silva',
        email: 'joao@email.com',
        cpf: '12345678909',
        productName: 'Produto Teste',
        amount: 5000,
    })
}

</script>

<style scoped></style>