import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight, RefreshCcw, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitch: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [requireOTP, setRequireOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.requireOTP) {
        setRequireOTP(true);
        setCountdown(60);
        toast.success('Security: OTP has been sent to your device');
      } else {
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('Welcome back, ' + data.name);
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP Verification failed');
      }

      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Verification successful. Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setCountdown(60);
    toast.info('New OTP sent to ' + formData.email);
    // In a real app, this would call the /login endpoint again
  };

  if (requireOTP) {
    return (
      <motion.div
        className="auth-form-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3 mb-4 bg-primary/10 border border-primary/20 w-fit px-4 py-1.5 rounded-full">
          <ShieldCheck className="text-primary w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">2FA Protected</span>
        </div>
        
        <motion.h2 className="auth-heading text-3xl mb-2" variants={itemVariants}>
          Enter Code.
        </motion.h2>
        <p className="auth-subheading mb-8">
          A verification code was sent to your email. Enter the 6-digit code to continue.
        </p>

        <form onSubmit={handleOTPSubmit}>
          <motion.div className="form-group" variants={itemVariants}>
            <input
              type="text"
              id="otp"
              className="input-field text-center tracking-[0.8em] text-3xl font-black text-primary"
              placeholder="000000"
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            <label htmlFor="otp" className="floating-label">Verification Code</label>
          </motion.div>

          <motion.button
            type="submit"
            className="cta-button flex items-center justify-center gap-3"
            variants={itemVariants}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? 'Verifying...' : 'Unlock Account'}
            <ArrowRight size={18} />
          </motion.button>
        </form>

        <motion.div 
          className="mt-8 flex flex-col items-center gap-4"
          variants={itemVariants}
        >
          <button
            disabled={countdown > 0}
            onClick={handleResendOTP}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              countdown > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:text-primary/80'
            }`}
          >
            <RefreshCcw size={14} className={countdown > 0 ? '' : 'animate-spin-slow'} />
            {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Verification Code'}
          </button>

          <button
            onClick={() => setRequireOTP(false)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors border-b border-transparent hover:border-muted-foreground"
          >
            <ArrowLeft size={14} />
            Use different credentials
          </button>
        </motion.div>

        {/* Development Helper Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center"
        >
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">Developer Mode</p>
          <p className="text-xs text-emerald-500/80">
            Hint: Check your terminal console for the real OTP. <br/>
            <span className="text-[10px] opacity-60">(In production, this is sent to your real email)</span>
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="auth-form-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 mb-4 text-muted-foreground">
        <Lock size={14} />
        <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Secure Vault Login</span>
      </div>

      <motion.h1 className="auth-heading" variants={itemVariants}>
        Welcome back.
      </motion.h1>
      <motion.p className="auth-subheading" variants={itemVariants}>
        Enter your credentials to securely access your portfolio.
      </motion.p>

      <form onSubmit={handleLoginSubmit}>
        <motion.div className="form-group" variants={itemVariants}>
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder=" "
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <label htmlFor="email" className="floating-label">Email Address</label>
        </motion.div>

        <motion.div className="form-group" variants={itemVariants}>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="input-field"
              placeholder=" "
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <label htmlFor="password" className="floating-label">Password</label>
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          className="cta-button"
          variants={itemVariants}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? 'Securing Session...' : 'Sign In'}
        </motion.button>
      </form>

      <motion.div 
        className="mt-12 p-4 bg-secondary/30 rounded-xl border border-border/50 flex items-start gap-3"
        variants={itemVariants}
      >
        <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong>Security Note:</strong> Your account is protected by mandatory 2FA. After password entry, a unique code will be required to finalize your session.
        </p>
      </motion.div>

      <motion.p
        style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}
        variants={itemVariants}
      >
        Don't have an account?{' '}
        <span
          onClick={onSwitch}
          style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
        >
          Create secure account →
        </span>
      </motion.p>
    </motion.div>
  );
};
