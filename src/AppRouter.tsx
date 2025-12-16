import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import PriorAuthSubmissionPage from './components/PriorAuthSubmissionPage';
import PriorAuthSearchPage from './components/PriorAuthSearchPage';
import DashboardLayout from './components/DashboardLayout';
import SupportChatPage from './components/SupportChatPage';
import ADRManagementPage from './components/ADRManagementPage';
import PeerToPeerRequestPage from './components/PeerToPeerRequestPage';
import ADRSubmissionForm from './components/ADRSubmissionForm';
import PADetailView from './components/PADetailView';
import { featureFlags } from './config/featureFlags';

const AppRouter: React.FC = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/pa/new" element={<PriorAuthSubmissionPage />} />
        <Route path="/pa/search" element={<PriorAuthSearchPage />} />
        <Route path="/pa/details/:paId" element={<PADetailView />} />
        {featureFlags.enableSupportChat && (
          <Route path="/support/tickets" element={<SupportChatPage />} />
        )}
        <Route path="/p2p/request" element={<PeerToPeerRequestPage />} />
        <Route path="/pa/p2p" element={<PeerToPeerRequestPage />} />
        <Route path="/pa/p2p/:paId" element={<PeerToPeerRequestPage />} />
        <Route path="/adr/management" element={<ADRManagementPage />} />
        <Route path="/adr/submit/:claimId" element={<ADRSubmissionForm />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  </ErrorBoundary>
);

export default AppRouter;
