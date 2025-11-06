# IMMFI Website with PayMongo Integration

A complete donation platform for the Inocencio Magtoto Memorial Foundation Inc. with integrated PayMongo payment processing.

## Features

- **Multiple Payment Methods**: Credit/Debit Cards, GCash, GrabPay, PayMaya
- **Secure Payment Processing**: Powered by PayMongo
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Feedback**: Success/error handling and loading states

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PayMongo API keys (test keys included for development)

### Installation

1. Install all dependencies:

```bash
npm run install-all
```

2. Set up environment variables:

```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit backend/.env with your PayMongo keys
PAYMONGO_SECRET_KEY=your_secret_key_here
PAYMONGO_PUBLIC_KEY=your_public_key_here
PORT=3000
NODE_ENV=development
```

### Development

Start both frontend and backend servers:

```bash
npm run dev
```

This will start:

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express API server)

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Same as dev (production start)
- `npm run frontend` - Start only the frontend
- `npm run backend` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

## Project Structure

```
immfi-website/
├── frontend/my-app/          # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/     # Reusable components
│   │   └── ...
│   └── package.json
├── backend/                 # Express backend
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── package.json
└── package.json            # Root package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/payment-methods` - Get available payment methods
- `POST /api/create-payment-intent` - Create payment intent
- `POST /api/confirm-payment` - Confirm payment
- `GET /api/payment-status/:id` - Get payment status

## Payment Integration

The donation page supports multiple payment methods through PayMongo:

1. **Credit/Debit Cards** - Visa, Mastercard, JCB
2. **GCash** - Mobile wallet payments
3. **GrabPay** - Grab wallet payments
4. **PayMaya** - Maya wallet payments

## Security

- All payment data is processed securely through PayMongo
- No sensitive payment information is stored locally
- Environment variables are used for API keys
- CORS is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
