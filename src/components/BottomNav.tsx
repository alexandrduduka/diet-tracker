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
              `flex-1 flex flex-col items-center py-2 gap-1 transition-all duration-200 relative ${
                isActive ? 'text-[#7cb87a]' : 'text-[#5a5a44] hover:text-[#9a9680]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`} />
                <span className="text-[9px] font-medium">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7cb87a] animate-scale-in" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
