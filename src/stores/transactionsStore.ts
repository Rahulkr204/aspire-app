import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Transaction, TransactionCategory, TransactionStatus, TransactionType } from '../types'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([
    {
      id: 1,
      merchant: 'Hamleys',
      date: '20 May 2020',
      amount: 150,
      type: TransactionType.CREDIT,
      category: TransactionCategory.SHOPPING,
      status: TransactionStatus.COMPLETED,
      cardId: 1,
    },
    {
      id: 2,
      merchant: 'Singapore Airlines',
      date: '20 May 2020',
      amount: -750,
      type: TransactionType.DEBIT,
      category: TransactionCategory.TRAVEL,
      status: TransactionStatus.COMPLETED,
      cardId: 1,
    },
    {
      id: 3,
      merchant: 'McDonalds',
      date: '20 May 2020',
      amount: -150,
      type: TransactionType.DEBIT,
      category: TransactionCategory.FOOD,
      status: TransactionStatus.COMPLETED,
      cardId: 1,
    },
    {
      id: 4,
      merchant: 'Uber',
      date: '21 May 2020',
      amount: -650,
      type: TransactionType.DEBIT,
      category: TransactionCategory.TRAVEL,
      status: TransactionStatus.COMPLETED,
      cardId: 2,
    },
    {
      id: 5,
      merchant: 'Blue Tokai',
      date: '21 May 2020',
      amount: -250,
      type: TransactionType.DEBIT,
      category: TransactionCategory.FOOD,
      status: TransactionStatus.COMPLETED,
      cardId: 1,
    },
  ])

  const getCardTransactions = (cardId: number): Transaction[] => {
    return transactions.value.filter(t => t.cardId === cardId)
  }

  // Use a partial transaction type for adding new transactions
  interface PartialTransaction extends Omit<Transaction, 'id'> {}

  const addTransaction = (transaction: PartialTransaction): Transaction => {
    const newId = transactions.value.length > 0
      ? Math.max(...transactions.value.map(t => t.id)) + 1
      : 1

    const newTransaction: Transaction = {
      id: newId,
      ...transaction
    }

    transactions.value.push(newTransaction)
    return newTransaction
  }

  console.log(transactions, "<-- tr")

  return {
    transactions,
    getCardTransactions,
    addTransaction
  }
})