# Appendix A: Core Code Snippets

This appendix contains essential code snippets from the Secure Crypto Portfolio Tracker to demonstrate the core logic and architecture.

---

## 1. Backend: 2FA Authentication (OTP & JWT)
*Location: `backend/src/routes/auth.ts`*

This snippet shows the two-step login process: authenticating credentials and sending a verification code (OTP).

```typescript
// Step 1: Login & Send OTP
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Your Login Verification Code",
      html: `<h1>${otp}</h1>`
    });

    res.json({ requireOTP: true, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Step 2: Verify OTP & Issue JWT
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (user && user.otp === otp && user.otpExpires > new Date()) {
    user.otp = undefined;
    await user.save();

    res.json({
      _id: user._id,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid or expired OTP' });
  }
});
```

---

## 2. Backend: Resilient Database Connection
*Location: `backend/src/config/db.ts`*

The system automatically switches to an in-memory database if a local/remote MongoDB instance is unavailable.

```typescript
const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto';
    await mongoose.connect(dbUri);
    console.log('MongoDB Connected');
  } catch (localError) {
    console.warn('Fallback to In-Memory DB...');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('In-Memory MongoDB Connected');
  }
};
```

---

## 3. Frontend: High-Performance Crypto Data Service
*Location: `src/app/services/cryptoService.ts`*

Integrates with the CryptoCompare API to fetch real-time market data.

```typescript
export const fetchMarketData = async (symbols: string[], currency = 'USD') => {
  const fsyms = symbols.join(',').toUpperCase();
  const tsyms = currency.toUpperCase();
  
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`
  );
  
  const data = await response.json();
  const raw = data.RAW || {};
  
  return symbols.map(symbol => ({
    symbol: symbol.toUpperCase(),
    current_price: raw[symbol.toUpperCase()]?.[tsyms]?.PRICE || 0,
    price_change_24h: raw[symbol.toUpperCase()]?.[tsyms]?.CHANGEPCT24HOUR || 0,
  }));
};
```

---

## 4. Frontend: Glassmorphic Chart Component
*Location: `src/app/components/PortfolioChart.tsx`*

Uses Recharts to render smooth price history.

```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <Tooltip content={<CustomTooltip />} />
    <Area 
      type="monotone" 
      dataKey="price" 
      stroke="#4f8ef7" 
      fillOpacity={1} 
      fill="url(#colorPrice)" 
    />
  </AreaChart>
</ResponsiveContainer>
```
