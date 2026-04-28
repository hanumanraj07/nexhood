import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { neu, N } from '../styles/theme';
import { landingData } from '../data/landingData';

const PrecisionSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.15,
        triggerOnce: true
    });

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeOut"
            }
        }),
    };

    return (
        <section ref={ref} style={{ padding: '64px 48px', backgroundColor: N.bg }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '30px', fontWeight: 800, color: N.tealDeep, marginBottom: '8px' }}>
                        Precision Analysis
                    </h2>
                    <p style={{ color: N.textLight, maxWidth: '480px', lineHeight: 1.6 }}>
                        Our multi-layered data verification ensures you're looking at the most
                        accurate neighborhood profiles available.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '28px'
                }}>
                    {/* Card A — Light */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={cardVariants}
                        style={{ ...neu.card, padding: '32px' }}
                    >
                        <div style={{ ...neu.badge, padding: '5px 12px', marginBottom: '24px' }}>
                            NEIGHBORHOOD SCORECARDS
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: N.tealDeep, marginBottom: '12px' }}>
                            Hyper-Local Performance.
                        </h3>
                        <p style={{ fontSize: '14px', color: N.textLight, marginBottom: '24px', lineHeight: 1.6 }}>
                            Granular metrics on street-level safety, infrastructure quality, and micro-market trends.
                        </p>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            {landingData.stats.map((stat, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    ...neu.statChip,
                                    padding: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 800, color: N.teal }}>{stat.value}</div>
                                    <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: N.textMuted }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Card B — Dark */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={cardVariants}
                        style={{ ...neu.cardDark, padding: '32px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: N.textTealLight,
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: 800,
                            letterSpacing: '1.5px',
                            display: 'inline-block',
                            width: 'fit-content',
                            marginBottom: '24px'
                        }}>
                            MARKET COMPARISONS
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: N.textWhite, marginBottom: '12px' }}>
                            Side-by-Side Clarity.
                        </h3>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginBottom: '24px', lineHeight: 1.6 }}>
                            Compare target areas with historical benchmarks and competing investment zones instantly.
                        </p>

                        <div style={{
                            marginTop: 'auto',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: N.teal,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', color: N.textWhite, fontWeight: 700 }}>Chelsea vs. Tribeca</div>
                                <div style={{ fontSize: '12px', color: N.textTealLight }}>Market Delta: +4.2%</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PrecisionSection;





