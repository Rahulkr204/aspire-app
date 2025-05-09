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

// Parse the card number into four groups
const cardParts = computed(() => {
  const parts = props.card.cardNumber.split(' ');
  return {
    first: parts[0] || '',
    second: parts[1] || '',
    third: parts[2] || '',
    fourth: parts[3] || ''
  };
});

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
            <div class="card-number-container">
                <!-- Visible card number -->
                <template v-if="props.isVisible">
                    <div class="card-number-group">{{ cardParts.first }}</div>
                    <div class="card-number-group">{{ cardParts.second }}</div>
                    <div class="card-number-group">{{ cardParts.third }}</div>
                    <div class="card-number-group">{{ cardParts.fourth }}</div>
                </template>

                <!-- Masked card number with dots -->
                <template v-else>
                    <div class="card-number-group">
                        <span class="dots" v-for="i in 4" :key="'first-'+i"></span>
                    </div>
                    <div class="card-number-group">
                        <span class="dots" v-for="i in 4" :key="'second-'+i"></span>
                    </div>
                    <div class="card-number-group">
                        <span class="dots" v-for="i in 4" :key="'third-'+i"></span>
                    </div>
                    <div class="card-number-group">{{ cardParts.fourth }}</div>
                </template>
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

.card-number-container {
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
}

.card-number-group {
    font-size: 1.5rem;
    letter-spacing: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    font-family: monospace;
    min-width: 60px;
    width: 18%;
}

.dots {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fff;
    display: inline-block;
    margin: 0 2px;
}

.aspire-logo {
    display: flex;
    align-items: flex-end;
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
    margin-bottom: 16px;
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
    margin-top: 4px;
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
        padding: 0 1.5rem;
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
        width: auto;
        margin-bottom: 8px;
    }
    .card-number-container {
        gap: 12px
    }
    .card-number-group {
        font-size: 1.2rem;
        min-width: 48px;
    }
    .dots {
        width: 6px;
        height: 6px;
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
    .card-number-group {
        width: 100%;
        gap: 8px;
    }
}
</style>