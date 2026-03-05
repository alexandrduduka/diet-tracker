import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink, Eye, EyeOff, Mic, MicOff, Camera, X, Pencil } from 'lucide-react';
import { parseMealDescription, type ParsedMeal, type MealContext, type ImageAttachment } from '../lib/gemini';
import { sumMacros, recalculateCalories } from '../lib/nutrition';
import type { FoodItem } from '../types';
import { db } from '../db';
import { getTodayKey } from '../lib/date';
import { useOnlineStatus } from '../components/OfflineBanner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLang } from '../store/langContext';
import { saveSettings, getGoals } from '../store/settings';
import { useTodayMeals } from '../hooks/useTodayMeals';

type ChatMessage =
  | { role: 'assistant'; text: string }
  | { role: 'user'; text: string; image?: string }
  | { role: 'result'; parsed: ParsedMeal }
  | { role: 'error'; text: string }
  | { role: 'setup'; retryText: string }
  | { role: 'coach'; text: string };

// Extend browser types for SpeechRecognition (not in all TS libs)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function Chat() {
  const { t, lang } = useLang();
  const todayMeals = useTodayMeals();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: 'assistant', text: t.chatWelcome },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingMeal, setPendingMeal] = useState<ParsedMeal | null>(null);
  const [editingResult, setEditingResult] = useState(false);
  const [editedFoods, setEditedFoods] = useState<FoodItem[]>([]);
  const [showManual, setShowManual] = useState(false);
  const [manualFields, setManualFields] = useState({ name: '', calories: '', protein: '', fat: '', carbs: '' });
  const [setupKey, setSetupKey] = useState('');
  const [showSetupKey, setShowSetupKey] = useState(false);

  // Mic state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Photo state
  const [attachedImage, setAttachedImage] = useState<ImageAttachment | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  function toggleMic() {
    if (!speechSupported) {
      setMessages((m) => [...m, { role: 'error', text: t.micNotSupported }]);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US'
      : lang === 'ru' ? 'ru-RU'
      : lang === 'uk' ? 'uk-UA'
      : lang === 'cs' ? 'cs-CZ'
      : lang === 'de' ? 'de-DE'
      : lang === 'fr' ? 'fr-FR'
      : lang === 'es' ? 'es-ES'
      : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // dataUrl = "data:<mimeType>;base64,<data>"
      const commaIdx = dataUrl.indexOf(',');
      const meta = dataUrl.slice(0, commaIdx); // "data:image/jpeg;base64"
      const base64 = dataUrl.slice(commaIdx + 1);
      const mimeType = meta.split(':')[1].split(';')[0];
      setAttachedImage({ base64, mimeType });
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function removePhoto() {
    setAttachedImage(null);
    setImagePreview(null);
  }

  async function handleSend() {
    if ((!input.trim() && !attachedImage) || loading) return;
    const userText = input.trim();
    const imageSnapshot = attachedImage;
    const previewSnapshot = imagePreview;
    setInput('');
    setAttachedImage(null);
    setImagePreview(null);
    setMessages((m) => [...m, { role: 'user', text: userText || '📷', image: previewSnapshot ?? undefined }]);
    setLoading(true);

    try {
      const goals = getGoals();
      const consumed = todayMeals
        ? todayMeals.reduce(
            (acc, m) => ({
              calories: acc.calories + m.totalMacros.calories,
              protein: acc.protein + m.totalMacros.protein,
              fat: acc.fat + m.totalMacros.fat,
              carbs: acc.carbs + m.totalMacros.carbs,
            }),
            { calories: 0, protein: 0, fat: 0, carbs: 0 }
          )
        : { calories: 0, protein: 0, fat: 0, carbs: 0 };
      const context: MealContext = { goals, consumed };
      const parsed = await parseMealDescription(userText, lang, context, imageSnapshot ?? undefined);
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
    if (parsed.message) {
      setMessages((m) => [...m, { role: 'coach', text: parsed.message! }]);
    } else {
      navigate('/');
    }
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
    <div className="flex flex-col min-h-screen pb-20">
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
          if (msg.role === 'assistant' || msg.role === 'coach') {
            return (
              <div key={i} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7cb87a] flex items-center justify-center shrink-0 text-xs font-bold text-[#18180f]">N</div>
                <div className="bg-[#2e2e22] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm text-[#c8c4b0]">{msg.text}</div>
              </div>
            );
          }
          if (msg.role === 'user') {
            return (
              <div key={i} className="flex justify-end flex-col items-end gap-1">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attached"
                    className="max-w-[200px] max-h-[150px] rounded-xl object-cover border border-[#3a3a2a]"
                  />
                )}
                {msg.text && msg.text !== '📷' && (
                  <div className="bg-[#3a3a2a] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm text-[#f0ede4]">{msg.text}</div>
                )}
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
            const isPending = pendingMeal && i === messages.length - 1;
            const displayFoods = (isPending && editingResult) ? editedFoods : msg.parsed.foods;
            const total = sumMacros(displayFoods);
            return (
              <div key={i} className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#7cb87a] flex items-center justify-center shrink-0 text-xs font-bold text-[#18180f]">N</div>
                  <div className="bg-[#2e2e22] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[95%] text-sm w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#9a9680]">{t.gotIt}</p>
                      {isPending && !editingResult && (
                        <button
                          onClick={() => { setEditedFoods(msg.parsed.foods.map(f => ({ ...f, macros: { ...f.macros } }))); setEditingResult(true); }}
                          className="flex items-center gap-1 text-xs text-[#9a9680] hover:text-[#f0ede4] px-2 py-1 rounded-lg hover:bg-[#3a3a2a]"
                        >
                          <Pencil className="w-3 h-3" /> {t.editSuggestion}
                        </button>
                      )}
                    </div>

                    {editingResult && isPending ? (
                      <div className="space-y-3">
                        {editedFoods.map((food, fi) => (
                          <div key={fi} className="space-y-2 pb-3 border-b border-[#3a3a2a] last:border-0">
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                className="col-span-2 bg-[#1a1a12] border border-[#3a3a2a] rounded-lg px-2 py-1.5 text-sm text-[#f0ede4] focus:outline-none focus:ring-1 focus:ring-[#7cb87a]/60"
                                value={food.name}
                                onChange={(e) => setEditedFoods((prev) => prev.map((f, j) => j === fi ? { ...f, name: e.target.value } : f))}
                                placeholder="Food name"
                              />
                              <input
                                className="col-span-2 bg-[#1a1a12] border border-[#3a3a2a] rounded-lg px-2 py-1.5 text-xs text-[#9a9680] focus:outline-none focus:ring-1 focus:ring-[#7cb87a]/60"
                                value={food.quantity}
                                onChange={(e) => setEditedFoods((prev) => prev.map((f, j) => j === fi ? { ...f, quantity: e.target.value } : f))}
                                placeholder="Quantity"
                              />
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              <div className="space-y-0.5">
                                <label className="text-[9px] text-[#5a5a44] uppercase tracking-wide block">kcal</label>
                                <div className="flex h-[30px] w-full items-center rounded-lg border border-[#3a3a2a] bg-[#1a1a12] px-2 text-xs text-[#5a5a44] select-none">
                                  {recalculateCalories(food.macros)}
                                </div>
                              </div>
                              {(['protein', 'carbs', 'fat'] as const).map((key) => (
                                <div key={key} className="space-y-0.5">
                                  <label className="text-[9px] text-[#5a5a44] uppercase tracking-wide block">{key[0].toUpperCase()}</label>
                                  <input
                                    type="number"
                                    className="w-full bg-[#1a1a12] border border-[#3a3a2a] rounded-lg px-2 py-1.5 text-xs text-[#f0ede4] focus:outline-none focus:ring-1 focus:ring-[#7cb87a]/60"
                                    value={food.macros[key]}
                                    onChange={(e) => {
                                      const updated = { ...food.macros, [key]: Number(e.target.value) || 0 };
                                      updated.calories = recalculateCalories(updated);
                                      setEditedFoods((prev) => prev.map((f, j) => j === fi ? { ...f, macros: updated } : f));
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {displayFoods.map((food, fi) => (
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
                    )}

                    <div className="mt-3 pt-3 border-t border-[#3a3a2a] flex justify-between text-sm">
                      <span className="text-[#9a9680]">{t.total}</span>
                      <div className="text-right">
                        <span className="text-[#d4a24c] font-semibold">{total.calories} kcal</span>
                        <p className="text-xs text-[#5a5a44]">P:{total.protein}g F:{total.fat}g C:{total.carbs}g</p>
                      </div>
                    </div>
                    {msg.parsed.notes && !editingResult && (
                      <p className="mt-2 text-xs text-[#9a9680] italic">{msg.parsed.notes}</p>
                    )}
                    {isPending && (
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => { const mealToSave = editingResult ? { ...msg.parsed, foods: editedFoods } : msg.parsed; setEditingResult(false); saveMeal(mealToSave); }} className="flex-1 gap-1.5">
                          <CheckCircle className="w-4 h-4" /> {t.saveBtn}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setPendingMeal(null); setEditingResult(false); setMessages([{ role: 'assistant', text: t.chatWelcome }]); }} className="flex-1 gap-1.5">
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
            <div className="space-y-2">
              {/* Photo preview */}
              {imagePreview && (
                <div className="flex items-center gap-2 px-1">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-12 h-12 rounded-lg object-cover border border-[#3a3a2a]"
                  />
                  <span className="text-xs text-[#9a9680] flex-1">{t.photoAttached}</span>
                  <button
                    onClick={removePhoto}
                    className="text-[#9a9680] hover:text-[#f0ede4] p-1"
                    aria-label={t.photoRemove}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input row */}
              <div className="flex gap-2 items-center">
                {/* Hidden file input for photo */}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                {/* Camera button */}
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={loading}
                  title={t.takePhotoOrChoose}
                  className="w-11 h-11 rounded-xl border border-[#3a3a2a] bg-[#2e2e22] flex items-center justify-center text-[#9a9680] hover:text-[#7cb87a] hover:border-[#7cb87a]/50 disabled:opacity-40 shrink-0 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Text input */}
                <input
                  className="flex-1 bg-[#2e2e22] border border-[#3a3a2a] rounded-xl px-4 py-3 text-sm text-[#f0ede4] placeholder:text-[#5a5a44] focus:outline-none focus:ring-2 focus:ring-[#7cb87a]/60"
                  placeholder={t.describeWhatYouAte}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={loading}
                />

                {/* Mic button — only shown when speech is supported */}
                {speechSupported && (
                  <button
                    onClick={toggleMic}
                    disabled={loading}
                    title={isListening ? t.micListening : t.micTapToSpeak}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors ${
                      isListening
                        ? 'bg-[#7cb87a] text-[#18180f] animate-pulse'
                        : 'border border-[#3a3a2a] bg-[#2e2e22] text-[#9a9680] hover:text-[#7cb87a] hover:border-[#7cb87a]/50'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={loading || (!input.trim() && !attachedImage)}
                  className="w-11 h-11 rounded-xl bg-[#7cb87a] flex items-center justify-center disabled:opacity-40 active:bg-[#6aa368] hover:bg-[#8fce8d] shrink-0"
                >
                  <Send className="w-4 h-4 text-[#18180f]" />
                </button>
              </div>

              {/* Mic status hint */}
              {isListening && (
                <p className="text-xs text-[#7cb87a] text-center animate-pulse">{t.micListening}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
