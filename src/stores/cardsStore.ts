import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Card, CardType, NewCardInput } from '../types'
import { generateCardNumber, generateExpiryDate, generateCVV } from '../utils/index'

export const useCardsStore = defineStore('cards', () => {
  const availableBalance = ref<number>(3000)
  const cards = ref<Card[]>([
    {
      id: 1,
      name: 'Mark Henry',
      cardNumber: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      frozen: false,
      type: 'visa'
    }
  ])
  const selectedCardIndex = ref<number>(0)
  // Add a new card
  const addCard = (nameOrCardObj: string | NewCardInput, cardNumber?: string, expiryDate?: string, cvv?: string): Card => {
    const newId = cards.value.length > 0
      ? Math.max(...cards.value.map(card => card.id)) + 1
      : 1

    let newCard: Card;

    // If first parameter is an object, use it as the card data
    if (typeof nameOrCardObj === 'object' && nameOrCardObj !== null) {
      const cardObj = nameOrCardObj as NewCardInput;
      newCard = {
        id: newId,
        name: cardObj.name || 'New Card',
        cardNumber: cardObj.cardNumber || generateCardNumber(),
        expiryDate: cardObj.expiryDate || generateExpiryDate(),
        cvv: cardObj.cvv || generateCVV(),
        frozen: false,
        type: determineCardType(cardObj.cardNumber || generateCardNumber())
      }
    } else {
      // Otherwise use individual parameters (backward compatibility)
      const actualCardNumber = cardNumber || generateCardNumber();
      newCard = {
        id: newId,
        name: nameOrCardObj || 'New Card',
        cardNumber: actualCardNumber,
        expiryDate: expiryDate || generateExpiryDate(),
        cvv: cvv || generateCVV(),
        frozen: false,
        type: determineCardType(actualCardNumber)
      }
    }
    cards.value.push(newCard)
    return newCard
  }

  // Determine card type based on first digit
  const determineCardType = (cardNumber: string): CardType => {
    const firstDigit = cardNumber.replace(/\s/g, '').charAt(0);

    switch (firstDigit) {
      case '4':
        return 'visa';
      case '5':
        return 'mastercard';
      case '3':
        return 'amex';
      default:
        return 'visa';
    }
  }

  // Toggle card freeze status
  const toggleCardFreeze = (cardId: number): void => {
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