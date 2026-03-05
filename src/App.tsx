import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { History } from './pages/History';
import { Measurements } from './pages/Measurements';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { Articles } from './pages/Articles';
import { ArticleDetail } from './pages/ArticleDetail';
import { Onboarding } from './pages/Onboarding';
import { BottomNav } from './components/BottomNav';
import { getSettings } from './store/settings';
import { trackPageView } from './lib/analytics';

const HIDE_NAV_ROUTES = ['/settings', '/onboarding'];

function AppShell() {
  const location = useLocation();
  const hideNav = HIDE_NAV_ROUTES.some((r) => location.pathname === r);

  // Track every HashRouter navigation as a GA4 page view
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  const settings = getSettings();
  if (!settings.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative">
      {/* Persistent logo strip — always visible at the top */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-8 pointer-events-none"
              style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="flex items-center gap-1.5 select-none">
          <img
            src="/icons/icon-192x192.png"
            alt="Diet Tracker"
            className="w-4 h-4 rounded-sm opacity-70"
            aria-hidden="true"
          />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#5a5a44] opacity-80">
            Diet Tracker
          </span>
        </div>
      </header>

      <main id="main-content" key={location.pathname} className="animate-fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
