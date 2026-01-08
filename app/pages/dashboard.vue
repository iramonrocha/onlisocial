<template>
    <div v-if="user" class="card">
        <h2>⭐ {{ user.points }} pontos</h2>
        <div class="points-header">

            <button class="buy-points-btn" @click="openBuyPointsModal">
                ➕ Comprar pontos
            </button>

        </div>
        <p class="subtitle">Ganhe pontos seguindo usuários</p>

        <!-- Tabs -->
        <div class="tabs">
            <button class="tab-btn" :class="{ active: activeTab === 'profiles' }" @click="activeTab = 'profiles'">
                Meus perfis
            </button>

            <button class="tab-btn" :class="{ active: activeTab === 'follow' }" @click="activeTab = 'follow'">
                Seguir usuários
            </button>
        </div>

        <div class="content">
            <!-- PERFIS -->
            <div v-if="activeTab === 'profiles'" class="profiles-grid">
                <button class="add-profile-btn" @click="openModal">
                    ➕ Adicionar perfil
                </button>

                <div v-for="p in myProfiles" :key="p.id" class="profile-card">
                    <div class="profile-info">
                        <img :src="p.image" class="avatar" />

                        <div class="text">
                            <strong>{{ p.name }}</strong>
                            <span class="username">@{{ p.username }}</span>

                            <small class="cost">
                                ⭐ {{ p.cost_per_follower }} pts / seguidor
                            </small>

                            <Alert :type="p.status ? 'success' : 'warning'"
                                :text="p.status ? '▶ Ativo' : '⏸ Pausado'" />

                        </div>
                    </div>

                    <div class="profile-actions">
                        <button class="edit-btn" @click="openEditModal(p)">
                            ✏️ Editar
                        </button>
                    </div>
                </div>
            </div>

            <!-- SEGUIR -->
            <div v-if="activeTab === 'follow'" class="profiles-grid">
                <div v-for="u in availableUsers" :key="u.id" class="profile-card">
                    <div class="profile-info">
                        <img :src="u.image" class="avatar" />
                        <div class="text">
                            <strong>{{ u.name }}</strong>
                            <span class="username">@{{ u.username || 'user' }}</span>

                            <small class="cost">
                                💰 {{ u.cost_per_follower }} pts
                            </small>
                        </div>
                    </div>

                    <div class="profile-actions">
                        <button v-if="!u.readyToConfirm" @click="openUserPage(u)" class="play-btn">
                            Seguir
                        </button>

                        <button v-else @click="confirmFollow(u)" class="play-btn" :disabled="u.confirming">
                            {{ u.confirming ? 'Confirmando...' : 'Confirmar' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL COMPRAR PONTOS -->
        <!-- MODAL COMPRAR PONTOS VIA PIX -->
        <div v-if="showBuyPointsModal" class="modal-backdrop">
            <div class="modal">
                <h3>Comprar pontos via PIX</h3>
                <p class="subtitle">Escolha um pacote:</p>

                <div class="points-packages">
                    <button @click="buyPointsPackage(100)">
                        ⭐ 100 pontos
                    </button>

                    <button @click="buyPointsPackage(300)">
                        ⭐ 300 pontos <small>+10% bônus</small>
                    </button>

                    <button @click="buyPointsPackage(500)">
                        ⭐ 500 pontos <small>+20% bônus</small>
                    </button>
                </div>

                <!-- 🔹 Modal PIX -->
                <div v-if="qrImage" class="pix-container">
                    <h4>Pagamento PIX</h4>
                    <img :src="qrImage" alt="QR Code PIX" class="qr-code" />
                    <p>Escaneie o QR Code com seu app bancário ou copie o código abaixo:</p>
                    <textarea readonly class="payload-text">{{ pixPayload }}</textarea>
                    <button class="copy-btn" @click="copyPixCode">Copiar Código PIX</button>

                    <p v-if="pixRemainingTime" :class="['expiration', { danger: pixIsExpiringSoon }]">
                        Expira em: {{ pixRemainingTime }}
                    </p>

                    <p v-if="pixPaymentConfirmed" class="confirmed">✅ Pagamento confirmado!</p>
                </div>

                <div class="modal-actions">
                    <button @click="closeBuyPointsModal">Fechar</button>
                </div>
            </div>
        </div>

        <!-- MODAL EDITAR -->
        <div v-if="showEditModal" class="modal-backdrop">
            <div class="modal">
                <h3>Editar perfil</h3>

                <label>
                    Pontos por seguidor
                    <select v-model.number="editForm.cost_per_follower" class="modal-input input-like">
                        <option v-for="p in [5, 10, 15, 20, 25]" :key="p" :value="p">
                            {{ p }} pontos
                        </option>
                    </select>
                </label>

                <label class="toggle-container">
                    Status
                    <div class="toggle-wrapper">
                        <input type="checkbox" v-model="editForm.status" id="statusToggle" />
                        <span class="slider"></span>
                        <Alert :type="editForm.status ? 'success' : 'warning'"
                            :text="editForm.status ? '▶ Ativo' : '⏸ Pausado'" class="toggle-alert" />
                    </div>
                </label>

                <div class="modal-actions">
                    <button @click="saveEdit">Salvar</button>
                    <button class="delete-btn" @click="deleteProfileById(editForm.id)">Excluir</button>
                    <button @click="closeEditModal">Cancelar</button>
                </div>
            </div>
        </div>

        <!-- MODAL ADICIONAR -->
        <div v-if="showModal" class="modal-backdrop">
            <div class="modal">
                <h3>Adicionar novo perfil</h3>

                <form @submit.prevent="addProfile">
                    <label>
                        Username
                        <input v-model="form.username" required />
                    </label>

                    <label>
                        Pontos por seguidor
                        <select v-model.number="form.cost_per_follower" class="modal-input input-like">
                            <option v-for="p in [5, 10, 15, 20, 25]" :key="p" :value="p">
                                {{ p }} pontos
                            </option>
                        </select>
                    </label>

                    <div class="modal-actions m-2">
                        <button type="submit" :disabled="loadingAdd">
                            {{ loadingAdd ? 'Adicionando...' : 'Adicionar' }}
                        </button>

                        <button type="button" @click="closeModal">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ requireAuth: true })

