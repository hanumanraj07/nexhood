import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import OverviewPage from './OverviewPage';
import NeighborhoodPage from './NeighborhoodPage';
import ParkingPage from './ParkingPage';
import ResidentsPage from './ResidentsPage';
import GuardPage from './GuardPage';
import IntelligencePage from './IntelligencePage';
import MatchStudioPage from './MatchStudioPage';
import RiskCommandPage from './RiskCommandPage';
import OpsCenterPage from './OpsCenterPage';
import DocumentsSimulatorPage from './DocumentsSimulatorPage';
import LocationExplorerPage from './LocationExplorerPage';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="intelligence" element={<IntelligencePage />} />
      <Route path="match-studio" element={<MatchStudioPage />} />
      <Route path="risk-command" element={<RiskCommandPage />} />
      <Route path="ops-center" element={<OpsCenterPage />} />
      <Route path="docs-simulator" element={<DocumentsSimulatorPage />} />
      <Route path="location-explorer" element={<LocationExplorerPage />} />
      <Route path="neighborhood" element={<NeighborhoodPage />} />
      <Route path="parking" element={<ParkingPage />} />
      <Route path="residents" element={user?.role === 'admin' ? <ResidentsPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="guard" element={user?.role === 'guard' || user?.role === 'admin' ? <GuardPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default Dashboard;
