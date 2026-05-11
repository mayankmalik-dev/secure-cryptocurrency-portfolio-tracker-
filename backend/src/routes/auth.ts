import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Step 1: Authenticate user & Send OTP via Real Email
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // SEND REAL EMAIL
      try {
        await transporter.sendMail({
          from: '"Secure Crypto Vault" <security@cryptotracker.com>',
          to: email,
          subject: "Your Login Verification Code",
          text: `Your security code is: ${otp}. It expires in 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>Security Verification</h2>
              <p>You are attempting to log in to your Crypto Portfolio Tracker.</p>
              <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; text-align: center;">
                <h1 style="letter-spacing: 5px; color: #F5B700;">${otp}</h1>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you did not request this, please change your password immediately.</p>
            </div>
          `,
        });
        console.log(`[EMAIL] OTP sent to ${email}`);
      } catch (mailError) {
        console.error('[EMAIL ERROR] Failed to send email:', mailError);
        console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
      }

      res.json({
        requireOTP: true,
        email: user.email,
        message: 'A security code has been sent to your email.'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.otp === otp && user.otpExpires && user.otpExpires > new Date()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
