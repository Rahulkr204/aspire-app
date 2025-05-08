<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from "@iconify/vue";
import { Transaction } from '../types'

interface Props {
  transactions: Transaction[];
}

const props = defineProps<Props>()

// Control the active accordion panel
const activeKey = ref<string[]>(['2']) // Default to open 'Recent transactions'
const showAllTransactions = ref<boolean>(false)

const formatAmount = (amount: number): string => {
  const prefix = amount > 0 ? '+ ' : '- '
  return `${prefix}S$ ${Math.abs(amount)}`
}

const getAmountClass = (amount: number): string => {
  return amount > 0 ? 'positive' : 'negative'
}

const toggleShowAllTransactions = (): void => {
  showAllTransactions.value = !showAllTransactions.value
}

const visibleTransactions = computed((): Transaction[] => {
  if (showAllTransactions.value) {
    return props.transactions
  }
  return props.transactions.slice(0, 3)
})
</script>

<template>
    <div class="transaction-accordion-list">
        <a-collapse v-model:activeKey="activeKey" accordion class="custom-collapse">
            <a-collapse-panel key="1" class="custom-panel">
                <template #header>
                    <div class="panel-header">
                        <div class="panel-label">
                            <span class="panel-icon card-details-icon">
                                <Icon icon="solar:card-2-broken" width="24" height="24" style="color: #325BAF" />
                            </span>
                            <span>Card details</span>
                        </div>
                        <Icon
                            :icon="activeKey && activeKey[0] === '1' ? `icons8:chevron-up-round` : `icons8:chevron-down-round`"
                            width="24" height="24" style="color: #325BAF" />

                    </div>
                </template>
                <p class="panel-content-placeholder">Card details will be displayed here.</p>
            </a-collapse-panel>

            <a-collapse-panel key="2" class="custom-panel">
                <template #header>
                    <div class="panel-header">
                        <div class="panel-label">
                            <span class="panel-icon recent-tx-icon">
                                <Icon icon="humbleicons:arrows-right-left" width="24" height="24"
                                    style="color: #325BAF" />
                            </span>
                            <span>Recent transactions</span>
                        </div>
                        <Icon
                            :icon="activeKey && activeKey[0] === '2' ? `icons8:chevron-up-round` : `icons8:chevron-down-round`"
                            width="24" height="24" style="color: #325BAF" />
                    </div>
                </template>
                <div v-if="transactions.length === 0" class="no-transactions">
                    <p>No transactions found for this card.</p>
                </div>

                <div v-else class="transaction-items-container">
                    <div class="transaction-items">
                        <TransitionGroup name="transaction-list">
                            <div v-for="transaction in visibleTransactions" :key="transaction.id"
                                class="transaction-item">
                                <div class="transaction-icon-container">
                                    <div class="transaction-icon">
                                        <!-- Shopping icon -->
                                        <Icon v-if="transaction.category === 'shopping'" icon="ph:shopping-bag-bold"
                                            class="transaction-category-icon" width="24" height="24"
                                            style="color: #009DFF" />
                                        <!-- Flight icon -->
                                        <Icon v-else-if="transaction.category === 'travel'" icon="mdi:flight"
                                            class="transaction-category-icon" width="24" height="24"
                                            style="color: #00D6B6" />
                                        <!-- Megaphone icon -->
                                        <Icon v-else-if="transaction.category === 'food'"
                                            icon="mingcute:fork-spoon-line" class="transaction-category-icon" width="24"
                                            height="24" style="color: #F25195" />
                                    </div>
                                </div>

                                <div class="transaction-details">
                                    <div class="transaction-header">
                                        <div class="merchant">{{ transaction.merchant }}</div>
                                        <div class="amount" :class="getAmountClass(transaction.amount)">
                                            {{ formatAmount(transaction.amount) }}
                                        </div>
                                    </div>
                                    <div class="transaction-meta">
                                        <div class="date">{{ transaction.date }}</div>
                                        <div class="badge-container">
                                            <span class="badge-icon">
                                                <Icon icon="solar:card-linear" width="24" height="24"
                                                    class="badge-svg-icon" style="color: white" />
                                            </span>
                                            <span v-if="transaction.type === 'credit'" class="badge-text">
                                                Refund on debit card
                                            </span>
                                            <span v-else class="badge-text">
                                                Charged to debit card
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="transaction-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>

                <div class="view-all" v-if="transactions.length > 3" @click="toggleShowAllTransactions">
                    <a>{{ showAllTransactions ? 'Show less' : 'View all card transactions' }}</a>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<style scoped>
