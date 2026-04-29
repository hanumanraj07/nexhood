import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { neu, N } from '../styles/theme';
import { useNeuState } from '../hooks/useNeuState';
import landingMainImage from '../assets/landingMain.png';

const HeroSection = () => {
  const searchBarState = useNeuState(neu.searchBar);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '80px 48px 60px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
      }}
    >
      <motion.div variants={itemVariants}>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900,
            color: N.tealDeep,
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}
        >
          Find your next home with
          <br />
          <span style={{ color: N.teal }}>data-driven confidence.</span>
        </h1>
      </motion.div>

      <motion.p
        variants={itemVariants}
        style={{
          color: N.textLight,
          fontSize: '16px',
          maxWidth: '520px',
          lineHeight: 1.6,
        }}
      >
        NexHood transforms complex municipal data into clear, actionable intelligence
        for smarter real estate transitions.
      </motion.p>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35 }}
        className="dashboard-panel soft-float-delay"
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '400px',
          borderRadius: '30px',
          overflow: 'hidden',
          ...neu.raised,
          margin: '20px 0',
          position: 'relative',
        }}
      >
        <motion.img
          src={landingMainImage}
          alt="NexHood Preview"
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(224,229,236,0) 60%, rgba(224,229,236,0.8) 100%)',
          }}
        />
      </motion.div>

      <motion.div variants={itemVariants} style={{ width: '100%', maxWidth: '560px' }}>
        <div
          style={{
            ...searchBarState.style,
            padding: '6px 6px 6px 20px',
            gap: '12px',
          }}
        >
          <FiMapPin style={{ color: N.textMuted, fontSize: '18px' }} />
          <input
            type="text"
            placeholder="Search by neighborhood or city..."
            style={{
              flex: 1,
              background: 'transparent',
              fontSize: '15px',
              color: N.text,
            }}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={neu.buttonPressed}
            style={{
              ...neu.button,
              padding: '10px 24px',
              fontSize: '14px',
            }}
          >
            Analyze
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          gap: '32px',
          marginTop: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['URBAN PLANNING', 'MARKET ANALYTICS', 'RISK ASSESSMENT'].map((label) => (
          <span
            key={label}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: N.textMuted,
              letterSpacing: '1.5px',
            }}
          >
            {label}
          </span>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;





