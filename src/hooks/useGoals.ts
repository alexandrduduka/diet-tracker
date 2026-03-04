import { useState, useEffect } from 'react';
import { getGoals } from '../store/settings';
import type { MacroGoals } from '../types';

export function useGoals(): MacroGoals {
  const [goals, setGoals] = useState<MacroGoals>(getGoals);

  useEffect(() => {
    // Re-read goals when settings might have changed (e.g. navigating back from Settings)
    const handleFocus = () => setGoals(getGoals());
    window.addEventListener('focus', handleFocus);
    // Also listen to a custom event dispatched when settings are saved
    const handleSettingsChanged = () => setGoals(getGoals());
    window.addEventListener('dtk:settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('dtk:settings-changed', handleSettingsChanged);
    };
  }, []);

  return goals;
}
