<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCardsStore } from '../stores/cardsStore'
import { useTransactionsStore } from '../stores/transactionsStore'
import { Tabs, Button, Modal, Form, Input, message } from 'ant-design-vue'
import CardComponent from '../components/CardComponent.vue'
import CardActions from '../components/CardActions.vue'
import TransactionList from '../components/TransactionList.vue'

const cardsStore = useCardsStore()
const transactionsStore = useTransactionsStore()

const activeTabKey = ref('1')
const showNewCardModal = ref(false)
const formRef = ref(null)
const newCardName = ref('')
const showCardNumber = ref(false)

const isMobileView = ref(window.innerWidth < 768)

const updateMobileState = () => {
  isMobileView.value = window.innerWidth < 768
}

onMounted(() => {
  updateMobileState()
  window.addEventListener('resize', updateMobileState)
})

const selectedCard = computed(() => {
  return cardsStore.cards[cardsStore.selectedCardIndex]
})

const cardTransactions = computed(() => {
  if (!selectedCard.value) return []
  return transactionsStore.getCardTransactions(selectedCard.value.id)
})

const handleTabChange = (key) => {
  activeTabKey.value = key
}

const openNewCardModal = () => {
  showNewCardModal.value = true
}

const closeNewCardModal = () => {
  showNewCardModal.value = false
  newCardName.value = ''
}

const handleNewCardSubmit = () => {
  if (formRef.value) {
    formRef.value.validate().then(() => {
      cardsStore.addCard(newCardName.value)
      message.success('New card added successfully')
      closeNewCardModal()
    }).catch(error => {
      console.error('Validation failed:', error)
    })
  } else {
    cardsStore.addCard(newCardName.value || 'New Card')
    message.success('New card added successfully')
    closeNewCardModal()
  }
}

const toggleCardNumberVisibility = () => {
  showCardNumber.value = !showCardNumber.value
}

watch(
  () => cardsStore.cards,
  (cards) => {
    localStorage.setItem('cards', JSON.stringify(cards))
  },
  { deep: true }
)

watch(
  () => transactionsStore.transactions,
  (transactions) => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  },
  { deep: true }
)

onMounted(() => {
  const savedCards = localStorage.getItem('cards')
  if (savedCards) {
    try { cardsStore.cards = JSON.parse(savedCards) }
    catch (e) { console.error('Error parsing saved cards:', e) }
  }
  const savedTransactions = localStorage.getItem('transactions')
  if (savedTransactions) {
    try { transactionsStore.transactions = JSON.parse(savedTransactions) }
    catch (e) { console.error('Error parsing saved transactions:', e) }
  }
})
</script>

<template>
  <div class="cards-view">
    <div class="mobile-header">
      <div class="mobile-balance-section">
        <h3 class="mobile-balance-label">Account balance</h3>
        <div class="mobile-balance-amount">
          <span class="mobile-currency">S$</span>
          <span class="mobile-amount">{{ cardsStore.availableBalance.toLocaleString() }}</span>
        </div>
      </div>
      <a-button type="primary" class="mobile-new-card-btn" @click="openNewCardModal">
        <span class="btn-icon">+</span>
        New card
      </a-button>
    </div>

    <div class="balance-section desktop-only">
      <h3 class="balance-label">Available balance</h3>
      <div class="balance-amount">
        <span class="currency">S$</span>
        <span class="amount">{{ cardsStore.availableBalance.toLocaleString() }}</span>
      </div>
      <a-button type="primary" class="new-card-btn" @click="openNewCardModal">
        <span class="btn-icon">+</span>
        New card
      </a-button>
    </div>

    <div class="tabs-container">
      <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange" class="custom-tabs">
        <a-tab-pane key="1" tab="My debit cards">
          <div class="card-section">
            <div class="card-visibility">
              <a-button type="link" @click="toggleCardNumberVisibility" class="show-number-btn">
                <span class="eye-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01D167" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                {{ showCardNumber ? 'Hide card number' : 'Show card number' }}
              </a-button>
            </div>
            <div class="card-carousel">
              <CardComponent
                v-for="(card, index) in cardsStore.cards"
                :key="card.id"
                :card="card"
                :isVisible="showCardNumber"
                :isActive="index === cardsStore.selectedCardIndex"
                @click="cardsStore.selectedCardIndex = index"
              />
            </div>
            <div class="carousel-indicators">
              <span
                v-for="(card, index) in cardsStore.cards"
                :key="index"
                :class="['carousel-dot', { active: index === cardsStore.selectedCardIndex }]"
                @click="cardsStore.selectedCardIndex = index"
              ></span>
            </div>
            <CardActions
              v-if="selectedCard"
              :cardId="selectedCard.id"
              :isFrozen="selectedCard.frozen"
            />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="All company cards">
          <div class="company-cards-placeholder">
            <p>All company cards will be displayed here.</p>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <div class="transactions-section">
       <TransactionList :transactions="cardTransactions" />
    </div>

    <a-modal
      v-model:visible="showNewCardModal"
      title="Add New Card"
      @ok="handleNewCardSubmit"
      @cancel="closeNewCardModal"
      okText="Add Card"
      :width="isMobileView ? '100%' : 520"
      :style="isMobileView ? { top: '0', maxWidth: '100%', margin: '0', height: '100vh', paddingBottom: '0px' } : {}"
      :wrapClassName="isMobileView ? 'full-screen-modal' : ''"
    >
      <a-form ref="formRef" :model="{ cardName: newCardName }">
        <a-form-item name="cardName" label="Card Name" :rules="[{ required: true, message: 'Please enter card name' }]">
          <a-input v-model:value="newCardName" placeholder="Enter card holder name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style>
