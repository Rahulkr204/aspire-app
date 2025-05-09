<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from "@iconify/vue";
import { Card } from '../types'

interface Props {
  card: Card;
  isVisible: boolean;
  isActive: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const cardClassObject = computed(() => {
  return {
    'card-component': true,
    'active': props.isActive,
    'frozen': props.card.frozen
  }
})


const handleClick = (): void => {
  emit('click')
}

const getCardIconByType = (type: string): string => {
  switch (type) {
    case 'visa':
      return 'simple-icons:visa';
    case 'mastercard':
      return 'logos:mastercard';
    case 'amex':
      return 'logos:amex';
    default:
      return 'simple-icons:visa';
  }
}
</script>

<template>
    <div :class="cardClassObject" @click="handleClick">
        <div class="card-header">
            <div class="aspire-logo">
                <img src="../assets/logo.svg" alt="Aspire Logo" width="24" height="24">
                <span class="fth-logo mobile-logo">aspire</span>
            </div>
            <div v-if="props.card.frozen" class="frozen-badge">FROZEN</div>
        </div>

        <div class="card-holder">{{ card.name }}</div>

        <div class="card-number">
            <div v-if="props.isVisible" class="dots-container">
                {{ props.card.cardNumber }}
            </div>
            <div v-else class="dots-container">
                <div class="dots-section">
                    <span v-for="dots in Array(4).fill('')" class="dots">
                    </span>
                </div>
                <div class="dots-section">
                    <span v-for="dots in Array(4).fill('')" class="dots">
                    </span>
                </div>
                <div class="dots-section">
                    <span v-for="dots in Array(4).fill('')" class="dots">
                    </span>
                </div>
                <span>{{ props.card.cardNumber.slice(-4) }}</span>
            </div>

            <div class="card-validity">
                <div class="label">Thru: {{ card.expiryDate }}</div>
                <div class="label cvv">
                    CVV:
                    <span v-if="props.isVisible">{{ card.cvv }}</span>
                    <div v-else style="display: flex; align-items: center;">
                        <Icon v-for="asterisk in Array(3).fill('')" icon="ix:asterisk" width="20" height="20"
                            style="color: #fff" />
                    </div>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="card-network">
                <Icon :icon="getCardIconByType(card.type)" class="card-icon" width="5rem" height="5rem"
                    style="color: #fff" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-component {
    background-color: var(--primary-color);
    border-radius: 12px;
    color: white;
    width: 100%;
    height: 100%;
    min-height: 272px;
    min-width: 496px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    padding: 0 2rem;
}

.card-component.frozen {
    opacity: 0.7;
}

.card-header {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    padding: 1.6rem 0;
}

.dots-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 85%;
    padding: 0.5rem 0;
}
.dots-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 25%;
    margin-right: 2rem;
}
.dots {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
}
.aspire-logo {
    display: flex;
    align-items: center;
}

.fth-logo {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: lowercase;
    position: relative;
    font-size: 1.4rem;
    padding-left: 8px;
}

.frozen-badge {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
}

.card-holder {
    display: flex;
    font-size: 2rem;
    font-weight: bold;
    flex-basis: 20%;
}

.card-number {
    width: auto;
    font-size: 1.6rem;
    letter-spacing: 3.4px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card-footer {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    font-size: 1.4rem;
    font-weight: 600;
}

.card-validity {
    display: flex;
    gap: 20px;
}

.label {
    font-size: 1rem;
    font-weight: 500;
    align-items: center;
    letter-spacing: 0;
}

.cvv {
    display: flex;
    flex-direction: row;
    align-items: center;
}

@media (max-width: 768px) {
    .card-component {
        min-width: unset;
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }
    .card-header {
        padding: 0.8rem 0;
    }
    .card-component:hover {
        transform: none;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
    .fth-logo {
        font-size: 1.2rem;
    }
    .card-holder {
        font-size: 1.5rem;
    }
    .card-number {
        font-size: 1.2rem;
        letter-spacing: px;
        margin-bottom: 8px;
    }
    .dots-container{
        width: 90%;
    }
    .dots-section {
        margin-right: 1.4rem;
    }
    .card-validity {
        gap: 10px;
    }
    .label {
        font-size: 0.8rem;
    }
    .card-footer {
        margin-top: 0;
    }
    .card-network .card-icon {
        width: 3.5rem !important;
        height: 3.5rem !important;
    }
}
</style>