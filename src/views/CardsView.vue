<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, defineAsyncComponent, onUnmounted } from 'vue'
import { useCardsStore } from '../stores/cardsStore'
import { useTransactionsStore } from '../stores/transactionsStore'
import { message } from 'ant-design-vue'
// Lazy load components that are not needed immediately
const CardCarousel = defineAsyncComponent(() => import('../components/CardCarousel.vue'))
const CardActions = defineAsyncComponent(() => import('../components/CardActions.vue'))
const TransactionList = defineAsyncComponent(() => import('../components/TransactionList.vue'))
import { Card, Transaction, NewCardInput } from '../types'
import { generateCardNumber, generateExpiryDate, generateCVV } from '../utils/index'

import { Icon } from "@iconify/vue";

const cardsStore = useCardsStore()
const transactionsStore = useTransactionsStore()

const activeTabKey = ref<string>('1')
const showNewCardModal = ref<boolean>(false)
const formRef = ref<any>(null)
const showCardNumber = ref<boolean>(false)
const nameInputRef = ref<any>(null)
const isLoading = ref<boolean>(false)
const formSubmitError = ref<string | null>(null)

// Using a single reactive object for the new card form
const newCard = reactive<NewCardInput>({
  name: '',
  cardNumber: generateCardNumber(),
  expiryDate: generateExpiryDate(),
  cvv: generateCVV()
})
const isMobileView = ref<boolean>(window.innerWidth < 768)

const updateMobileState = (): void => {
  isMobileView.value = window.innerWidth < 768
}

onMounted(() => {
  updateMobileState()
  window.addEventListener('resize', updateMobileState)

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

// Cleanup event listeners to prevent memory leaks
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState)
})

const selectedCard = computed<Card | undefined>(() => {
  return cardsStore.cards[cardsStore.selectedCardIndex]
})

const cardTransactions = computed<Transaction[]>(() => {
  if (!selectedCard.value) return []
  return transactionsStore.getCardTransactions(selectedCard.value.id)
})

const handleTabChange = (key: string): void => {
  activeTabKey.value = key
}

const openNewCardModal = (): void => {
  // Regenerate card values each time modal is opened
  Object.assign(newCard, {
    name: '',
    cardNumber: generateCardNumber(),
    expiryDate: generateExpiryDate(),
    cvv: generateCVV()
  })
  showNewCardModal.value = true
  // Focus on the name input field after the modal is opened
  setTimeout(() => {
    if (nameInputRef.value) {
      nameInputRef.value.focus()
    }
  }, 100)
}

const closeNewCardModal = (): void => {
  showNewCardModal.value = false
  // Reset only the name field
  newCard.name = ''
}

const formatCardNumber = (e: Event): void => {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
  const parts = []

  for (let i = 0; i < val.length; i += 4) {
    parts.push(val.substring(i, i + 4))
  }

  if (parts.length) {
    newCard.cardNumber = parts.join(" ")
  } else {
    newCard.cardNumber = val
  }
}

const formatExpiryDate = (e: Event): void => {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")

  if (val.length > 2) {
    newCard.expiryDate = val.substring(0, 2) + "/" + val.substring(2, 4)
  } else {
    newCard.expiryDate = val
  }
}

const handleNewCardSubmit = (): void => {
  formSubmitError.value = null;
  if (formRef.value) {
    isLoading.value = true;
    formRef.value.validate().then(() => {
      try {
        cardsStore.addCard(newCard);
        message.success('New card added successfully');
        closeNewCardModal();
      } catch (error) {
        console.error('Error adding card:', error);
        formSubmitError.value = 'Failed to add card. Please try again.';
        message.error('Failed to add card');
      } finally {
        isLoading.value = false;
      }
    }).catch((error: any) => {
      console.error('Validation failed:', error);
      isLoading.value = false;
    });
  } else {
    try {
      cardsStore.addCard(newCard);
      message.success('New card added successfully');
      closeNewCardModal();
    } catch (error) {
      console.error('Error adding card:', error);
      message.error('Failed to add card');
    }
  }
}

const toggleCardNumberVisibility = (): void => {
  showCardNumber.value = !showCardNumber.value
}

// Regular expressions for card input validation
const cardNumberPattern = /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/
const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
const cvvPattern = /^[0-9]{3}$/

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
</script>

