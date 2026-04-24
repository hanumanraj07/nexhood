import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiMap,
    FiTruck,
    FiUsers,
    FiLogOut,
    FiPieChart,
    FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { neu, N } from '../styles/neumorphism';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = {
        resident: [
            { id: 'dashboard', label: 'Overview', icon: <FiPieChart />, path: '/dashboard' },
            { id: 'neighborhood', label: 'Neighborhood', icon: <FiMap />, path: '/neighborhood' },
            { id: 'parking', label: 'My Parking', icon: <FiTruck />, path: '/parking' },
        ],
        admin: [
            { id: 'dashboard', label: 'Admin Panel', icon: <FiPieChart />, path: '/dashboard' },
            { id: 'residents', label: 'Residents', icon: <FiUsers />, path: '/residents' },
            { id: 'neighborhood', label: 'Neighborhoods', icon: <FiMap />, path: '/neighborhood' },
            { id: 'parking', label: 'Society Parking', icon: <FiTruck />, path: '/parking' },
        ],
        guard: [
            { id: 'dashboard', label: 'Status', icon: <FiPieChart />, path: '/dashboard' },
            { id: 'guard', label: 'QR Scanner', icon: <FiShield />, path: '/guard' },
            { id: 'parking', label: 'Slots', icon: <FiTruck />, path: '/parking' },
        ]
    };

    const items = navItems[user?.role || 'resident'];

    return (
        <aside style={{
            width: '240px',
            height: 'calc(100vh - 40px)',
            background: N.bg,
            margin: '20px',
            borderRadius: '30px',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            ...neu.raised,
            position: 'sticky',
            top: '20px'
        }}>
            <div>
                <div style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: N.teal,
                    marginBottom: '40px',
                    paddingLeft: '10px'
                }}>
                    NexHood
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {items.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '16px',
                                textDecoration: 'none',
                                color: isActive ? N.teal : N.textLight,
                                fontWeight: 700,
                                fontSize: '15px',
                                ...(isActive ? neu.inset : {}),
                                transition: 'all 0.3s ease'
                            })}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'transparent',
                    color: '#e74c3c',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                <FiLogOut />
                Sign Out
            </motion.button>
        </aside>
    );
};

export default Sidebar;