// ================= PIX =================
const qrImage = ref<string | null>(null)
const pixPayload = ref<string | null>(null)
const pixRemainingTime = ref<string | null>(null)
const pixIsExpiringSoon = ref(false)
const pixPaymentConfirmed = ref(false)

let pixOrderId: string | null = null
let pixChargeId: string | null = null
let pixTimer: number | null = null
let pixCheckInterval: number | null = null
let pixChargeInterval: number | null = null

async function buyPointsPackage(points: number) {
    // Mapeia pontos para os IDs que o backend espera
    const packageMap: Record<number, 'small' | 'medium' | 'big'> = {
        100: 'small',
        500: 'medium',
        1000: 'big'
    };

    const packageId = packageMap[points];
    if (!packageId) {
        alert('Pacote inválido');
        return;
    }

    try {
        const res = await $fetch('/api/create-order', {
            method: 'POST',
            body: {
                packageId,
                customer: {
                    name: user.value.name,
                    email: user.value.email,
                },
            },
        });

        if (!res.qr_codes?.[0]) {
            alert('Erro: nenhum QR Code retornado.');
            return;
        }

        const qr = res.qr_codes[0];
        qrImage.value = qr.links?.find((l: any) => l.rel === "QRCODE.PNG")?.href || null;
        pixPayload.value = qr.text || null;
        pixOrderId = res.id;

        startPixCountdown(qr.expiration_date);
        showBuyPointsModal.value = true;

        pixCheckInterval = window.setInterval(checkPixOrder, 5000);
    } catch (err) {
        console.error(err);
        alert('Erro ao criar pedido PIX.');
    }
}

