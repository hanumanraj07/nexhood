import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { neu, N } from '../styles/theme';
import { useNeuState } from '../hooks/useNeuState';
import { extractErrorMessage } from '../services/api';
import GoogleAuthButton from '../components/GoogleAuthButton';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apartment, setApartment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const nameState = useNeuState(neu.inset);
  const emailState = useNeuState(neu.inset);
  const passState = useNeuState(neu.inset);
  const apartmentState = useNeuState(neu.inset);
  const btnState = useNeuState(neu.button);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register({ name, email, password, apartment, role: 'resident' });
      navigate('/dashboard');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError('');
    try {
      await loginWithGoogle(credential);
      navigate('/dashboard');
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: N.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          ...neu.card,
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          borderRadius: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 900,
            color: N.teal,
            marginBottom: '10px',
          }}
        >
          Get Started
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: N.textLight,
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          Join NexHood and unlock deep-dive neighborhood intelligence.
        </p>
        {error ? <div style={{ width: '100%', marginBottom: '20px', color: '#d64545' }}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>FULL NAME</label>
            <input
              {...nameState}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Alex Johnson"
              style={{ ...nameState.style, padding: '16px 20px', borderRadius: '16px', color: N.text, fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>EMAIL ADDRESS</label>
            <input
              {...emailState}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="e.g. alex@example.com"
              style={{ ...emailState.style, padding: '16px 20px', borderRadius: '16px', color: N.text, fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>PASSWORD</label>
            <input
              {...passState}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min. 8 characters"
              style={{ ...passState.style, padding: '16px 20px', borderRadius: '16px', color: N.text, fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>APARTMENT</label>
            <input
              {...apartmentState}
              type="text"
              value={apartment}
              onChange={(event) => setApartment(event.target.value)}
              placeholder="e.g. B-402"
              style={{ ...apartmentState.style, padding: '16px 20px', borderRadius: '16px', color: N.text, fontSize: '15px' }}
            />
          </div>

          <motion.button
            {...btnState}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={neu.buttonPressed}
            style={{
              ...btnState.style,
              background: N.teal,
              color: '#fff',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '16px',
              marginTop: '10px',
            }}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#d1d9e6' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: N.textMuted }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#d1d9e6' }} />
          </div>

          <GoogleAuthButton onCredential={handleGoogle} text="signup_with" label="Sign up with Google" />
        </div>

        <p style={{ marginTop: '32px', fontSize: '14px', color: N.textLight }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: N.teal, fontWeight: 800, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;





