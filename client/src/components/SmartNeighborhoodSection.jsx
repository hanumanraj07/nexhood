import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { neu, N } from '../styles/theme';
import { landingData } from '../data/landingData';

const SmartNeighborhoodSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const feature = landingData.features.find(f => f.id === 'neighborhood');

    return (
        <section ref={ref} style={{ padding: '80px 48px', backgroundColor: N.bg }}>
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
                        COMMUNITY INTELLIGENCE
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {feature.stats.map((stat, i) => (
                            <div key={i} style={{ ...neu.card, padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: N.teal }}>{stat.value}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: N.textMuted, letterSpacing: '1px' }}>
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

export default SmartNeighborhoodSection;




