import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { N } from '../styles/neumorphism';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 980);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
};

const AppShell = ({ title, subtitle, children, actions }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className="ambient-grid"
      style={{
        minHeight: '100vh',
        background: N.bg,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '260px minmax(0, 1fr)',
        gap: '20px',
        padding: '20px',
      }}
    >
      <Sidebar compact={isMobile} />
      <main style={{ minWidth: 0 }}>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="dashboard-panel"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(224,229,236,0.96) 28%, rgba(224,229,236,1) 100%)',
            borderRadius: '32px',
            boxShadow: '12px 12px 28px rgba(184,190,199,0.95), -10px -10px 24px rgba(255,255,255,0.9)',
            padding: isMobile ? '24px' : '32px',
            minHeight: 'calc(100vh - 40px)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div>
              <h1
                className="pulse-line"
                style={{
                  fontSize: isMobile ? '28px' : '34px',
                  fontWeight: 900,
                  color: N.teal,
                }}
              >
                {title}
              </h1>
              <p style={{ marginTop: '10px', color: N.textLight, maxWidth: '760px', lineHeight: 1.6 }}>
                {subtitle}
              </p>
            </div>
            {actions}
          </div>
          {children}
        </motion.section>
      </main>
    </div>
  );
};

export default AppShell;
