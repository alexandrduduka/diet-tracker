import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { parseMealDescription, type ParsedMeal } from '../lib/gemini';
import { sumMacros } from '../lib/nutrition';
import { db } from '../db';
import { getTodayKey } from '../lib/date';
import { useOnlineStatus } from '../components/OfflineBanner';
import type { FoodItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLang } from '../store/langContext';
import { saveSettings } from '../store/settings';

type ChatMessage =
  | { role: 'assistant'; text: string }
  | { role: 'user'; text: string }
  | { role: 'result'; parsed: ParsedMeal }
  | { role: 'error'; text: string }
  | { role: 'setup'; retryText: string };

export function Chat() {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: 'assistant', text: t.chatWelcome },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingMeal, setPendingMeal] = useState<ParsedMeal | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualFields, setManualFields] = useState({ name: '', calories: '', protein: '', fat: '', carbs: '' });
  const [setupKey, setSetupKey] = useState('');
  const [showSetupKey, setShowSetupKey] = useState(false);
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages((m) => {
      if (m.length === 1 && m[0].role === 'assistant') {
        return [{ role: 'assistant', text: t.chatWelcome }];
      }
      return m;
    });
  }, [t.chatWelcome]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const parsed = await parseMealDescription(userText, lang);
      setPendingMeal(parsed);
      setMessages((m) => [...m, { role: 'result', parsed }]);
    } catch (err: any) {
      let errMsg = `Something went wrong: ${err?.message ?? 'unknown'}. You can log manually below.`;
      const msg: string = err?.message ?? '';
      if (msg === 'NO_API_KEY') {
        setMessages((m) => [...m, { role: 'setup', retryText: userText }]);
        setLoading(false);
        return;
      } else if (msg === 'INVALID_API_KEY') {
        errMsg = t.invalidApiKey;
      } else if (msg === 'RATE_LIMIT') {
        errMsg = t.rateLimit;
      } else if (msg === 'PARSE_ERROR') {
        errMsg = t.parseError;
      } else if (msg.startsWith('API_ERROR:')) {
        errMsg = `API error: ${msg.slice(10).trim()}`;
      }
      setMessages((m) => [...m, { role: 'error', text: errMsg }]);
      setShowManual(true);
    } finally {
      setLoading(false);
    }
  }

  async function saveMeal(parsed: ParsedMeal) {
    const total = sumMacros(parsed.foods);
    await db.meals.add({
      timestamp: new Date(),
      dayKey: getTodayKey(),
      rawInput: messages.filter((m) => m.role === 'user').slice(-1)[0]?.text ?? '',
      foods: parsed.foods,
      totalMacros: total,
      llmConfidence: parsed.confidence,
      notes: parsed.notes,
    });
    setPendingMeal(null);
    navigate('/');
  }

  async function handleSetupSave(retryText: string) {
    const trimmed = setupKey.trim();
    if (!trimmed) return;
    saveSettings({ geminiApiKey: trimmed });
    window.dispatchEvent(new Event('dtk:settings-changed'));
    // Remove the setup card and re-send the original message
    setMessages((m) => m.filter((msg) => msg.role !== 'setup'));
    setSetupKey('');
    setInput('');
    setLoading(true);
    setMessages((m) => [...m, { role: 'user', text: retryText }]);
    try {
      const parsed = await parseMealDescription(retryText, lang);
      setPendingMeal(parsed);
      setMessages((m) => [...m, { role: 'result', parsed }]);
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      let errMsg = `Something went wrong: ${msg || 'unknown'}. You can log manually below.`;
      if (msg === 'INVALID_API_KEY') errMsg = t.invalidApiKey;
      else if (msg === 'RATE_LIMIT') errMsg = t.rateLimit;
      else if (msg === 'PARSE_ERROR') errMsg = t.parseError;
      else if (msg.startsWith('API_ERROR:')) errMsg = `API error: ${msg.slice(10).trim()}`;
      setMessages((m) => [...m, { role: 'error', text: errMsg }]);
      setShowManual(true);
    } finally {
      setLoading(false);
    }
  }

  async function saveManual() {
    const food: FoodItem = {
      name: manualFields.name || 'Unknown food',
      quantity: '1 serving',
      macros: {
        calories: Number(manualFields.calories) || 0,
        protein: Number(manualFields.protein) || 0,
        fat: Number(manualFields.fat) || 0,
        carbs: Number(manualFields.carbs) || 0,
      },
    };
    const rawInput = messages.filter((m) => m.role === 'user').slice(-1)[0]?.text ?? manualFields.name;
    await db.meals.add({
      timestamp: new Date(),
      dayKey: getTodayKey(),
      rawInput,
      foods: [food],
      totalMacros: food.macros,
      llmConfidence: 'manual',
    });
    navigate('/');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 border-b border-[#3a3a2a] flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-[#9a9680] hover:text-[#f0ede4] p-1">
          ←
        </button>
        <h1 className="text-lg font-semibold text-[#f0ede4]">{t.logMeal}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
        {messages.map((msg, i) => {
          if (msg.role === 'assistant') {
            return (
              <div key={i} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7cb87a] flex items-center justify-center shrink-0 text-xs font-bold text-[#18180f]">N</div>
                <div className="bg-[#2e2e22] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm text-[#c8c4b0]">{msg.text}</div>
              </div>
            );
          }
          if (msg.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="bg-[#3a3a2a] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm text-[#f0ede4]">{msg.text}</div>
              </div>
            );
          }
          if (msg.role === 'error') {
            return (
              <div key={i} className="flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-[#d4a24c] shrink-0 mt-0.5" />
                <div className="bg-[#3a2a1a] border border-[#5a3a20] rounded-2xl px-4 py-3 max-w-[85%] text-sm text-[#d4a24c]">{msg.text}</div>
              </div>
            );
          }
          if (msg.role === 'setup') {
            return (
              <div key={i} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7cb87a] flex items-center justify-center shrink-0 text-xs font-bold text-[#18180f]">N</div>
                <div className="bg-[#2e2e22] rounded-2xl rounded-tl-sm px-4 py-4 max-w-[95%] w-full text-sm space-y-3">
                  <p className="font-semibold text-[#f0ede4]">{t.apiKeySetupTitle}</p>
                  <p className="text-[#9a9680] text-xs">{t.apiKeySetupFree}</p>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#7cb87a] text-[#18180f] font-medium text-sm hover:bg-[#8fce8d] active:bg-[#6aa368]"
                  >
                    {t.apiKeyOpenStudio} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#c8c4b0]">{t.apiKeyOnceThereTitle}</p>
                    {([t.apiKeyStep1, t.apiKeyStep2, t.apiKeyStep3, t.apiKeyStep4] as string[]).map((step, si) => (
                      <p key={si} className="text-xs text-[#9a9680]">
                        <span className="text-[#5a5a44] mr-1.5">{si + 1}.</span>{step}
                      </p>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type={showSetupKey ? 'text' : 'password'}
                      placeholder="AIza..."
                      value={setupKey}
                      onChange={(e) => setSetupKey(e.target.value)}
                      className="w-full bg-[#1a1a12] border border-[#3a3a2a] rounded-xl px-3 py-2.5 pr-10 text-sm text-[#f0ede4] placeholder:text-[#5a5a44] focus:outline-none focus:ring-2 focus:ring-[#7cb87a]/60"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9680] hover:text-[#c8c4b0]"
                      onClick={() => setShowSetupKey((v) => !v)}
                    >
                      {showSetupKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!setupKey.trim() || loading}
                    onClick={() => handleSetupSave(msg.retryText)}
                  >
                    {t.apiKeySaveAndContinue}
                  </Button>
                </div>
              </div>
            );
          }
          if (msg.role === 'result') {
            const total = sumMacros(msg.parsed.foods);
            return (
              <div key={i} className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#7cb87a] flex items-center justify-center shrink-0 text-xs font-bold text-[#18180f]">N</div>
                  <div className="bg-[#2e2e22] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[95%] text-sm w-full">
                    <p className="text-[#9a9680] mb-3">{t.gotIt}</p>
                    <div className="space-y-2">
                      {msg.parsed.foods.map((food, fi) => (
                        <div key={fi} className="flex justify-between items-start">
                          <div>
                            <p className="text-[#f0ede4] font-medium">{food.name}</p>
                            <p className="text-xs text-[#5a5a44]">{food.quantity}</p>
                          </div>
                          <div className="text-right text-xs text-[#9a9680] shrink-0 ml-4">
                            <p className="text-[#d4a24c] font-medium">{food.macros.calories} kcal</p>
                            <p>P:{food.macros.protein}g C:{food.macros.carbs}g F:{food.macros.fat}g</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#3a3a2a] flex justify-between text-sm">
                      <span className="text-[#9a9680]">{t.total}</span>
                      <div className="text-right">
                        <span className="text-[#d4a24c] font-semibold">{total.calories} kcal</span>
                        <p className="text-xs text-[#5a5a44]">P:{total.protein}g F:{total.fat}g C:{total.carbs}g</p>
                      </div>
                    </div>
                    {msg.parsed.notes && (
                      <p className="mt-2 text-xs text-[#9a9680] italic">{msg.parsed.notes}</p>
                    )}
                    {pendingMeal && i === messages.length - 1 && (
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => saveMeal(msg.parsed)} className="flex-1 gap-1.5">
                          <CheckCircle className="w-4 h-4" /> {t.saveBtn}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setPendingMeal(null); setMessages([{ role: 'assistant', text: t.chatWelcome }]); }} className="flex-1 gap-1.5">
                          <XCircle className="w-4 h-4" /> {t.discard}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}

        {loading && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-[#7cb87a] flex items-center justify-center shrink-0 text-[#18180f]">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#2e2e22] rounded-2xl px-4 py-3 text-sm text-[#9a9680]">{t.analyzing}</div>
          </div>
        )}

        {/* Manual fallback */}
        {showManual && (
          <div className="bg-[#242419] border border-[#3a3a2a] rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-[#c8c4b0]">{t.logManually}</p>
            <Input placeholder={t.foodName} value={manualFields.name} onChange={(e) => setManualFields((f) => ({ ...f, name: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder={t.calories} type="number" value={manualFields.calories} onChange={(e) => setManualFields((f) => ({ ...f, calories: e.target.value }))} />
              <Input placeholder={`${t.protein} (g)`} type="number" value={manualFields.protein} onChange={(e) => setManualFields((f) => ({ ...f, protein: e.target.value }))} />
              <Input placeholder={`${t.fat} (g)`} type="number" value={manualFields.fat} onChange={(e) => setManualFields((f) => ({ ...f, fat: e.target.value }))} />
              <Input placeholder={`${t.carbs} (g)`} type="number" value={manualFields.carbs} onChange={(e) => setManualFields((f) => ({ ...f, carbs: e.target.value }))} />
            </div>
            <Button onClick={saveManual} className="w-full">{t.saveManually}</Button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {!pendingMeal && !showManual && (
        <div className="px-4 py-3 border-t border-[#3a3a2a] safe-bottom">
          {!isOnline ? (
            <div className="space-y-3">
              <p className="text-xs text-[#d4a24c] text-center">{t.offlineManualEntry}</p>
              <Button variant="outline" onClick={() => setShowManual(true)} className="w-full">
                {t.logManually}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#2e2e22] border border-[#3a3a2a] rounded-xl px-4 py-3 text-sm text-[#f0ede4] placeholder:text-[#5a5a44] focus:outline-none focus:ring-2 focus:ring-[#7cb87a]/60"
                placeholder={t.describeWhatYouAte}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl bg-[#7cb87a] flex items-center justify-center disabled:opacity-40 active:bg-[#6aa368] hover:bg-[#8fce8d]"
              >
                <Send className="w-4 h-4 text-[#18180f]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
