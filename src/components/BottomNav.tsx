import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, History, Ruler, BarChart2 } from 'lucide-react';
import { useLang } from '../store/langContext';

export function BottomNav() {
  const { t } = useLang();

  const NAV_ITEMS = [
    { to: '/', label: t.navToday, icon: Home },
    { to: '/chat', label: t.navLog, icon: MessageSquare },
    { to: '/history', label: t.navHistory, icon: History },
    { to: '/measurements', label: t.navBody, icon: Ruler },
    { to: '/analytics', label: t.navCharts, icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#18180f]/95 backdrop-blur border-t border-[#3a3a2a] safe-bottom">
      <div className="flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-1 transition-colors ${
                isActive ? 'text-[#7cb87a]' : 'text-[#5a5a44] hover:text-[#9a9680]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
