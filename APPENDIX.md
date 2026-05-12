# Project Appendix: Secure Crypto Portfolio Tracker

This appendix provides a comprehensive overview of the Secure Crypto Portfolio Tracker project, including its architecture, technology stack, and integration details.

---

## 1. Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/) for fast development and building.
- **State Management**: [React Context API](https://reactjs.org/docs/context.html) for currency and authentication state.
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) and [Tailwind CSS](https://tailwindcss.com/) for modern, responsive design.
- **Icons**: [Lucide React](https://lucide.dev/) and [Material UI Icons](https://mui.com/material-ui/material-icons/).
- **Charts**: [Recharts](https://recharts.org/) for high-performance data visualization.
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion) for smooth UI transitions.
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) and [Input-OTP](https://github.com/guilhermerodrigues680/input-otp) for secure 2FA flows.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/).
- **Framework**: [Express.js](https://expressjs.com/) for RESTful API development.
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/) ODM).
- **Authentication**: Custom JWT-based authentication with 2FA (OTP) support.
- **Security**: [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing and secure environment management via `dotenv`.

---

## 2. Project Structure

```text
├── backend/                # Express.js Backend
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── models/         # Mongoose schemas (User, Portfolio)
│   │   ├── routes/         # API endpoints (Auth, User)
│   │   └── index.ts        # Server entry point
│   └── .env                # Environment variables
├── src/                    # Frontend React Application
│   ├── app/
│   │   ├── auth/           # Login and 2FA components
│   │   ├── components/     # Reusable UI components (Charts, Cards, Modals)
│   │   ├── context/        # State providers (Currency, Auth)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Main application views (Dashboard, Portfolio)
│   │   └── services/       # API integration services (CryptoCompare)
│   ├── styles/             # Global CSS and themes
│   └── main.tsx            # App entry point
├── public/                 # Static assets
└── vite.config.ts          # Vite configuration
```

---

## 3. API Integrations

### External Data Providers
- **CryptoCompare API**: Used for real-time market prices, top coin rankings, and historical chart data.
  - Endpoint: `https://min-api.cryptocompare.com/data`
- **Binance (Websocket)**: (Potential integration) For ultra-low latency price updates.

### Internal API Endpoints
- `POST /api/auth/register`: User registration.
- `POST /api/auth/login`: User login (returns JWT).
- `POST /api/auth/verify-2fa`: Second-step verification using OTP.
- `GET /api/portfolio`: Fetch user's current holdings and balance.

---

## 4. Key Features

1. **Futuristic Dashboard**: Glassmorphic UI with real-time portfolio tracking.
2. **Secure Auth**: Mandatory OTP-based 2FA for all users.
3. **Multi-Currency Support**: Switch between USD, EUR, and other fiat currencies.
4. **Interactive Charts**: Responsive historical data visualization for all major cryptocurrencies.
5. **Asset Management**: Add, remove, and track specific coins in your portfolio.

---

## 5. Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Set up environment variables in `backend/.env`:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 6. Reference Links
- [Figma Design File](https://www.figma.com/design/w0QKURDQmejEG1I1GY1Zni/Crypto-Portfolio-Management-UI)
- [CryptoCompare API Documentation](https://min-api.cryptocompare.com/documentation)
- [Lucide Icons Gallery](https://lucide.dev/icons)
