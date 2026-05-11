import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface SignupFormProps {
  onSwitch: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [strength, setStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic strength calculation
    let s = 0;
    if (formData.password.length > 6) s += 25;
    if (/[A-Z]/.test(formData.password)) s += 25;
    if (/[0-9]/.test(formData.password)) s += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) s += 25;
    setStrength(s);
  }, [formData.password]);

  const getStrengthColor = () => {
    if (strength <= 25) return '#E84040'; // Red
    if (strength <= 50) return '#F5A623'; // Orange/Gold
    if (strength <= 75) return '#F5D142'; // Yellow
    return '#2ECC71'; // Green
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast.error('Please accept the Terms of Service');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Account created successfully! Welcome to the future.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-form-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="auth-heading" variants={itemVariants}>
        Join us.
      </motion.h1>
      <motion.p className="auth-subheading" variants={itemVariants}>
        Start managing your crypto assets with precision.
      </motion.p>

      <form onSubmit={handleSubmit}>
        <motion.div className="form-group" variants={itemVariants}>
          <input
            type="text"
            id="name"
            className="input-field"
            placeholder=" "
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label htmlFor="name" className="floating-label">Full Name</label>
        </motion.div>

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
          <div className="strength-meter">
            <div
              className="strength-bar"
              style={{
                width: `${strength}%`,
                backgroundColor: getStrengthColor(),
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className={`checkbox-container ${acceptedTerms ? 'active' : ''}`}
          variants={itemVariants}
          onClick={() => setAcceptedTerms(!acceptedTerms)}
        >
          <div className="custom-checkbox">
            {acceptedTerms && <Check size={12} strokeWidth={4} color="white" />}
          </div>
          <span>I agree to the Terms of Service & Privacy Policy</span>
        </motion.div>

        <motion.button
          type="submit"
          className="cta-button"
          variants={itemVariants}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </motion.button>
      </form>

      <motion.p
        style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}
        variants={itemVariants}
      >
        Already have an account?{' '}
        <span
          onClick={onSwitch}
          style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
        >
          Sign in →
        </span>
      </motion.p>
    </motion.div>
  );
};
