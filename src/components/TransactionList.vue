<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from "@iconify/vue";
import { Transaction } from '../types'
import { useDeviceDetection } from '../composables/useDeviceDetection'

interface Props {
  transactions: Transaction[];
}

const props = defineProps<Props>()
const { isMobile } = useDeviceDetection()

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
        <a-collapse v-model:activeKey="activeKey" accordion class="custom-collapse"
            :class="{ 'mobile-collapse': isMobile }">
            <a-collapse-panel key="1" class="custom-panel">
                <template #header>
                    <div class="panel-header">
                        <div class="panel-label">
                            <span class="panel-icon card-details-icon">
                                <Icon icon="solar:card-2-broken" :width="isMobile ? '20' : '24'"
                                    :height="isMobile ? '20' : '24'" style="color: #325BAF" />
                            </span>
                            <span>Card details</span>
                        </div>
                        <Icon
                            :icon="activeKey && activeKey[0] === '1' ? `ion:chevron-up-circle` : `ion:chevron-down-circle`"
                            :width="isMobile ? '20' : '24'" :height="isMobile ? '20' : '24'" style="color: #D8E1F4" />

                    </div>
                </template>
                <p class="panel-content-placeholder">Card details will be displayed here.</p>
            </a-collapse-panel>

            <a-collapse-panel key="2" class="custom-panel">
                <template #header>
                    <div class="panel-header">
                        <div class="panel-label">
                            <span class="panel-icon recent-tx-icon">
                                <Icon icon="humbleicons:arrows-right-left" :width="isMobile ? '20' : '24'"
                                    :height="isMobile ? '20' : '24'" style="color: #325BAF" />
                            </span>
                            <span>Recent transactions</span>
                        </div>
                        <Icon
                            :icon="activeKey && activeKey[0] === '2' ? `ion:chevron-up-circle` : `ion:chevron-down-circle`"
                            :width="isMobile ? '20' : '24'" :height="isMobile ? '20' : '24'" style="color: #D8E1F4" />
                    </div>
                </template>
                <div v-if="transactions.length === 0" class="no-transactions">
                    <p>No transactions found for this card.</p>
                </div>

                <div v-else class="transaction-items-container">
                    <div class="transaction-items">
                        <TransitionGroup name="transaction-list">
                            <div v-for="transaction in visibleTransactions" :key="transaction.id"
                                class="transaction-item" :class="{ 'mobile-item': isMobile }">
                                <div class="transaction-icon-container" :class="{ 'mobile-icon-container': isMobile }">
                                    <div class="transaction-icon" :class="{ 'mobile-icon': isMobile }">
                                        <!-- Shopping icon -->
                                        <Icon v-if="transaction.category === 'shopping'" icon="ph:shopping-bag-bold"
                                            class="transaction-category-icon" :width="isMobile ? '20' : '24'"
                                            :height="isMobile ? '20' : '24'" style="color: #009DFF" />
                                        <!-- Flight icon -->
                                        <Icon v-else-if="transaction.category === 'travel'" icon="mdi:flight"
                                            class="transaction-category-icon" :width="isMobile ? '20' : '24'"
                                            :height="isMobile ? '20' : '24'" style="color: #00D6B6" />
                                        <!-- Megaphone icon -->
                                        <Icon v-else-if="transaction.category === 'food'"
                                            icon="mingcute:fork-spoon-line" class="transaction-category-icon"
                                            :width="isMobile ? '20' : '24'" :height="isMobile ? '20' : '24'"
                                            style="color: #F25195" />
                                    </div>
                                </div>

                                <div class="transaction-details">
                                    <div class="transaction-header">
                                        <div class="merchant" :class="{ 'mobile-merchant': isMobile }">{{
                                            transaction.merchant }}</div>
                                        <div class="amount"
                                            :class="[getAmountClass(transaction.amount), { 'mobile-amount': isMobile }]">
                                            {{ formatAmount(transaction.amount) }}
                                        </div>
                                    </div>
                                    <div class="transaction-meta">
                                        <div class="date" :class="{ 'mobile-date': isMobile }">{{ transaction.date }}
                                        </div>
                                        <div class="badge-container">
                                            <span class="badge-icon">
                                                <Icon icon="solar:card-linear" :width="isMobile ? '12' : '24'"
                                                    :height="isMobile ? '12' : '24'" class="badge-svg-icon"
                                                    style="color: white" />
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
                            </div>
                        </TransitionGroup>
                    </div>
                </div>

                <div class="view-all" v-if="transactions.length > 3" @click="toggleShowAllTransactions"
                    :class="{ 'mobile-view-all': isMobile }">
                    <a>{{ showAllTransactions ? 'Show less' : 'View all card transactions' }}</a>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<style scoped>
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

.mobile-item {
  padding: 12px;
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

.mobile-collapse {
  gap: 16px;
  padding-bottom: 3rem;
}

.custom-panel {
  background-color: #eff3fb;
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

.custom-panel :deep(.ant-collapse-arrow) {
    display: none !important;
}

.custom-panel :deep(.ant-collapse-content) {
    border-top: 1px solid #F5F9FF;
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

.no-transactions {
  text-align: center;
  padding: 24px;
  color: #888;
}

.transaction-icon-container {
  margin-right: 16px;
  flex-shrink: 0;
}

.mobile-icon-container {
  margin-right: 12px;
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

.mobile-icon {
  width: 40px;
  height: 40px;
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

.mobile-merchant {
  font-size: 0.9rem;
}

.amount {
  font-weight: 600;
  font-size: 1rem;
}

.mobile-amount {
  font-size: 0.9rem;
}

.amount.positive {
    color: var(--primary-color);
}
.amount.negative {
    color: #222222;
    font-weight: bold;
}

.transaction-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date {
  font-size: 13px;
  color: #AAAAAA;
}

.mobile-date {
  font-size: 11px;
}

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

.mobile-arrow {
  margin-left: 6px;
}

.view-all {
  text-align: center;
  padding: 16px;
  background-color: rgba(1, 209, 103, 0.2);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mobile-view-all {
  padding: 12px;
  font-size: 12px;
}

.view-all:hover {
  background-color: rgba(1, 209, 103, 0.3);
}

.view-all a {
  color: var(--primary-color);
  font-weight: 500;
  font-size: 14px;
  transition: opacity 0.2s ease;
}
</style>