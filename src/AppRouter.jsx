import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



import PriorAuthSubmissionPage from './components/PriorAuthSubmissionPage';
import PriorAuthSearchPage from './components/PriorAuthSearchPage';

import DashboardLayout from './components/DashboardLayout';

import SupportChatPage from './components/SupportChatPage';
import PeerToPeerRequestPage from './components/PeerToPeerRequestPage';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="/pa/new" element={<PriorAuthSubmissionPage />} />
      <Route path="/pa/search" element={<PriorAuthSearchPage />} />
      <Route path="/support/tickets" element={<SupportChatPage />} />
      <Route path="/p2p/request" element={<PeerToPeerRequestPage />} />
      <Route path="/pa/p2p" element={<PeerToPeerRequestPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
