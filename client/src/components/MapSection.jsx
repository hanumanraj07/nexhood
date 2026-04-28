import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { neu, N } from '../styles/theme';
import { landingData } from '../data/landingData';

const MapSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const feature = landingData.features.find(f => f.id === 'map');

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
                {/* Text Col (Left on Desktop, Right on Mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ order: window.innerWidth > 768 ? 0 : 1 }}
                >
                    <div style={{ ...neu.badge, display: 'inline-block', marginBottom: '20px' }}>
                        SPATIAL ANALYTICS
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

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {feature.highlights.map((tag, i) => (
                            <span key={i} style={{
                                ...neu.statChip,
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: N.teal
                            }}>
                                • {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Image Col (Right on Desktop, Left on Mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
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
            </div>
        </section>
    );
};

export default MapSection;





