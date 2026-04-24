import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiSettings } from 'react-icons/fi';
import { neu, N, useNeuState } from '../styles/neumorphism';

const Navbar = () => {
    const navigate = useNavigate();
    const bellState = useNeuState(neu.iconButton);
    const gearState = useNeuState(neu.iconButton);
    const signState = useNeuState(neu.button);

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            height: '60px',
            background: N.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px',
            zIndex: 1000,
            boxShadow: '0 4px 12px #b8bec7, 0 -2px 5px #ffffff'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: N.teal,
                    cursor: 'pointer'
                }}>
                    NexHood
                </div>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button
                    {...bellState}
                    style={{
                        ...bellState.style,
                        width: '36px',
                        height: '36px',
                        fontSize: '18px',
                        color: N.text
                    }}
                >
                    <FiBell />
                </button>

                <button
                    {...gearState}
                    style={{
                        ...gearState.style,
                        width: '36px',
                        height: '36px',
                        fontSize: '18px',
                        color: N.text
                    }}
                >
                    <FiSettings />
                </button>

                <motion.button
                    {...signState}
                    whileHover={{ scale: 1.03 }}
                    whileTap={neu.buttonPressed}
                    onClick={() => navigate('/signin')}
                    style={{
                        ...signState.style,
                        padding: '8px 22px',
                    }}
                >
                    Sign In
                </motion.button>
            </div>
        </nav>
    );
};

export default Navbar;