<template>
    <div class="cards-view">
        <div class="mobile-header" v-if="isMobileView">
            <div class="logo-container">
                <img class="mobile-logo"
                    src="https://cdn.prod.website-files.com/5ed5b60be1889f546024ada0/672b1e9d21d98dcfc6d10d5a_aspire-logo-p-500.png"
                    width="120"
                    height="32"
                    loading="lazy"
                    alt="Aspire Logo" />
            </div>
            <div class="mobile-content">
                <div class="mobile-balance-section">
                    <h3 class="mobile-balance-label">Account balance</h3>
                    <div class="mobile-balance-amount">
                        <span class="mobile-currency">S$</span>
                        <span class="mobile-amount">{{ cardsStore.availableBalance.toLocaleString() }}</span>
                    </div>
                </div>
                <a-button type="text" class="mobile-new-card-btn" @click="openNewCardModal" aria-label="Add new card">
                    <Icon icon="icon-park-solid:add-one" width="20" height="20" style="color: #fff" aria-hidden="true" />
                    <span>New card</span>
                </a-button>
            </div>
        </div>

        <div class="balance-section desktop-only">
            <div>
                <h3 class="balance-label">Available balance</h3>
                <div class="balance-amount">
                    <span class="currency">S$</span>
                    <span class="amount">{{ cardsStore.availableBalance.toLocaleString() }}</span>
                </div>
            </div>
            <a-button type="primary" class="new-card-btn" @click="openNewCardModal" aria-label="Add new card">
                <Icon icon="icon-park-solid:add-one" width="20" height="20" style="color: #fff" aria-hidden="true" />
                New card
            </a-button>
        </div>

        <div class="tabs-container">
            <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange" class="custom-tabs">
                <a-tab-pane key="1" tab="My debit cards" class="cards-tab-pane">
                    <div class="card-section">
                        <div class="leftSection">
                            <div class="card-visibility">
                                <a-button type="text" @click="toggleCardNumberVisibility" class="show-number-btn" aria-label="Toggle card number visibility">
                                    <div class="eye-icon">
                                        <Icon :icon="showCardNumber ? 'ion:eye-off' : 'ion:eye'" width="20" height="20" style="color: var(--primary-color)" aria-hidden="true" />
                                    </div>
                                    {{ showCardNumber ? 'Hide card number' : 'Show card number' }}
                                </a-button>
                            </div>
                            <div class="card-carousel-container">
                                <CardCarousel :cards="cardsStore.cards" :selectedIndex="cardsStore.selectedCardIndex"
                                    :showCardNumber="showCardNumber"
                                    @update:selectedIndex="(index) => cardsStore.selectedCardIndex = index"
                                    class="card-carousel" />
                            </div>

                            <CardActions v-if="selectedCard" :cardId="selectedCard.id"
                                :isFrozen="selectedCard.frozen" />
                        </div>
                        <div class="rightSection">
                            <TransactionList :transactions="cardTransactions" />
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="All company cards">
                    <div class="company-cards-placeholder">
                        <p>All company cards will be displayed here.</p>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>

        <a-modal destroyOnClose v-model:open="showNewCardModal" title="Add New Card" @cancel="closeNewCardModal"
            :width="isMobileView ? '100%' : 520"
            :style="isMobileView ? { top: '0', maxWidth: '100%', margin: '0', height: '100vh', paddingBottom: '0px' } : {}"
            :wrapClassName="isMobileView ? 'full-screen-modal' : ''" :footer="null">
            <a-form ref="formRef" class="card-form" :model="newCard">
                <a-form-item name="name" label="Card Holder" class="custom-form-item" required
                    :rules="[{ required: true, message: 'Please enter card holder name' }]">
                    <a-input v-model:value="newCard.name" ref="nameInputRef" placeholder="Enter card holder name" />
                </a-form-item>

                <a-form-item name="cardNumber" label="Card number" class="custom-form-item" required :rules="[
                        { required: true, message: 'Please enter card number' },
                        { pattern: cardNumberPattern, message: 'Please enter a valid card number (e.g., 1234 5678 9012 3456)' }
                    ]">
                    <div class="card-number-wrapper">
                        <a-input v-model:value="newCard.cardNumber" placeholder="1234 XXXX XXXX XXXX"
                            class="card-number-input" :maxlength="19" @input="formatCardNumber" />
                        <div class="card-logo">
                            <Icon icon="logos:mastercard" width="36" height="24" />
                        </div>
                    </div>
                </a-form-item>

                <div class="card-details-row">
                    <a-form-item name="expiryDate" label="Expires" class="expiry-form-item custom-form-item" required
                        :rules="[
                            { required: true, message: 'Please enter expiry date' },
                            { pattern: expiryPattern, message: 'Please enter a valid date (MM/YY)' }
                        ]">
                        <a-input v-model:value="newCard.expiryDate" placeholder="MM/YY" :maxlength="5"
                            @input="formatExpiryDate" />
                    </a-form-item>

                    <a-form-item name="cvv" label="Security code" class="cvv-form-item custom-form-item" required
                        :rules="[
                            { required: true, message: 'Please enter CVV' },
                            { pattern: cvvPattern, message: 'Please enter a valid CVV' }
                        ]">
                        <div class="cvv-input-container">
                            <a-input-password v-model:value="newCard.cvv" placeholder="CVC" :maxlength="3" />
                        </div>
                    </a-form-item>
                </div>

                <div class="modal-footer">
                    <a-button type="default" class="cancel-btn" @click="closeNewCardModal" :disabled="isLoading">Cancel</a-button>
                    <a-button type="primary" class="add-card-btn" @click="handleNewCardSubmit" :loading="isLoading">Add Card</a-button>
                </div>
            </a-form>
            <div v-if="formSubmitError" class="error-message">{{ formSubmitError }}</div>
        </a-modal>
    </div>