.cards-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Mobile Header specific styles */
.mobile-header {
  display: none;
  background-color: #0C365A;
  padding: 16px;
  color: white;
}
.mobile-balance-section { margin-bottom: 12px; }
.mobile-balance-label { font-size: 13px; opacity: 0.7; margin-bottom: 2px; }
.mobile-balance-amount { display: flex; align-items: baseline; }
.mobile-currency { font-size: 13px; font-weight: bold; background-color: #01D167; padding: 3px 5px; border-radius: 3px; margin-right: 6px; }
.mobile-amount { font-size: 22px; font-weight: bold; }
.mobile-new-card-btn { position: absolute; top: 16px; right: 16px; font-size: 12px; padding: 4px 10px; }
.mobile-new-card-btn .btn-icon { font-size: 14px; margin-right: 4px; }

/* Desktop balance section */
.balance-section.desktop-only {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.balance-label { font-size: 14px; color: #222; font-weight: normal; margin: 0; }
.balance-amount { display: flex; align-items: baseline; }
.currency { font-size: 14px; font-weight: bold; color: white; background-color: #01D167; padding: 4px 6px; border-radius: 4px; margin-right: 8px; }
.amount { font-size: 24px; font-weight: bold; }
.new-card-btn { background-color: #325BAF; border-color: #325BAF; height: auto; padding: 8px 16px; border-radius: 4px; display: flex; align-items: center; }
.new-card-btn .btn-icon { margin-right: 8px; font-weight: bold; font-size: 16px; }

/* Tabs container and custom tab styles */
.tabs-container {
  margin-bottom: 24px;
}
.custom-tabs :deep(.ant-tabs-nav) { margin-bottom: 24px !important; }
.custom-tabs :deep(.ant-tabs-tab) { padding: 12px 0; margin-right: 32px; font-size: 14px; }
.custom-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) { font-weight: 600; color: #222; }
.custom-tabs :deep(.ant-tabs-ink-bar) { background-color: #01D167; height: 3px !important; }

/* Card section */
.card-section {
  margin-top: 16px;
  padding: 16px;
}
.card-visibility { display: flex; justify-content: flex-end; margin-bottom: 16px; }
.show-number-btn { display: flex; align-items: center; color: #01D167; padding: 0; font-size: 13px; }
.eye-icon { margin-right: 8px; display: flex; align-items: center; }
.card-carousel {
  display: flex;
  overflow-x: auto;
  padding: 16px 0;
  gap: 16px;
  scroll-snap-type: x mandatory;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
}
.carousel-indicators { display: flex; justify-content: center; gap: 8px; margin: 16px 0; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #eee; cursor: pointer; transition: background-color 0.3s, width 0.3s; }
.carousel-dot.active { background-color: #01D167; width: 20px; border-radius: 4px; }

/* Transactions section */
.transactions-section {
  margin-top: 32px;
}
.company-cards-placeholder { padding: 32px; text-align: center; color: #888; }

/* Mobile specific styles */
@media (max-width: 767px) {
  .cards-view {
    padding: 0;
  }
  .desktop-only {
    display: none !important;
  }
  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: static;
    background-color: #0C365A;
    padding: 16px;
    color: white;
    z-index: auto;
  }
  .mobile-balance-section { margin-bottom: 0; }
  .mobile-new-card-btn { position: static; }

  .tabs-container {
    padding: 0 16px;
    margin-top: 16px;
  }
  .custom-tabs :deep(.ant-tabs-nav) {
    background-color: inherit;
    padding-left: 0;
    padding-right: 0;
  }
  .custom-tabs :deep(.ant-tabs-tab-btn) {
    color: rgba(0,0,0,0.65);
  }
  .custom-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #222;
  }
  .custom-tabs :deep(.ant-tabs-content-holder) {
    background-color: inherit;
  }

  .card-section {
    background-color: white;
    padding: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-top: 16px;
  }
  .card-carousel {
    padding-left: 16px;
    padding-right: 16px;
    margin-left: -16px;
    margin-right: -16px;
    gap: 12px;
  }
  .show-number-btn {
     padding-right: 0;
  }

  .transactions-section {
    background-color: inherit;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 0 16px;
    margin-top: 32px;
    position: static;
    z-index: auto;
  }
  .desktop-transactions-only {
    display: none !important;
  }
  .transactions-section:not(.mobile-scrollable-content) {
    display: block;
  }

  .full-screen-modal .ant-modal { max-width: 100%; top: 0; padding-bottom: 0; margin: 0; }
  .full-screen-modal .ant-modal-content { display: flex; flex-direction: column; height: 100vh; border-radius: 0; }
  .full-screen-modal .ant-modal-body { flex-grow: 1; overflow-y: auto; }
}
</style>