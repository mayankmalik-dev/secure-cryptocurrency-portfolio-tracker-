# Appendix B: Dataset Details

This appendix provides technical details regarding the data models, external datasets, and mock data structures used in the Secure Crypto Portfolio Tracker.

---

## 1. Database Schema (MongoDB)

### User Model
The system uses Mongoose to define the user structure, including security-related fields for 2FA.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | User's full name (Required) |
| `email` | String | Unique email address (Used for login & OTP) |
| `password` | String | Bcrypt-hashed password |
| `otp` | String | Temporary 6-digit verification code |
| `otpExpires` | Date | Expiration timestamp for the OTP |
| `timestamps` | Mixed | `createdAt` and `updatedAt` auto-fields |

---

## 2. Frontend Application Data Models

### Crypto Asset Model
Defines the structure for assets held in the user's portfolio.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique identifier |
| `name` | String | Full name (e.g., Bitcoin) |
| `symbol` | String | Ticker symbol (e.g., BTC) |
| `currentPrice` | Number | Last fetched market price |
| `holdings` | Number | Quantity owned by the user |
| `totalValue` | Number | `currentPrice` * `holdings` |
| `change24h` | Number | 24-hour price change percentage |

### News Item Model
Used for the curated news feed in the dashboard.

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Headline of the news item |
| `source` | String | News provider (e.g., CoinDesk) |
| `sentiment` | Enum | `positive`, `negative`, or `neutral` |
| `relatedCoins`| String[] | Symbols mentioned in the news |

---

## 3. External API Data (CryptoCompare)

The application integrates with the **CryptoCompare Data API**. The primary endpoint used is `pricemultifull`.

### Sample Response Mapping
When fetching `BTC` and `ETH` in `USD`:
- **Path**: `RAW -> SYMBOL -> CURRENCY`
- **Mapped Fields**:
    - `PRICE`: Current market price.
    - `MKTCAP`: Total market capitalization.
    - `CHANGEPCT24HOUR`: Percentage change in the last 24 hours.
    - `IMAGEURL`: Base path for the coin icon.

---

## 4. Development & Mock Data
*Location: `src/app/data/mockData.ts`*

For development and offline testing, the system provides:
1.  **Mock Assets**: Pre-populated list including BTC, ETH, SOL, and LINK.
2.  **Mock News Feed**: Curated articles with sentiment analysis.
3.  **Dynamic Chart Generation**: A utility function `generateChartData(days)` that simulates price volatility using random walks.
