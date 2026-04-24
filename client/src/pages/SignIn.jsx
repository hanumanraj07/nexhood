import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { neu, N, useNeuState } from '../styles/neumorphism';

const SignIn = () => {
    const navigate = useNavigate();
    const emailState = useNeuState(neu.inset);
    const passState = useNeuState(neu.inset);
    const btnState = useNeuState(neu.button);
    const googleBtnState = useNeuState(neu.button);

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

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>
                            EMAIL ADDRESS
                        </label>
                        <input
                            {...emailState}
                            type="email"
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
                            marginTop: '10px'
                        }}
                    >
                        Sign In
                    </motion.button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        margin: '10px 0'
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
                            borderRadius: '16px',
                            fontWeight: 700,
                            fontSize: '15px',
                            color: N.text
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
