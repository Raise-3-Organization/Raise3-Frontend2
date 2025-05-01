# Raise API Integration

This directory contains the integration with the Raise API, which allows you to manage gift cards and transactions.

## Structure

- `config.ts` - API configuration and environment settings
- `client.ts` - Base API client with authentication and request handling
- `types.ts` - TypeScript types for API requests and responses
- `index.ts` - Main export file
- Service modules:
  - `brands.ts` - Functions for interacting with brands endpoints
  - `cards.ts` - Functions for interacting with cards endpoints
  - `transactions.ts` - Functions for interacting with transactions endpoints
  - `crypto.ts` - Functions for interacting with crypto-related endpoints

## Getting Started

1. Copy the `.env.local.example` file to `.env.local` in the root directory
2. Set your API credentials in the `.env.local` file:
   ```
   NEXT_PUBLIC_API_ENV=sandbox # or production, playground
   NEXT_PUBLIC_CLIENT_ID=your-client-id
   NEXT_PUBLIC_CLIENT_SECRET=your-client-secret
   ```
3. For development purposes, you can use the playground environment without real credentials.

## Usage Examples

### Fetching Brands

```tsx
import { getBrands } from '@/lib/api';

const fetchBrands = async () => {
  try {
    const response = await getBrands({
      page: 0,
      pageSize: 20,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    
    console.log('Brands:', response.data);
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
};
```

### Creating a Transaction

```tsx
import { createTransaction } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

const purchaseGiftCard = async (brandId: string, amountInDollars: number, customerId: string) => {
  try {
    // Convert dollar amount to cents
    const amountInCents = Math.round(amountInDollars * 100);
    
    // Generate a unique client order ID
    const clientOrderId = `order_${uuidv4()}`;
    
    const response = await createTransaction({
      data: {
        type: 'transactions',
        attributes: {
          type: 'SYNC',
          cards: [{
            brand_id: brandId,
            value: amountInCents,
            quantity: 1
          }],
          customer: {
            id: customerId
          },
          client_order_id: clientOrderId
        }
      }
    });
    
    console.log('Transaction successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};
```

### Checking Card Balance

```tsx
import { checkCardBalance } from '@/lib/api';

const checkBalance = async (cardId: string) => {
  try {
    const response = await checkCardBalance(cardId);
    console.log('Updated card:', response.data);
    return response.data;
  } catch (error) {
    console.error('Balance check failed:', error);
    throw error;
  }
};
```

## Error Handling

The API client includes built-in error handling that converts API errors into JavaScript Error objects. You can catch these errors and handle them appropriately:

```tsx
try {
  const response = await getBrands();
  // Process response
} catch (error) {
  // Handle error
  if (error instanceof Error) {
    const errorInfo = JSON.parse(error.message);
    console.error('API Error:', errorInfo.status, errorInfo.statusText);
    console.error('Error details:', errorInfo.errorData);
  }
}
```

## Environment Variables

The API integration uses the following environment variables:

- `NEXT_PUBLIC_API_ENV` - The API environment to use (sandbox, production, playground)
- `NEXT_PUBLIC_CLIENT_ID` - Your client ID for authentication
- `NEXT_PUBLIC_CLIENT_SECRET` - Your client secret for authentication

## Additional Resources

- [Raise API Documentation](https://docs.raise.com/) - Official API documentation 