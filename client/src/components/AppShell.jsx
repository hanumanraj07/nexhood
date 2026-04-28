import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { N } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import ChangeLocationModal from './ChangeLocationModal';

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
  const { user, updateUser } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const role = String(user?.role || 'guest');
  const roleTone =
    role === 'admin' ? { bg: '#ffe9db', color: '#b85c38' } : role === 'guard' ? { bg: '#e7f0ff', color: '#3567b8' } : { bg: '#edf7f4', color: N.tealDark };

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
        <section
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
              <h1 style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: 900, color: N.teal }}>
                {title}
              </h1>
              <p style={{ marginTop: '10px', color: N.textLight, maxWidth: '760px', lineHeight: 1.6 }}>
                {subtitle}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '999px',
                  background: roleTone.bg,
                  color: roleTone.color,
                  fontWeight: 800,
                  fontSize: '12px',
                  textTransform: 'capitalize',
                }}
              >
                Role: {role}
              </div>
              {role === 'resident' ? (
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.62)',
                    color: N.tealDeep,
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                >
                  Change Location
                </button>
              ) : null}
              {actions}
            </div>
          </div>
          {children}
        </section>
      </main>
      {showLocationModal ? (
        <ChangeLocationModal
          initialLocation={user?.preferredLocation}
          onClose={() => setShowLocationModal(false)}
          onSaved={(nextUser) => {
            updateUser(nextUser);
            setShowLocationModal(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default AppShell;





