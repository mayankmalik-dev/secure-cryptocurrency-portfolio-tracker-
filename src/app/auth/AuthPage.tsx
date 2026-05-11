import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import './Auth.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      {/* LEFT PANEL: Editorial Brutalism */}
      <div className="auth-editorial">
        <motion.div
          className="orb orb-1"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="orb orb-2"
          animate={{
            x: [0, -40, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="editorial-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="editorial-tagline">
              Precision<br />
              <span style={{ color: 'var(--accent-primary)' }}>Protocol</span><br />
              Assets
            </h1>
            <p className="editorial-sub">
              Professional grade crypto management<br />
              for the modern institutional grade trader.
            </p>
          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '80px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
          © 2024 ANTIGRAVITY CAPITAL
        </div>
      </div>

      {/* RIGHT PANEL: Auth Forms */}
      <div className="auth-form-panel">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" onSwitch={() => setIsLogin(false)} />
          ) : (
            <SignupForm key="signup" onSwitch={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
