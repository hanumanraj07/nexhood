import React from 'react';
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

const Sidebar = ({ compact = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <aside
      style={{
        width: compact ? '100%' : '240px',
        minHeight: compact ? 'auto' : 'calc(100vh - 40px)',
        background: N.bg,
        borderRadius: '30px',
        padding: '28px 20px',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
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
            fontSize: '22px',
            fontWeight: 900,
            color: N.teal,
            marginBottom: compact ? '14px' : '34px',
            paddingLeft: '10px',
          }}
        >
          NexHood
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: compact ? 'row' : 'column',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '16px',
                textDecoration: 'none',
                color: isActive ? N.teal : N.textLight,
                fontWeight: 700,
                fontSize: '15px',
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
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '16px',
          border: 'none',
          background: 'transparent',
          color: '#e74c3c',
          fontWeight: 700,
          fontSize: '15px',
          cursor: 'pointer',
          width: compact ? 'auto' : '100%',
          alignSelf: compact ? 'flex-start' : 'stretch',
        }}
      >
        <FiLogOut />
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;





