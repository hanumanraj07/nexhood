import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { useInView } from 'react-intersection-observer';
import { neu, N } from '../styles/theme';
import { landingData } from '../data/landingData';

const TemporalSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.15,
        triggerOnce: true
    });

    return (
        <section ref={ref} style={{ padding: '64px 48px', backgroundColor: N.bg }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '28px',
                alignItems: 'center'
            }}>
                {/* Col 1 — Historical Trends */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ ...neu.card, padding: '28px' }}
                >
                    <div style={{ ...neu.badge, padding: '5px 12px', marginBottom: '20px' }}>
                        HISTORICAL TRENDS
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: N.tealDeep, marginBottom: '12px' }}>
                        Temporal Intelligence.
                    </h3>
                    <p style={{ fontSize: '14px', color: N.textLight, marginBottom: '24px', lineHeight: 1.6 }}>
                        Access 20 years of pricing history, gentrification waves, and municipal planning cycles.
                    </p>

                    <div style={{ height: '80px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={60}>
                            <BarChart data={landingData.historicalData}>
                                <Bar
                                    dataKey="value"
                                    radius={[4, 4, 0, 0]}
                                    isAnimationActive={inView}
                                    animationDuration={1200}
                                    fill={N.teal}
                                >
                                    {landingData.historicalData.map((entry, index) => (
                                        <motion.rect
                                            key={`cell-${index}`}
                                            fill={N.teal}
                                            fillOpacity={0.4 + (index * 0.1)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Col 2 — CTA block */}
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, color: N.tealDeep, marginBottom: '16px', lineHeight: 1.2 }}>
                        Start your intelligence journey today.
                    </h3>
                    <p style={{ color: N.textLight, fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>
                        Join over 150,000 users making smarter real estate decisions with NexHood.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "12px 12px 24px #b8bec7, -4px -4px 12px #ffffff" }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            ...neu.button,
                            padding: '13px 28px',
                            fontSize: '15px'
                        }}
                    >
                        Get Started for Free
                    </motion.button>
                </div>

                {/* Col 3 — Photo card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.02 }}
                    style={{
                        ...neu.raised,
                        borderRadius: '20px',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: N.bg
                    }}
                >
                    <div style={{
                        ...neu.inset,
                        borderRadius: '14px',
                        width: '90%',
                        height: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={N.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: N.teal,
                            letterSpacing: '1px'
                        }}>
                            YOUR EXPERT ADVISOR
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TemporalSection;






