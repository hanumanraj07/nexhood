import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { neu, N, useNeuState } from '../styles/neumorphism';

const SignUp = () => {
    const navigate = useNavigate();
    const nameState = useNeuState(neu.inset);
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
                    alignItems: 'center'
                }}
            >
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: N.teal,
                    marginBottom: '10px'
                }}>
                    Get Started
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: N.textLight,
                    marginBottom: '32px',
                    textAlign: 'center'
                }}>
                    Join NexHood and unlock deep-dive <br />neighborhood intelligence.
                </p>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: N.textMuted, marginLeft: '16px' }}>
                            FULL NAME
                        </label>
                        <input
                            {...nameState}
                            type="text"
                            placeholder="e.g. Alex Johnson"
                            style={{
                                ...nameState.style,
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
                            placeholder="Min. 8 characters"
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
                        Create Account
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
                        Sign up with Google
                    </motion.button>
                </div>

                <p style={{ marginTop: '32px', fontSize: '14px', color: N.textLight }}>
                    Already have an account? {' '}
                    <Link to="/signin" style={{
                        color: N.teal,
                        fontWeight: 800,
                        textDecoration: 'none'
                    }}>
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
