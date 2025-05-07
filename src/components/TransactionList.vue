<script setup>
import { computed } from 'vue'
import { Card, Collapse } from 'ant-design-vue'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

const formatAmount = (amount) => {
  const prefix = amount > 0 ? '+ ' : '- '
  return `${prefix}S$ ${Math.abs(amount)}`
}

const getAmountClass = (amount) => {
  return amount > 0 ? 'positive' : 'negative'
}

const getIconForTransaction = (type) => {
  if (type === 'refund') {
    return 'shopping'
  } else {
    return 'flight'
  }
}
</script>

<template>
  <div class="transaction-list">
    <a-card title="Card details" class="card-details-card">
      <template #extra>
        <span class="card-check-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01D167" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </span>
      </template>
      <p>Card details will be displayed here.</p>
    </a-card>

    <div class="collapsible-section">
      <div class="section-header">
        <h3>Recent transactions</h3>
        <span class="section-check-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#325BAF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </span>
      </div>

      <div v-if="transactions.length === 0" class="no-transactions">
        <p>No transactions found for this card.</p>
      </div>

      <div v-else class="transaction-items">
        <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
          <div class="transaction-icon-container">
            <!-- Shopping icon for refunds -->
            <div v-if="transaction.type === 'refund'" class="transaction-icon shopping">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <!-- Flight icon for charges -->
            <div v-else class="transaction-icon flight">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L2 22" />
                <path d="M6.5 17.5l13-13" />
                <path d="M14.5 6.5l3.5 3.5" />
                <path d="M6.5 13.5l3.5 3.5" />
              </svg>
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
              <div v-if="transaction.type === 'refund'" class="badge refund-badge">
                Refund on debit card
              </div>
              <div v-else class="badge charge-badge">
                Charged to debit card
              </div>
            </div>
          </div>

          <div class="transaction-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DDDDDD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="view-all">
        <a>View all card transactions</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.card-details-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.card-details-card :deep(.ant-card-head) {
  border-bottom: none;
  min-height: 48px;
}

.card-details-card :deep(.ant-card-head-title) {
  font-size: 16px;
  padding: 16px 0;
}

.card-check-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #FAFAFA;
  width: 24px;
  height: 24px;
}

.collapsible-section {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #F5F5F5;
}

.section-header h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.section-check-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #FAFAFA;
  width: 24px;
  height: 24px;
}

.no-transactions {
  text-align: center;
  padding: 24px;
  color: #888;
}

.transaction-items {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-item:last-child {
  border-bottom: none;
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
}

.transaction-icon.shopping {
  background-color: #01D167;
}

.transaction-icon.flight {
  background-color: #FF5F00;
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
  font-size: 15px;
}

.amount {
  font-weight: 600;
  font-size: 15px;
}

.amount.positive {
  color: #01D167;
}

.amount.negative {
  color: #FF5F00;
}

.transaction-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 13px;
  color: #888;
}

.badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.refund-badge {
  background-color: #E5F7F0;
  color: #01D167;
}

.charge-badge {
  background-color: #E9EFF6;
  color: #325BAF;
}

.transaction-arrow {
  margin-left: 12px;
}

.view-all {
  text-align: center;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.view-all a {
  color: #325BAF;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
}
</style>