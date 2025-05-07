# Aspire App - Vue 3 Implementation

This project is a Vue 3 implementation of the Aspire banking application design, following the requirements specified in the challenge.

## Features

- Interactive debit card management
- Add new cards with randomly generated card numbers and expiry dates
- Freeze/unfreeze cards functionality
- View transaction history
- Responsive design
- State persistence using localStorage

## Technologies Used

- Vue 3 (Composition API)
- Vue Router for navigation
- Pinia for state management
- Ant Design Vue for UI components
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Run the development server
   ```
   npm run dev
   ```
4. Open your browser and navigate to the URL displayed in the terminal (typically http://localhost:5173)

## Usage

- Navigate to the Cards section to see the main functionality
- Click "New card" to add a new debit card
- Click "Show card number" to toggle visibility of the card numbers
- Use the "Freeze card" button to freeze/unfreeze a card
- The carousel dots at the bottom can be used to navigate between multiple cards

## Project Structure

- `/src/components` - Reusable Vue components
- `/src/views` - Page views for each route
- `/src/stores` - Pinia stores for state management
- `/src/router` - Vue Router configuration
- `/src/assets` - Static assets

## Credits

This project was created based on the design and requirements provided in the Aspire app challenge.
