import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { DetectionPage } from './pages/DetectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { MapPage } from './pages/MapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ModelLabPage } from './pages/ModelLabPage';

import { RoadAI } from './components/common/RoadAI';

// Simple, clean layout wrapper
const AppLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // App routes where sidebar is displayed
  const isAppRoute = [
    '/dashboard',
    '/detection',
    '/history',
    '/map',
    '/analytics',
    '/settings',
    '/model-lab'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#111827_48%,#172033_100%)] flex flex-col text-slate-100 relative">
      {/* Clean Top Navigation */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {isAppRoute && (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main Clean Workspace */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage onReplayIntro={() => {}} />} />
            <Route path="/model-lab" element={<ModelLabPage />} />
            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <RoadAI />
    </div>
  );
};

export function App() {
  // Intro completely removed as requested
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
