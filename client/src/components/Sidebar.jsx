import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiBookOpen,
  FiCompass,
  FiCpu,
  FiLogOut,
  FiMap,
  FiMapPin,
  FiPieChart,
  FiShield,
  FiTarget,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { neu, N } from '../styles/theme';

const Sidebar = ({ compact = false, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    logout();
    navigate('/');
    if (onNavigate) onNavigate();
    setShowLogoutConfirm(false);
  };

  const navItems = {
    resident: [
      { id: 'dashboard', label: 'Overview', icon: <FiPieChart />, path: '/dashboard' },
      { id: 'intelligence', label: 'Lab', icon: <FiCpu />, path: '/dashboard/intelligence' },
      { id: 'match-studio', label: 'Match Studio', icon: <FiTarget />, path: '/dashboard/match-studio' },
      { id: 'risk-command', label: 'Risk Command', icon: <FiActivity />, path: '/dashboard/risk-command' },
      { id: 'ops-center', label: 'Ops Center', icon: <FiCompass />, path: '/dashboard/ops-center' },
      { id: 'docs-simulator', label: 'Docs + Sim', icon: <FiBookOpen />, path: '/dashboard/docs-simulator' },
      { id: 'location-explorer', label: 'Location Explorer', icon: <FiMapPin />, path: '/dashboard/location-explorer' },
      { id: 'neighborhood', label: 'Neighborhood', icon: <FiMap />, path: '/dashboard/neighborhood' },
      { id: 'parking', label: 'My Parking', icon: <FiTruck />, path: '/dashboard/parking' },
    ],
    admin: [
      { id: 'dashboard', label: 'Admin Panel', icon: <FiPieChart />, path: '/dashboard' },
      { id: 'intelligence', label: 'Lab', icon: <FiCpu />, path: '/dashboard/intelligence' },
      { id: 'match-studio', label: 'Match Studio', icon: <FiTarget />, path: '/dashboard/match-studio' },
      { id: 'risk-command', label: 'Risk Command', icon: <FiActivity />, path: '/dashboard/risk-command' },
      { id: 'ops-center', label: 'Ops Center', icon: <FiCompass />, path: '/dashboard/ops-center' },
      { id: 'docs-simulator', label: 'Docs + Sim', icon: <FiBookOpen />, path: '/dashboard/docs-simulator' },
      { id: 'location-explorer', label: 'Location Explorer', icon: <FiMapPin />, path: '/dashboard/location-explorer' },
      { id: 'residents', label: 'Residents', icon: <FiUsers />, path: '/dashboard/residents' },
      { id: 'neighborhood', label: 'Neighborhoods', icon: <FiMap />, path: '/dashboard/neighborhood' },
      { id: 'parking', label: 'Society Parking', icon: <FiTruck />, path: '/dashboard/parking' },
    ],
    guard: [
      { id: 'dashboard', label: 'Status', icon: <FiPieChart />, path: '/dashboard' },
      { id: 'intelligence', label: 'Lab', icon: <FiCpu />, path: '/dashboard/intelligence' },
      { id: 'risk-command', label: 'Risk Command', icon: <FiActivity />, path: '/dashboard/risk-command' },
      { id: 'ops-center', label: 'Ops Center', icon: <FiCompass />, path: '/dashboard/ops-center' },
      { id: 'location-explorer', label: 'Location Explorer', icon: <FiMapPin />, path: '/dashboard/location-explorer' },
      { id: 'guard', label: 'QR Scanner', icon: <FiShield />, path: '/dashboard/guard' },
      { id: 'parking', label: 'Slots', icon: <FiTruck />, path: '/dashboard/parking' },
    ],
  };

  const items = navItems[user?.role || 'resident'];

  return (
    <>
      <aside
        style={{
          width: '100%',
          minHeight: compact ? 'auto' : 'calc(100vh - 40px)',
          background: N.bg,
          borderRadius: compact ? '22px' : '30px',
          padding: compact ? '20px 16px' : '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px',
          ...neu.raised,
          position: compact ? 'static' : 'sticky',
          top: compact ? 'auto' : '20px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: compact ? '20px' : '22px',
              fontWeight: 900,
              color: N.teal,
              marginBottom: compact ? '18px' : '34px',
              paddingLeft: '10px',
            }}
          >
            NexHood
          </div>

          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {items.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onNavigate}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  color: isActive ? N.teal : N.textLight,
                  fontWeight: 700,
                  fontSize: compact ? '14px' : '15px',
                  ...(isActive ? neu.inset : {}),
                  transition: 'all 0.3s ease',
                })}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '14px',
            border: 'none',
            background: 'transparent',
            color: '#e74c3c',
            fontWeight: 700,
            fontSize: compact ? '14px' : '15px',
            cursor: 'pointer',
            width: '100%',
            alignSelf: 'stretch',
          }}
        >
          <FiLogOut />
          Sign Out
        </button>
      </aside>

      {showLogoutConfirm ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            background: 'rgba(38, 70, 83, 0.32)',
            display: 'grid',
            placeItems: 'center',
            padding: '16px',
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: N.bg,
              borderRadius: '24px',
              padding: '22px',
              boxShadow: '12px 12px 28px rgba(184,190,199,0.95), -10px -10px 24px rgba(255,255,255,0.9)',
            }}
          >
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: N.tealDeep }}>Sign out?</h3>
            <p style={{ marginTop: '8px', color: N.textLight, lineHeight: 1.6 }}>
              You will need to sign in again to access your dashboard.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  ...neu.raised,
                  borderRadius: '14px',
                  padding: '11px 12px',
                  color: N.text,
                  fontWeight: 800,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                style={{
                  borderRadius: '14px',
                  padding: '11px 12px',
                  background: '#e74c3c',
                  color: '#fff',
                  fontWeight: 800,
                }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
