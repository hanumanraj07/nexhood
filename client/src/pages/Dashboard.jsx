import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { N } from '../styles/neumorphism';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: N.bg
        }}>
            <Sidebar />

            <main style={{
                flex: 1,
                padding: '20px 40px 20px 20px',
                maxWidth: '1200px'
            }}>
                <div style={{
                    marginTop: '20px',
                    padding: '40px',
                    borderRadius: '40px',
                    background: N.bg,
                    boxShadow: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 900,
                        color: N.teal,
                        marginBottom: '10px'
                    }}>
                        Hello, {user?.name || 'User'}
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: N.textLight,
                        marginBottom: '30px'
                    }}>
                        Welcome to your NexHood portal. You are logged in as a <strong>{user?.role}</strong>.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px'
                    }}>
                        {/* Placeholder for future dashboard modules */}
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                height: '160px',
                                borderRadius: '30px',
                                background: N.bg,
                                boxShadow: 'inset 6px 6px 12px #b8bec7, inset -6px -6px 12px #ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: N.textMuted,
                                fontWeight: 600,
                                fontSize: '14px'
                            }}>
                                Module {i} Coming Soon
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
