import React from 'react';
import { motion } from 'framer-motion';
import { N } from '../styles/theme';

const StatCard = ({ label, value, tone = 'default', hint }) => {
  const toneColor =
    tone === 'warning' ? '#e07b54' : tone === 'danger' ? '#d64545' : tone === 'success' ? N.teal : N.tealDeep;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className="dashboard-panel soft-float"
      style={{
        borderRadius: '24px',
        padding: '22px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.52), rgba(224,229,236,0.98))',
        boxShadow: '10px 10px 22px rgba(184,190,199,0.95), -8px -8px 18px rgba(255,255,255,0.86)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', color: N.textMuted, textTransform: 'uppercase' }}>
          {label}
        </div>
        <div
          style={{
            width: '54px',
            height: '6px',
            borderRadius: '999px',
            background: `linear-gradient(90deg, ${toneColor}, rgba(255,255,255,0.25))`,
            boxShadow: `0 0 18px ${toneColor}33`,
          }}
        />
      </div>
      <div style={{ fontSize: '30px', fontWeight: 900, color: toneColor, marginTop: '12px' }}>{value}</div>
      {hint ? <div style={{ marginTop: '10px', color: N.textLight, lineHeight: 1.5 }}>{hint}</div> : null}
    </motion.div>
  );
};

export default StatCard;