function startPixCountdown(expiration: string) {
    if (pixTimer) clearInterval(pixTimer)
    const exp = new Date(expiration).getTime()

    pixTimer = window.setInterval(() => {
        const diff = exp - Date.now()

        if (diff <= 0) {
            pixRemainingTime.value = "Expirado"
            clearInterval(pixTimer!)
            stopPixIntervals()
            return
        }

        const h = Math.floor(diff / (1000 * 60 * 60))
        const m = Math.floor((diff / (1000 * 60)) % 60)
        const s = Math.floor((diff / 1000) % 60)
        pixRemainingTime.value = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        pixIsExpiringSoon.value = diff < 30 * 1000
    }, 1000)
}

async function checkPixOrder() {
    if (!pixOrderId) return
    try {
        const data = await $fetch(`/api/get-order?id=${pixOrderId}`)
        if (data.chargeId) {
            pixChargeId = data.chargeId
            clearInterval(pixCheckInterval!)
            pixChargeInterval = window.setInterval(checkPixChargeStatus, 5000)
        }
    } catch (err) {
        console.error(err)
    }
}

async function checkPixChargeStatus() {
    if (!pixChargeId) return
    try {
        const data = await $fetch(`/api/get-charge?id=${pixChargeId}`)
        if (data.status === "PAID") {
            pixPaymentConfirmed.value = true
            stopPixIntervals()
            alert("✅ Pagamento confirmado!")
        } else if (data.status === "CANCELED" || data.status === "DECLINED") {
            stopPixIntervals()
            alert("❌ Pagamento cancelado ou recusado.")
        }
    } catch (err) {
        console.error(err)
    }
}

function stopPixIntervals() {
    if (pixTimer) clearInterval(pixTimer)
    if (pixCheckInterval) clearInterval(pixCheckInterval)
    if (pixChargeInterval) clearInterval(pixChargeInterval)
}

function closeBuyPointsModal() {
    showBuyPointsModal.value = false
    qrImage.value = null
    pixPayload.value = null
    pixRemainingTime.value = null
    pixPaymentConfirmed.value = false
    stopPixIntervals()
}

async function copyPixCode() {
    if (pixPayload.value) {
        try {
            await navigator.clipboard.writeText(pixPayload.value)
            alert('Código PIX copiado!')
        } catch {
            alert('Falha ao copiar o código PIX.')
        }
    }
}

/* =========================
   TIPOS
========================= */
interface Profile {
    id: number
    name: string
    username: string
    image?: string
    status: boolean
    cost_per_follower: number
}

interface FollowUser {
    id: number
    name: string
    image?: string
    username: string
    cost_per_follower: number
    followed: boolean
    user_id: string

    // Campos temporários para controle de UI
    readyToConfirm?: boolean
    confirming?: boolean
}

/* =========================
   AUTH
========================= */
const { user, fetchUser } = useAuthUser()
await fetchUser()

/* =========================
   STATE
========================= */
const activeTab = ref<'profiles' | 'follow'>('profiles')

const alert = ref<{ type: string; message: string; params?: Record<string, string | number> } | null>(null)

const setAlert = (type: string, message: string, params?: Record<string, string | number>) => {
    alert.value = { type, message, params }
}

const myProfiles = ref<Profile[]>([])
const users = ref<FollowUser[]>([])

const showModal = ref(false)
const loadingAdd = ref(false)
const loadingList = ref(false)

const form = reactive({
    username: '',
    cost_per_follower: 5,
})

/* =========================
   COMPUTED
========================= */
const availableUsers = computed(() =>
    users.value
        .filter(u => !u.followed)
        .sort((a, b) => (b.cost_per_follower || 0) - (a.cost_per_follower || 0))
)

