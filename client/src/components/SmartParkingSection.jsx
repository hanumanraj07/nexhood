import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { neu, N } from '../styles/theme';
import { landingData } from '../data/landingData';

const SmartParkingSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const feature = landingData.features.find(f => f.id === 'parking');

    return (
        <section ref={ref} style={{ padding: '80px clamp(18px, 5vw, 48px)', backgroundColor: N.bg }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '60px',
                alignItems: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{
                        ...neu.raised,
                        borderRadius: '40px',
                        overflow: 'hidden',
                        aspectRatio: '16/10'
                    }}
                >
                    <img
                        src={feature.image}
                        alt={feature.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                >
                    <div style={{ ...neu.badge, display: 'inline-block', marginBottom: '20px' }}>
                        URBAN LOGISTICS
                    </div>
                    <h2 style={{
                        fontSize: '38px',
                        fontWeight: 800,
                        color: N.tealDeep,
                        lineHeight: 1.2,
                        marginBottom: '24px'
                    }}>
                        {feature.title}.
                    </h2>
                    <p style={{
                        fontSize: '17px',
                        color: N.textLight,
                        lineHeight: 1.7,
                        marginBottom: '32px'
                    }}>
                        {feature.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px' }}>
                        {feature.stats.map((stat, i) => (
                            <div key={i} style={{ ...neu.inset, padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: 900, color: N.teal }}>{stat.value}</div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: N.textMuted, letterSpacing: '1.5px' }}>
                                    {stat.label.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SmartParkingSection;






