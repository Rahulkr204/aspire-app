import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCardsStore = defineStore('cards', () => {
  const availableBalance = ref(3000)
  const cards = ref([
    {
      id: 1,
      name: 'Mark Henry',
      cardNumber: '4111 1111 1111 1111',
      expiryDate: '12/20',
      cvv: '***',
      frozen: false,
      type: 'visa'
    }
  ])
  const selectedCardIndex = ref(0)

  // Generate random card number
  const generateCardNumber = () => {
    const prefixes = ['4', '5', '3', '6']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    let number = prefix
    for (let i = 0; i < 15; i++) {
      number += Math.floor(Math.random() * 10)
    }
    // Format as **** **** **** ****
    return number.replace(/(.{4})/g, '$1 ').trim()
  }

  // Generate random expiry date (within next 4 years)
  const generateExpiryDate = () => {
    const now = new Date()
    const month = Math.floor(Math.random() * 12) + 1
    const year = now.getFullYear() + Math.floor(Math.random() * 4)
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
  }

  // Add a new card
  const addCard = (name) => {
    const newId = cards.value.length > 0
      ? Math.max(...cards.value.map(card => card.id)) + 1
      : 1

    const newCard = {
      id: newId,
      name,
      cardNumber: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: '***',
      frozen: false,
      type: 'visa'
    }

    cards.value.push(newCard)
    return newCard
  }

  // Toggle card freeze status
  const toggleCardFreeze = (cardId) => {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.frozen = !card.frozen
    }
  }

  return {
    availableBalance,
    cards,
    selectedCardIndex,
    addCard,
    toggleCardFreeze
  }
})