/* Transaction list animations */
.transaction-list-enter-active,
.transaction-list-leave-active {
  transition: all 0.4s ease;
  max-height: 150px;
  opacity: 1;
  overflow: hidden;
}

.transaction-list-enter-from,
.transaction-list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(10px);
}

.transaction-list-move {
  transition: transform 0.4s ease;
}

.transaction-items-container {
  overflow: hidden;
}

.transaction-items {
  display: flex;
  flex-direction: column;
  transition: max-height 0.5s ease-in-out;
}

.transaction-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-accordion-list {
}

.custom-collapse {
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.custom-panel {
  background-color: var(--blue-shade);
  border-radius: 12px !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: none !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    padding: 0.5rem 0;
    font-size: 1rem;
    color: #0D365A;
    font-weight: 400;
}
.panel-label {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
}
.panel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.panel-extra-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #FAFAFA;
    width: 24px;
    height: 24px;
}

/* Hide default arrow */
.custom-panel :deep(.ant-collapse-arrow) {
    display: none !important;
}

/* Panel Content Styling */
.custom-panel :deep(.ant-collapse-content) {
    border-top: 1px solid #F5F5F5;
    background-color: white;
    padding: 0 !important;
    transition: height 0.3s ease-in-out;
}

.custom-panel :deep(.ant-collapse-content-box) {
    padding: 0 !important;
    height: 100%;
}

.panel-content-placeholder {
    padding: 16px;
    color: #888;
    font-size: 14px;
    margin: 0;
}

/* Transaction List specific styles (mostly inherited) */
.no-transactions {
  text-align: center;
  padding: 24px;
  color: #888;
}

.transaction-icon-container {
  margin-right: 16px;
  flex-shrink: 0;
}

.transaction-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-color: #E5F5FF;
}

.transaction-details {
  flex: 1;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.merchant {
  font-weight: 600;
  font-size: 1.1rem;
}

.amount {
  font-weight: 600;
  font-size: 1rem;
}

.amount.positive { color: #01D167; }
.amount.negative { color: #222222; font-weight: bold; } /* Black and bold for negative */

.transaction-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date {
  font-size: 13px;
  color: #AAAAAA;
}

/* Badge styling */
.badge-container {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: bold;
    color: #325BAF;
    margin-top: 0.5rem;
}
.badge-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #325BAF;
    border-radius: 50%;
    width: 16px;
    height: 16px;
}
.badge-icon svg {
    width: 10px;
    height: 10px;
}

.transaction-arrow {
  margin-left: 12px;
}

.view-all {
  text-align: center;
  padding: 16px;
  background-color: rgba(1, 209, 103, 0.2);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-all:hover {
  background-color: rgba(1, 209, 103, 0.3);
}

.view-all a {
  color: #01D167;
  font-weight: 500;
  font-size: 14px;
  transition: opacity 0.2s ease;
}

/* Mobile responsiveness improvements */
@media (max-width: 767px) {
  .custom-collapse {
    gap: 16px;
  }

  .transaction-item {
    padding: 12px;
  }

  .transaction-icon {
    width: 40px;
    height: 40px;
  }

  .transaction-icon-container {
    margin-right: 12px;
  }

  .merchant {
    font-size: 0.9rem;
  }

  .amount {
    font-size: 0.9rem;
  }

  .transaction-arrow {
    margin-left: 6px;
  }

  .transaction-arrow svg {
    width: 14px;
    height: 14px;
  }

  .view-all {
    padding: 12px;
    font-size: 12px;
  }

  .date {
    font-size: 11px;
  }

  .transaction-category-icon {
    width: 20px !important;
    height: 20px !important;
  }

  .badge-svg-icon {
    width: 12px !important;
    height: 12px !important;
  }
}
</style>