</template>

<style>
.cards-view {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.mobile-header {
    display: none;
    flex-direction: column;
    align-items: center;
    background-color: #0C365A;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.logo-container {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    background-color: #0C365A;
}
.mobile-logo {
    height: 32px;
}
.mobile-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px 12px;
}
.mobile-balance-section {
    margin-bottom: 0;
}
.mobile-balance-label {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 2px;
}
.mobile-balance-amount {
    display: flex;
    align-items: baseline;
}
.mobile-currency {
    font-size: 13px;
    font-weight: bold;
    background-color: var(--primary-color);
    padding: 3px 5px;
    border-radius: 3px;
    margin-right: 6px;
}
.mobile-amount {
    font-size: 22px;
    font-weight: bold;
}
.mobile-new-card-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #509bf6;
}
.mobile-new-card-btn span {
    font-size: 14px;
    margin-left: 8px;
}

/* Desktop balance section */
.balance-section.desktop-only {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.balance-label {
    font-size: 14px;
    color: #222;
    font-weight: 500;
    margin: 0;
}
.balance-amount {
    display: flex;
    align-items: center;
    margin-top: 0.8rem;
}
.currency {
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: var(--primary-color);
    padding: 4px 6px;
    border-radius: 4px;
    margin-right: 8px;
}
.amount {
    font-size: 1.5rem;
    font-weight: bold;
}
.new-card-btn {
    background-color: #325BAF;
    border-color: #325BAF;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.new-card-btn:hover {
    background-color: #3f74dd !important;
}
.new-card-btn span {
    margin-left: 8px;
    font-weight: bold;
    font-size: 16px;
}

/* Tabs container and custom tab styles */
.tabs-container {
  margin-bottom: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Card section */
.card-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 2.4rem;
    width: 100%;
    box-shadow: none;
    border: none;
    border-radius: 0;
    background-color: white;
    margin: 0;
    min-height: 0;
    flex: 1;
}
.leftSection {
    display: flex;
    flex-direction: column;
    width: 55%;
    padding: 0;
}
.custom-tabs .ant-tabs-nav {
    margin-bottom: 24px !important;
    padding: 0;
}
.rightSection {
    display: flex;
    flex-direction: column;
    width: 45%;
    padding-left: 1.5rem;
    margin-top: 3.2rem;
    content-visibility: auto;
    contain-intrinsic-size: 1px 500px;
}
.card-visibility {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}
.show-number-btn {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    padding: 0;
    font-size: 13px;
}
.show-number-btn:hover {
    color: #00a650 !important;
    background-color: transparent !important;
}
.eye-icon {
    margin-right: 8px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}
.card-carousel {
    margin-bottom: 12px;
}

/* Transactions section */
.transactions-section {
  margin-top: 32px;
}
.company-cards-placeholder { padding: 32px; text-align: center; color: #888; }

.custom-tabs {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.custom-tabs .ant-tabs-nav {
    margin-bottom: 24px !important;
}

.custom-tabs .ant-tabs-tab {
    padding: 8px 0 12px;
    font-size: 14px;
    margin-right: 32px;
    position: relative;
}

.custom-tabs .ant-tabs-tab + .ant-tabs-tab {
    margin-left: 0;
}

.custom-tabs .ant-tabs-ink-bar {
    color: #000000 !important;
    background-color: #24CEFD !important;
    height: 3px !important;
}

.custom-tabs .ant-tabs-tab-btn {
    color: #777777;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
}

.custom-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: #0379FF;
}

.custom-tabs .ant-tabs-tab:first-child {
    min-width: 120px;
}

.custom-tabs .ant-tabs-tab:nth-child(2) {
    min-width: 140px;
    opacity: 0.8;
}

.custom-tabs .ant-tabs-content-holder {
    border: 1px solid #F0F0F0;
    border-radius: 12px;
    padding: 0;
    margin-top: 8px;
    overflow: auto;
    flex: 1;
}

.custom-tabs .ant-tabs-content {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
}

.card-form {
    background-color: #fff;
    border-radius: 10px;
    padding: 1rem 0;
}

.custom-form-item {
    margin-bottom: 1.2rem;
}

.custom-label {
    color: #222;
    font-size: 1rem;
    font-weight: 400;
}

.card-details-row {
    display: flex;
    gap: 16px;
}

.expiry-form-item, .cvv-form-item {
    flex: 1;
}

.card-number-wrapper {
    display: flex;
    align-items: center;
}

.card-number-input {
    font-family: monospace;
    letter-spacing: 1px;
}

.card-logo {
    display: flex;
    align-items: center;
}

.cvv-input-container {
    display: flex;
    align-items: center;
    position: relative;
}

.cvv-form-item :deep(.ant-input) {
    padding-right: 30px;
}


.card-form :deep(.ant-input) {
    background-color: #ffffff;
    border: none;
    border-radius: 4px;
    color: #000000;
    height: 46px;
    padding: 10px 14px;
    box-shadow: none;
    font-size: 14px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn {
    font-weight: 400;
    height: 40px;
    border: 1px solid #EEE !important;
}

.cancel-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid #01D167 !important;
    color: var(--primary-color) !important;
}

.add-card-btn {
    background-color: #01D167 !important;
    font-weight: 500;
    height: 40px;
}

.add-card-btn:hover {
    background-color: #04be5e !important;
    border-color: #01D167 !important;
}

.full-screen-modal :deep(.ant-modal) {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
}

.full-screen-modal :deep(.ant-modal-content) {
    display: flex;
    flex-direction: column;
    border-radius: 0;
    background-color: #0C365A;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .cards-view {
        padding: 0;
        padding-top: 7rem;
    }

    .custom-tabs .ant-tabs-content-holder {
        border: none;
        margin-top: 0;
        box-shadow: none;
    }

    .custom-tabs .ant-tabs-nav {
        padding-left: 1rem;
        margin-bottom: 16px !important;
    }

    .custom-tabs .ant-tabs-tab {
        padding: 8px 0;
        margin-right: 16px;
    }

    .desktop-only {
        display: none !important;
    }

    .mobile-header {
        display: flex;
        z-index: 1000;
    }

    .mobile-balance-section {
        margin-bottom: 0;
    }

    .mobile-new-card-btn {
        position: static;
    }

    .tabs-container {
        background-color: #0C365A;
    }

    .card-visibility {
        padding: 0 1rem;
    }

    .card-carousel-container {
        padding: 0 0.5rem;
    }

    .card-section {
        flex-direction: column;
        box-shadow: none;
        border: none;
        padding: 0;
        background-color: transparent;
        border-radius: 12px;
        overflow-y: hidden;
    }

    .leftSection,
    .rightSection {
        width: 100%;
    }

    .leftSection {
        margin: 0;
    }

    .rightSection {
        background-color: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        height: 100%;
        margin: 0;
        /* border-radius: 12px 12px 0 0 !important; */
    }

    .transactions-section {
        background-color: inherit;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        padding: 0 16px;
        margin-top: 16px;
        position: static;
        z-index: auto;
    }

    .desktop-transactions-only {
        display: none !important;
    }

    .full-screen-modal .ant-modal {
        max-width: 100%;
        top: 0;
        padding-bottom: 0;
        margin: 0;
    }

    .full-screen-modal .ant-modal-content {
        display: flex;
        flex-direction: column;
        top: 20%;
        position: absolute;
        border-radius: 0;
    }

    .full-screen-modal .ant-modal-body {
        flex-grow: 1;
        overflow-y: auto;
    }
}

/* Small phone optimization */
@media (max-width: 375px) {
    .mobile-balance-amount .mobile-amount {
        font-size: 20px;
    }

    .mobile-header {
        padding-bottom: 8px;
    }

    .custom-tabs .ant-tabs-tab:first-child {
        min-width: 100px;
    }

    .custom-tabs .ant-tabs-tab:nth-child(2) {
        min-width: 120px;
    }
}

.error-message {
    color: #ff4d4f;
    font-size: 14px;
    margin-top: 12px;
    text-align: center;
}
</style>