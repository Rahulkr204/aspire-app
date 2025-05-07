<script setup>
import { useCardsStore } from '../stores/cardsStore'

const props = defineProps({
  cardId: {
    type: Number,
    required: true
  },
  isFrozen: {
    type: Boolean,
    default: false
  }
})

const cardsStore = useCardsStore()

const toggleFreeze = () => {
  cardsStore.toggleCardFreeze(props.cardId)
}
</script>

<template>
  <div class="card-actions">
    <div class="action-button" @click="toggleFreeze">
      <div class="action-icon freeze-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M2 12h20M19 15V9M16 6l3 3 3-3M8 6L5 9l3 3M19 18l-3-3-3 3M8 18l3-3 3 3M5 15V9" v-if="!isFrozen" />
          <path d="M2 12h20M12 2v7M12 15v7" v-if="isFrozen" />
        </svg>
      </div>
      <div class="action-text">{{ isFrozen ? 'Unfreeze' : 'Freeze' }}<br>card</div>
    </div>

    <div class="action-button">
      <div class="action-icon spend-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 12h-6.5" />
          <path d="M13 8.5L16 12L13 15.5" />
        </svg>
      </div>
      <div class="action-text">Set spend<br>limit</div>
    </div>

    <div class="action-button">
      <div class="action-icon gpay-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="currentColor" />
        </svg>
      </div>
      <div class="action-text">Add to<br>GPay</div>
    </div>

    <div class="action-button">
      <div class="action-icon replace-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      </div>
      <div class="action-text">Replace<br>card</div>
    </div>

    <div class="action-button">
      <div class="action-icon cancel-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <div class="action-text">Cancel<br>card</div>
    </div>
  </div>
</template>

<style scoped>
.card-actions {
  display: flex;
  justify-content: space-around;
  background-color: #EDF3FF;
  border-radius: 12px;
  padding: 12px 4px;
  margin-top: 20px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 4px;
  border-radius: 8px;
  transition: background-color 0.2s;
  width: auto;
  flex: 1;
  min-width: 60px;
}

.action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.action-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #325BAF;
  margin-bottom: 2px;
}

.action-icon svg {
  stroke: #325BAF;
}

.action-icon .gpay-icon svg path {
  fill: #325BAF;
}

.action-text {
  font-size: 11px;
  font-weight: 500;
  color: #325BAF;
  text-align: center;
  line-height: 1.2;
}

@media (max-width: 360px) {
  .action-text {
    font-size: 10px;
  }
  .action-icon {
    width: 24px;
    height: 24px;
  }
  .action-icon svg {
    width: 18px;
    height: 18px;
  }
}
</style>