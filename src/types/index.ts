// Card Types
export interface Card {
  id: number;
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  frozen: boolean;
  type: CardType;
}

export type CardType = 'visa' | 'mastercard' | 'amex';

export interface NewCardInput {
  name: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  cardId: number;
  merchant: string;
  amount: number;
  date: string;
  category: TransactionCategory;
  status: TransactionStatus;
  type: TransactionType;
}

export enum TransactionCategory {
  SHOPPING = 'shopping',
  FOOD = 'food',
  TRAVEL = 'travel',
  ENTERTAINMENT = 'entertainment',
  UTILITIES = 'utilities',
  OTHER = 'other'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  REFUNDED = 'refunded'
}

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

// Store Types
export interface CardsState {
  availableBalance: number;
  cards: Card[];
  selectedCardIndex: number;
}

export interface TransactionsState {
  transactions: Transaction[];
}