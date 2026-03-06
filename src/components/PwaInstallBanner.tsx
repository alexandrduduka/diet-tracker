import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useLang } from '../store/langContext';

const DISMISSED_KEY = 'dtk_pwa_install_dismissed';

/**
 * Shows a "Add to Home Screen" nudge when:
 * 1. The browser fires the `beforeinstallprompt` event (Chrome/Android/Edge)
 * 2. OR on iOS Safari (detected via platform, no native event)
 * Dismissed permanently via localStorage.
 */
export function PwaInstallBanner() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Detect iOS Safari (no beforeinstallprompt event)
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
    const standalone = (navigator as any).standalone === true
      || window.matchMedia('(display-mode: standalone)').matches;

    if (standalone) return; // Already installed

    if (ios) {
      setIsIos(true);
      // Delay the banner so it doesn't immediately compete with the tutorial hint
      const t = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t);
    }

    // Chrome / Android / Edge
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const t2 = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t2);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setShow(false);
  }

  async function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result?.outcome === 'accepted') {
        dismiss();
      } else {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS: can't trigger natively, just dismiss the banner
      dismiss();
    }
  }

  if (!show) return null;

  return (
    <div className="mx-4 mb-3 rounded-2xl border border-[#d4a24c]/30 bg-gradient-to-br from-[#2a2010] to-[#221c0a] px-4 py-3.5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#d4a24c]/15 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-[#d4a24c]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f0ede4] leading-snug">{t.pwaInstallTitle}</p>
          <p className="text-xs text-[#9a9680] leading-relaxed mt-0.5">
            {isIos
              ? 'Tap the share button ⎙ then "Add to Home Screen"'
              : t.pwaInstallBody}
          </p>
        </div>
        <button onClick={dismiss} className="shrink-0 text-[#5a5a44] hover:text-[#9a9680] p-0.5 -mt-0.5 -mr-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        {!isIos && (
          <button
            onClick={install}
            className="flex-1 py-1.5 rounded-xl text-xs font-medium text-[#18180f] bg-[#d4a24c] hover:bg-[#e8b85e] active:bg-[#c09040] transition-colors"
          >
            {t.pwaInstallAction}
          </button>
        )}
        <button
          onClick={dismiss}
          className={`py-1.5 rounded-xl text-xs font-medium text-[#9a9680] bg-[#2e2e22] hover:bg-[#3a3a2a] transition-colors ${isIos ? 'flex-1' : 'px-4'}`}
        >
          {t.pwaInstallDismiss}
        </button>
      </div>
    </div>
  );
}
