// Generate random card number
  export const generateCardNumber = (): string => {
    const prefixes: string[] = ['4', '5', '3', '6']
    const prefix: string = prefixes[Math.floor(Math.random() * prefixes.length)]
    let number: string = prefix
    for (let i = 0; i < 15; i++) {
      number += Math.floor(Math.random() * 10)
    }
    // Format as **** **** **** ****
    return number.replace(/(.{4})/g, '$1 ').trim()
  }

  // Generate random expiry date (within next 4 years)
  export const generateExpiryDate = (): string => {
    const now = new Date()
    const month = Math.floor(Math.random() * 12) + 1
    const year = now.getFullYear() + Math.floor(Math.random() * 4)
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
  }

  // Generate random CVV
  export const generateCVV = (): string => {
    return Math.floor(100 + Math.random() * 900).toString()
  }