/* =========================
   METHODS
========================= */
function openModal() {
    resetForm()
    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

function resetForm() {
    form.username = ''
    form.cost_per_follower = 5
}

const showEditModal = ref(false)

const editForm = reactive({
    id: 0,
    cost_per_follower: 5,
    status: true,
})

const showBuyPointsModal = ref(false)

function openBuyPointsModal() {
    showBuyPointsModal.value = true
}

function openEditModal(profile: Profile & { cost_per_follower?: number }) {
    editForm.id = profile.id
    editForm.cost_per_follower = profile.cost_per_follower ?? 5
    editForm.status = profile.status
    showEditModal.value = true
}

function closeEditModal() {
    showEditModal.value = false
    editForm.id = 0
    editForm.cost_per_follower = 5
    editForm.status = true
}

async function saveEdit() {
    await useApi().post('/editProfile', {
        profile_id: editForm.id,
        cost_per_follower: editForm.cost_per_follower,
        status: editForm.status,
    })

    await getProfiles()
    closeEditModal()
}

async function addProfile() {
    loadingAdd.value = true
    try {
        await useApi().post('/addProfile', form)
        await getProfiles()
        closeModal()
    } finally {
        loadingAdd.value = false
    }
}

async function deleteProfileById(profileId: number) {
    if (!confirm('Deseja realmente excluir este perfil?')) return

    await useApi().post('/deleteProfile', { profile_id: profileId })

    myProfiles.value = myProfiles.value.filter(p => p.id !== profileId)
    closeEditModal()
}

/* =========================
   NOVO FLUXO FOLLOW MANUAL
========================= */
function openUserPage(u: FollowUser) {
    const url = `https://instagram.com/${u.username}`
    const width = 500
    const height = window.innerHeight - 100
    const left = 20 // lado esquerdo
    const top = 50

    window.open(
        url,
        '_blank',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )

    u.readyToConfirm = true // agora podemos mostrar "Confirmar"
}

async function confirmFollow(u: FollowUser) {
    u.confirming = true
    try {
        const res = await useApi().post('/follow', {
            profile_id: u.id,
            user_id: u.user_id,
            username: u.username,
            cost_per_follower: u.cost_per_follower
        })

        if (res.success) {
            u.followed = true
            u.readyToConfirm = false
        }
    } finally {
        u.confirming = false
    }
}

/* =========================
   GET PROFILES
========================= */
async function getProfiles() {
    loadingList.value = true
    try {
        myProfiles.value = await useApi().get('/getProfiles')
        const fetchedUsers = await useApi().get('/getProfilesfollow')
        users.value = fetchedUsers.map(u => ({ ...u, readyToConfirm: false }))
    } finally {
        loadingList.value = false
    }
}

onMounted(getProfiles)

</script>

<style scoped>
.points-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
}

.buy-points-btn {
    background: #f4a261;
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;
}

.buy-points-btn:hover {
    background: #e76f51;
}

/* Tabs */
.tabs {
    display: flex;
    gap: 8px;
    margin: 15px 0;
}

.tab-btn {
    flex: 1;
    background: #eee;
    color: #333;
}

.tab-btn.active {
    background: #2a5298;
    color: #fff;
}

/* Conteúdo da aba seguir */
.content>div[v-if="activeTab === 'follow'"] {
    max-height: 300px;
    /* define altura máxima */
    overflow-y: auto;
    /* adiciona scroll vertical */
    padding-right: 5px;
    /* evita cortar a barra de scroll */
}

/* Usuários */
.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.user-item button {
    width: auto;
    padding: 6px 12px;
    font-size: 14px;
}

pre {
    text-align: left;
    font-size: 12px;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 6px;
    overflow: auto;
}

/* Perfil do usuário */
.profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
}

.avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    border: 2px solid #2a5298;
}

.username {
    font-size: 14px;
    color: #666;
}

