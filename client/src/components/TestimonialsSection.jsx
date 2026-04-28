import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { neu, N } from '../styles/theme';
import { useNeuState } from '../hooks/useNeuState';
import { landingData } from '../data/landingData';

const TestimonialsSection = () => {
    const prevBtnState = useNeuState(neu.iconButton);
    const nextBtnState = useNeuState(neu.iconButton);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        },
    };

    return (
        <section style={{ padding: '64px 48px', backgroundColor: N.bg }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '48px'
                }}>
                    <div>
                        <h2 style={{ fontSize: '36px', fontWeight: 900, color: N.tealDeep, marginBottom: '8px' }}>
                            Curated Success.
                        </h2>
                        <p style={{ color: N.textLight, fontSize: '15px' }}>
                            Insights that empowered real estate decisions.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button {...prevBtnState} style={{ ...prevBtnState.style, width: '40px', height: '40px' }}>
                            <FiChevronLeft size={20} color={N.text} />
                        </button>
                        <button {...nextBtnState} style={{ ...nextBtnState.style, width: '40px', height: '40px' }}>
                            <FiChevronRight size={20} color={N.text} />
                        </button>
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '24px'
                    }}
                >
                    {landingData.testimonials.map((review, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            style={{ ...neu.card, padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ color: '#f6ad55', fontSize: '18px', letterSpacing: '2px' }}>
                                ★★★★★
                            </div>

                            <p style={{
                                fontStyle: 'italic',
                                fontSize: '13px',
                                color: N.text,
                                lineHeight: 1.7,
                                flex: 1
                            }}>
                                "{review.quote}"
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                                <div style={{
                                    ...neu.raisedSm,
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    color: review.color,
                                    background: N.bg
                                }}>
                                    {review.initials}
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: N.tealDeep }}>{review.name}</div>
                                    <div style={{ fontSize: '11px', color: N.textLight, fontWeight: 600 }}>{review.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;





