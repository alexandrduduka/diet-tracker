import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TutorialHintProps {
  storageKey: string;      // unique key in localStorage, e.g. 'dtk_hint_chat'
  title: string;
  body: string;
  dismissLabel: string;
  emoji?: string;
  className?: string;
}

/**
 * A dismiss-once animated tutorial hint card.
 * Shown on first visit, permanently hidden after the user taps "Got it".
 * Uses localStorage so the hint never reappears after dismissal.
 */
export function TutorialHint({ storageKey, title, body, dismissLabel, emoji = '💡', className = '' }: TutorialHintProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      // Small delay so it feels like a gentle entrance, not an immediate popup
      const t = setTimeout(() => {
        setVisible(true);
        setAnimating(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [storageKey]);

  function dismiss() {
    setAnimating(false);
    localStorage.setItem(storageKey, '1');
    // Wait for exit animation before unmounting
    setTimeout(() => setVisible(false), 350);
  }

  if (!visible) return null;

  return (
    <div
      className={`mx-4 mb-3 rounded-2xl border border-[#7cb87a]/30 bg-gradient-to-br from-[#1e2a1a] to-[#1a2015] px-4 py-3.5 transition-all duration-350 ease-out ${
        animating
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-2 scale-95'
      } ${className}`}
      style={{ transform: animating ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f0ede4] leading-snug mb-1">{title}</p>
          <p className="text-xs text-[#9a9680] leading-relaxed">{body}</p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-[#5a5a44] hover:text-[#9a9680] transition-colors p-0.5 -mt-0.5 -mr-0.5"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={dismiss}
        className="mt-3 w-full py-1.5 rounded-xl text-xs font-medium text-[#7cb87a] bg-[#7cb87a]/10 hover:bg-[#7cb87a]/20 active:bg-[#7cb87a]/30 transition-colors"
      >
        {dismissLabel} ✓
      </button>
    </div>
  );
}
