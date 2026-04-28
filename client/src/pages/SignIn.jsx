import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { neu, N } from '../styles/theme';
import { useNeuState } from '../hooks/useNeuState';
import { extractErrorMessage } from '../services/api';
import GoogleAuthButton from '../components/GoogleAuthButton';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const emailState = useNeuState(neu.inset);
  const passState = useNeuState(neu.inset);
  const btnState = useNeuState(neu.button);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ email, password });
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          Welcome Back
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: N.textLight,
            marginBottom: '32px',
          }}
        >
          Log in to your NexHood intelligence portal.
        </p>
        {error ? <div style={{ width: '100%', marginBottom: '20px', color: '#d64545' }}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>EMAIL ADDRESS</label>
            <input
              {...emailState}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="e.g. demo.resident@nexhood.in"
              style={{
                ...emailState.style,
                padding: '16px 20px',
                borderRadius: '16px',
                color: N.text,
                fontSize: '15px',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>PASSWORD</label>
            <input
              {...passState}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              style={{
                ...passState.style,
                padding: '16px 20px',
                borderRadius: '16px',
                color: N.text,
                fontSize: '15px',
              }}
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
            {submitting ? 'Signing In...' : 'Sign In'}
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

          <GoogleAuthButton onCredential={handleGoogle} />
        </div>

        <div style={{ width: '100%', marginTop: '18px', color: N.textLight, fontSize: '13px', lineHeight: 1.6 }}>
          Demo logins: `admin@nexhood.in / Admin@123`, `demo.resident@nexhood.in / Resident@123`, `guard@nexhood.in / Guard@123`
        </div>

        <p style={{ marginTop: '32px', fontSize: '14px', color: N.textLight }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: N.teal, fontWeight: 800, textDecoration: 'none' }}>
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;