button.paused {
    background: #ccc;
    color: #555;
    cursor: not-allowed;
}

.add-profile-btn {
    background: #2a5298;
    color: #fff;
    padding: 8px 12px;
    margin-bottom: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.modal-actions button {
    padding: 6px 12px;
    cursor: pointer;
}

.modal-input {
    width: 100%;
    padding: 6px 8px;
    margin-top: 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    appearance: none;
    /* remove estilo nativo do select */
    background-color: #fff;
}

.modal-input:focus {
    border-color: #2a5298;
    outline: none;
}

.follow-list {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 5px;
}

.success {
    color: green;
    font-weight: bold;
}

.profiles-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.profile-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f7f7f7;
    padding: 10px;
    width: 350px;
    border-radius: 8px;
}

.profile-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.profile-info .text {
    display: flex;
    flex-direction: column;
}

.profile-actions {
    display: flex;
    gap: 6px;
}

.pause-btn {
    background: #ffb703;
    color: #333;
}

.play-btn {
    background: #2a9d8f;
    color: #fff;
}

.delete-btn {
    background: #e63946;
    color: #fff;
}

.profile-actions button {
    padding: 6px 10px;
    font-size: 13px;
    border-radius: 4px;
}

.edit-btn {
    background: #457b9d;
    color: #fff;
}

.cost {
    font-size: 17px;
    color: #444;
    padding: 6px 10px;
}

/* Container do toggle e alert */
.toggle-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Wrapper: toggle + alert */
.toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    /* espaço entre toggle e alert */
}

/* Toggle maior */
.toggle-wrapper input[type="checkbox"] {
    appearance: none;
    width: 60px;
    /* aumentei de 40px para 60px */
    height: 30px;
    /* aumentei de 20px para 30px */
    background: #ccc;
    border-radius: 15px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
}

.toggle-wrapper input[type="checkbox"]:checked {
    background: #2a9d8f;
    /* verde ativo */
}

/* Bola do toggle */
.toggle-wrapper input[type="checkbox"]::before {
    content: "";
    position: absolute;
    top: 3px;
    /* ajuste proporcional à altura */
    left: 3px;
    width: 24px;
    /* proporcional à largura */
    height: 22px;
    background: #fff;
    border-radius: 50%;
    transition: 0.3s;
}

.toggle-wrapper input[type="checkbox"]:checked::before {
    transform: translateX(30px);
    /* metade da largura do toggle */
}

/* Alert maior */
.toggle-alert {
    font-size: 16px;
    /* maior que o normal */
    font-weight: bold;
    /* mais visível */
    padding: 4px 8px;
    /* espaço interno */
    border-radius: 6px;
}

.input-like {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background-color: #fff;
    appearance: none;
    /* remove estilo nativo */
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
}

.input-like:focus {
    border-color: #2a5298;
    outline: none;
}

.points-packages {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.points-packages button {
    background: #2a9d8f;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
    font-weight: bold;
}

.points-packages button small {
    display: block;
    font-size: 12px;
    font-weight: normal;
    opacity: 0.9;
}

.points-packages button:hover {
    background: #21867a;
}

.pix-container {
    margin-top: 15px;
    text-align: center;
}

.qr-code {
    width: 250px;
    height: 250px;
    margin: 10px auto;
    display: block;
    border-radius: 8px;
}

.payload-text {
    width: 100%;
    min-height: 60px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-top: 5px;
    resize: none;
    font-size: 13px;
}

.copy-btn {
    background: #28a745;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 6px;
}

.copy-btn:hover {
    background: #1f8636;
}

.expiration {
    font-size: 0.95rem;
    color: #333;
    margin-top: 5px;
    font-weight: bold;
}

.expiration.danger {
    color: #ff3b3b;
    animation: blink 1s infinite;
}

.confirmed {
    color: #28a745;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 8px;
}

@keyframes blink {
    50% {
        opacity: 0.4;
    }
}
</style>