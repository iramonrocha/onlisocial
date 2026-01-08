<template>
    <div class="m-2">
        <div :class="alertClass">
            <div :class="circleClass">
                <div :class="tagClass">{{ item }}</div>
            </div>
            <div :class="textClass">
                <!-- <Translation :text="text" :params="params" /> -->
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { Alert } from '@/types/Alert'

const props = defineProps<Alert>()

const item = computed(() => props.item ?? '!')

const alertClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'alert-success'
        case 'info':
            return 'alert-info'
        case 'danger':
            return 'alert-danger'
        case 'warning':
            return 'alert-warning'
        case 'light':
            return 'alert-light'
        case 'dark':
            return 'alert-dark'
        default:
            return 'alert-default'
    }
})

const circleClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'alert-success-circle'
        case 'info':
            return 'alert-info-circle'
        case 'danger':
            return 'alert-danger-circle'
        case 'warning':
            return 'alert-warning-circle'
        case 'light':
            return 'alert-light-circle'
        case 'dark':
            return 'alert-dark-circle'
        default:
            return 'alert-default-circle'
    }
})

const textClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'alert-success-text'
        case 'info':
            return 'alert-info-text'
        case 'danger':
            return 'alert-danger-text'
        case 'warning':
            return 'alert-warning-text'
        case 'light':
            return 'alert-light-text'
        case 'dark':
            return 'alert-dark-text'
        default:
            return 'alert-default-text'
    }
})

const tagClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'alert-tag-text'
        case 'info':
            return 'alert-tag-text'
        case 'danger':
            return 'alert-tag-text'
        case 'warning':
            return 'alert-tag-text'
        case 'light':
            return 'alert-tag-text-light'
        case 'dark':
            return 'alert-tag-text'
        default:
            return 'alert-tag-text'
    }
})
</script>

<style scoped>
.alert-default,
.alert-success,
.alert-info,
.alert-danger,
.alert-warning,
.alert-light,
.alert-dark {
    display: flex;
    padding: 5px;
    align-items: center;
    border-radius: 50px;
    animation: fadeIn 0.3s ease-in-out;
}

.alert-default {
    background-color: #4e5d7825;
}

.alert-success {
    background-color: #2dc76d25;
}

.alert-info {
    background-color: #7540ee25;
}

.alert-danger {
    background-color: #ff563025;
}

.alert-warning {
    background-color: #ffab0025;
}

.alert-light {
    background-color: #ffffff25;
}

.alert-dark {
    background-color: #00000025;
}

.alert-default-circle,
.alert-success-circle,
.alert-info-circle,
.alert-danger-circle,
.alert-warning-circle,
.alert-light-circle,
.alert-dark-circle {
    display: flex;
    width: 25px;
    height: 25px;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
}

.alert-default-circle {
    background-color: #4e5d78;
}

.alert-success-circle {
    background-color: #2dc76d;
}

.alert-info-circle {
    background-color: #7540ee;
}

.alert-danger-circle {
    background-color: #ff5630;
}

.alert-warning-circle {
    background-color: #ffab00;
}

.alert-light-circle {
    background-color: #ffffff;
}

.alert-dark-circle {
    background-color: #000000;
}

.alert-default-text {
    margin-left: 10px;
    color: #4e5d78;
    font-weight: 700;
}

.alert-success-text {
    margin-left: 10px;
    color: #2dc76d;
    font-weight: 700;
}

.alert-info-text {
    margin-left: 10px;
    color: #7540ee;
    font-weight: 700;
}

.alert-danger-text {
    margin-left: 10px;
    color: #ff5630;
    font-weight: 700;
}

.alert-warning-text {
    margin-left: 10px;
    color: #ffab00;
    font-weight: 700;
}

.alert-light-text {
    margin-left: 10px;
    color: #000000;
    font-weight: 700;
}

.alert-dark-text {
    margin-left: 10px;
    color: #000000;
    font-weight: 700;
}

.alert-tag-text {
    color: #ffffff;
    font-weight: 700;
    font-size: 17px;
}

.alert-tag-text-light {
    color: #000000;
    font-weight: 700;
    font-size: 17px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>