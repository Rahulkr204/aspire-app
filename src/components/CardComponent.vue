<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const cardClassObject = computed(() => {
  return {
    'card-component': true,
    'active': props.isActive,
    'frozen': props.card.frozen
  }
})

const formattedCardNumber = computed(() => {
  if (props.isVisible) {
    return props.card.cardNumber
  }
  return '•••• •••• •••• ' + props.card.cardNumber.slice(-4)
})

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div :class="cardClassObject" @click="handleClick">
    <div class="card-header">
      <div class="aspire-logo">
        <span class="fth-logo mobile-logo">aspire</span>
      </div>
      <div v-if="props.card.frozen" class="frozen-badge">FROZEN</div>
    </div>

    <div class="card-holder">{{ card.name }}</div>

    <div class="card-number">
      {{ formattedCardNumber }}
    </div>

    <div class="card-footer">
      <div class="card-validity">
        <div class="label">Thru: {{ card.expiryDate }}</div>
        <div class="label">CVV: {{ card.cvv }}</div>
      </div>
      <div class="card-network">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="visa-logo" />
      </div>
    </div>

    <div class="user-badge" v-if="isActive">
      <span>1</span>
    </div>
  </div>
</template>

<style scoped>
.card-component {
  background-color: #01D167;
  border-radius: 16px;
  padding: 20px;
  color: white;
  min-width: 300px;
  max-width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  position: relative;
  scroll-snap-align: start;
  margin-right: 10px;
}

.card-component.active {
  transform: scale(1.02);
}

.card-component.frozen {
  opacity: 0.7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.aspire-logo {
  display: flex;
  align-items: center;
}

.fth-logo {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: lowercase;
  position: relative;
}

.fth-logo.mobile-logo::before {
  display: none;
}

.frozen-badge {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.card-holder {
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0;
}

.card-number {
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-validity {
  display: flex;
  gap: 16px;
}

.label {
  font-size: 13px;
  opacity: 0.9;
}

.visa-logo {
  height: 20px;
}

.user-badge {
  position: absolute;
  right: 24px;
  top: 40%;
  background-color: #FF8F00;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

@media (max-width: 767px) {
  .card-component {
    min-width: 280px;
    height: 180px;
    padding: 16px;
  }
  .fth-logo {
    font-size: 16px;
  }
  .card-holder {
    font-size: 18px;
    margin: 12px 0;
  }
  .card-number {
    font-size: 13px;
    letter-spacing: 1.5px;
    margin-bottom: 12px;
  }
  .label {
    font-size: 12px;
  }
  .visa-logo {
    height: 18px;
  }
  .user-badge {
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
}
</style>