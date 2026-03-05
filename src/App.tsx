import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const HIDE_NAV_ROUTES = ['/settings', '/onboarding'];

function AppShell() {
  const location = useLocation();
  const hideNav = HIDE_NAV_ROUTES.some((r) => location.pathname === r);

  const settings = getSettings();
  if (!settings.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative">
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
