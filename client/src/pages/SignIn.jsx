import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { neu, N, useNeuState } from '../styles/neumorphism';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('resident');

    const emailState = useNeuState(neu.inset);
    const passState = useNeuState(neu.inset);
    const btnState = useNeuState(neu.button);
    const googleBtnState = useNeuState(neu.button);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email || 'demo@nexhood.in', role);
        navigate('/dashboard');
    };

    const roles = [
        { id: 'resident', label: 'Resident' },
        { id: 'admin', label: 'Admin' },
        { id: 'guard', label: 'Guard' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: N.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
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
                    alignItems: 'center'
                }}
            >
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: N.teal,
                    marginBottom: '10px'
                }}>
                    Welcome Back
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: N.textLight,
                    marginBottom: '32px'
                }}>
                    Log in to your NexHood intelligence portal.
                </p>

                {/* Role Selector for Development */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    width: '100%'
                }}>
                    {roles.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '12px',
                                border: 'none',
                                background: N.bg,
                                fontSize: '12px',
                                fontWeight: 800,
                                color: role === r.id ? N.teal : N.textMuted,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                ...(role === r.id ? neu.inset : neu.raised)
                            }}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>
                            EMAIL ADDRESS
                        </label>
                        <input
                            {...emailState}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. alex@example.com"
                            style={{
                                ...emailState.style,
                                padding: '16px 20px',
                                borderRadius: '16px',
                                border: 'none',
                                outline: 'none',
                                color: N.text,
                                fontSize: '15px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>
                            PASSWORD
                        </label>
                        <input
                            {...passState}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                ...passState.style,
                                padding: '16px 20px',
                                borderRadius: '16px',
                                border: 'none',
                                outline: 'none',
                                color: N.text,
                                fontSize: '15px'
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
                            border: 'none',
                            marginTop: '10px'
                        }}
                    >
                        Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </motion.button>
                </form>

                <div style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        margin: '20px 0'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: '#d1d9e6' }} />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: N.textMuted }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#d1d9e6' }} />
                    </div>

                    <motion.button
                        {...googleBtnState}
                        whileHover={{ scale: 1.02 }}
                        whileTap={neu.buttonPressed}
                        style={{
                            ...googleBtnState.style,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '14px',
                            width: '100%',
                            borderRadius: '16px',
                            fontWeight: 700,
                            fontSize: '15px',
                            color: N.text,
                            border: 'none'
                        }}
                    >
                        <FcGoogle size={24} />
                        Continue with Google
                    </motion.button>
                </div>

                <p style={{ marginTop: '32px', fontSize: '14px', color: N.textLight }}>
                    Don't have an account? {' '}
                    <Link to="/signup" style={{
                        color: N.teal,
                        fontWeight: 800,
                        textDecoration: 'none'
                    }}>
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignIn;
