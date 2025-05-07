import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([
    {
      id: 1,
      merchant: 'Hamleys',
      date: '20 May 2020',
      amount: 150,
      type: 'refund',
      cardId: 1
    },
    {
      id: 2,
      merchant: 'Hamleys',
      date: '20 May 2020',
      amount: -150,
      type: 'charge',
      cardId: 1
    },
    {
      id: 3,
      merchant: 'Hamleys',
      date: '20 May 2020',
      amount: -150,
      type: 'charge',
      cardId: 1
    }
  ])

  const getCardTransactions = (cardId) => {
    return transactions.value.filter(t => t.cardId === cardId)
  }

  const addTransaction = (transaction) => {
    const newId = transactions.value.length > 0
      ? Math.max(...transactions.value.map(t => t.id)) + 1
      : 1

    const newTransaction = {
      id: newId,
      ...transaction
    }

    transactions.value.push(newTransaction)
    return newTransaction
  }

  return {
    transactions,
    getCardTransactions,
    addTransaction
  }
})