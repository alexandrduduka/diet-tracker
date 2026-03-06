import { useState, useEffect } from 'react';

interface HotspotProps {
  storageKey: string;
  label: string;
  tooltipSide?: 'top' | 'bottom';
  delay?: number;
  children: React.ReactNode;
}

export function Hotspot({ storageKey, label, tooltipSide = 'top', delay = 800, children }: HotspotProps) {
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem(storageKey));
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setTooltipVisible(true), delay);
    return () => clearTimeout(t);
  }, [dismissed, delay]);

  function dismiss() {
    localStorage.setItem(storageKey, '1');
    setTooltipVisible(false);
    setDismissed(true);
  }

  if (dismissed) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-flex">
      {children}

      {/* Pulsing ring overlay — pointer-events-none so it never intercepts taps */}
      <span className="absolute inset-0 rounded-xl border-2 border-[#7cb87a]/60 animate-ping pointer-events-none" />
      <span className="absolute inset-0 rounded-xl border border-[#7cb87a]/30 pointer-events-none" />

      {/* Tooltip bubble */}
      {tooltipVisible && (
        <div
          className={`absolute z-40 ${
            tooltipSide === 'top'
              ? 'bottom-full mb-2'
              : 'top-full mt-2'
          } left-1/2 -translate-x-1/2 animate-fade-in`}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="bg-[#2e2e22] border border-[#7cb87a]/40 rounded-xl px-3 py-2 shadow-lg w-max max-w-[190px]">
            <p className="text-xs text-[#c8c4b0] leading-snug">{label}</p>
            <button
              onClick={dismiss}
              className="mt-1.5 text-[10px] text-[#7cb87a] font-medium hover:text-[#8fce8d] transition-colors"
            >
              Got it ✓
            </button>
          </div>
          {/* Caret arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#2e2e22] border-[#7cb87a]/40 rotate-45 ${
              tooltipSide === 'top'
                ? 'bottom-0 translate-y-1/2 border-r border-b'
                : 'top-0 -translate-y-1/2 border-l border-t'
            }`}
          />
        </div>
      )}
    </div>
  );
}
