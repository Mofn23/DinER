import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { matchCategoryFromDescription } from '@/lib/autoCategory';
import { IconClose, IconMic, IconCheck } from '../common/Icons';

// Helper to extract amounts from spoken Spanish text reliably
function parseSpanishAmount(text: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();

  const milMatch = lower.match(/(\d+)\s*(mil|k)/);
  if (milMatch) {
    return parseInt(milMatch[1], 10) * 1000;
  }

  const digitsMatch = lower.match(/\b\d+[\d\.]*\b/);
  if (digitsMatch) {
    const cleaned = digitsMatch[0].replace(/\./g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 0) return num;
  }

  const wordMap: Record<string, number> = {
    'diez mil': 10000,
    'veinte mil': 20000,
    'treinta mil': 30000,
    'cuarenta mil': 40000,
    'cincuenta mil': 50000,
    'sesenta mil': 60000,
    'setenta mil': 70000,
    'ochenta mil': 80000,
    'noventa mil': 90000,
    'cien mil': 100000,
    'doscientos mil': 200000,
    'quinientos mil': 500000,
    'un millon': 1000000,
    'un millón': 1000000,
  };

  for (const [phrase, val] of Object.entries(wordMap)) {
    if (lower.includes(phrase)) return val;
  }

  return 0;
}

// Fallback short title summarizer (removes fluff like "gasto de 30 mil en", "con tarjeta", etc.)
function cleanShortTitle(text: string): string {
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/gasto\s+(de\s+)?(\d+\s*mil|\d+)?\s*(pesos)?\s*(en\s+)?/gi, '');
  cleaned = cleaned.replace(/ingreso\s+(de\s+)?(\d+\s*mil|\d+)?\s*(pesos)?\s*(de\s+)?/gi, '');
  cleaned = cleaned.replace(/con\s+(la\s+)?tarjeta\s*(de\s+crédito|de\s+debito|credito|debito)?/gi, '');
  cleaned = cleaned.replace(/por\s+valor\s+de\s*(\d+\s*mil|\d+)?/gi, '');
  cleaned = cleaned.trim();

  if (!cleaned) return 'Transacción';
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const VoiceOverlay: React.FC = () => {
  const { activeSheet, closeSheet, addTransaction, currentListId, categories, aiMemory } = useAppStore();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Presiona el micrófono y habla naturalmente');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    description: string;
    amount: number;
    categoryName: string;
    categoryEmoji: string;
    tags: string[];
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (activeSheet === 'voice') {
      requestMicPermissionAndStart();
    } else {
      stopSpeechRecognition();
    }

    return () => {
      stopSpeechRecognition();
    };
  }, [activeSheet]);

  const requestMicPermissionAndStart = async () => {
    try {
      setParsedPreview(null);
      setProcessingStage(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }
      startSpeechRecognition();
    } catch (err: any) {
      console.warn('Microphone permission denied:', err);
      setStatusMessage('Debes permitir acceso al micrófono en los ajustes de tu iPhone.');
    }
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Tu dispositivo no soporta reconocimiento de voz nativo.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-CO';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Escuchando... Di ej: "Gasto de 30 mil en KFC con crédito"');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatusMessage('Permiso de micrófono denegado en Ajustes de iOS.');
        } else {
          setStatusMessage('No se pudo escuchar con claridad. Toca el micrófono para intentar de nuevo.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
    }
  };

  // Forcefully release hardware microphone and turn off iOS status bar orange dot 🟠
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.enabled = false;
          track.stop();
        });
      } catch {}
      mediaStreamRef.current = null;
    }
    setIsListening(false);
  };

  const handleClose = () => {
    stopSpeechRecognition();
    closeSheet();
  };

  const handleProcessVoiceCommand = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    stopSpeechRecognition();
    setProcessingStage('✨ Gemini 2.0 Flash categorizando y creando resumen...');

    const fallbackAmount = parseSpanishAmount(transcript);
    const fallbackTitle = cleanShortTitle(transcript);

    // Initial local category & AI memory matching
    let initialCatId = matchCategoryFromDescription(transcript, categories);
    if (!initialCatId && aiMemory) {
      const descLower = transcript.toLowerCase();
      for (const [phrase, catId] of Object.entries(aiMemory)) {
        if (descLower.includes(phrase.toLowerCase())) {
          initialCatId = catId;
          break;
        }
      }
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    let parsedAmount = fallbackAmount;
    let parsedDescription = fallbackTitle;
    let parsedType: 'expense' | 'income' = transcript.toLowerCase().includes('ingreso') ? 'income' : 'expense';
    let parsedCategoryId = initialCatId || categories[0]?.id || 'cat-1';
    let parsedTags: string[] = [];

    if (transcript.toLowerCase().includes('crédito') || transcript.toLowerCase().includes('credito')) {
      parsedTags.push('#credito');
    }

    try {
      if (apiKey) {
        const categoriesPrompt = categories
          ? categories.map((c: any) => `ID: "${c.id}", Name: "${c.name}", Type: "${c.type}", Emoji: "${c.emoji}"`).join('\n')
          : '';

        const promptText = `
You are a voice transaction AI parser for DinER expense app in Colombia.
Extract structured transaction info from this spoken transcript: "${transcript}"

Available Categories:
${categoriesPrompt}

INSTRUCTIONS:
1. "description": Extract ONLY a concise short place/item title (e.g. "KFC", "Uber", "Almuerzo", "Zara", "Mercado"). Do NOT include words like "Gasto de 30 mil en".
2. "amount": Integer COP value (e.g., 30000 for 30 mil).
3. "type": "expense" or "income".
4. "categoryId": Exact ID of best matching category from list (e.g., KFC -> Comida cat-4).
5. "tags": Array of lowercase hashtag strings (e.g., ["#credito", "#kfc"]).

Return ONLY raw JSON: {"description": "...", "amount": 30000, "type": "expense", "categoryId": "cat-4", "tags": ["#credito"]}
Do NOT surround with markdown code blocks.
`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

          if (rawText) {
            try {
              const aiParsed = JSON.parse(rawText);
              if (aiParsed.description) parsedDescription = aiParsed.description;
              if (aiParsed.amount && typeof aiParsed.amount === 'number' && aiParsed.amount > 0) {
                parsedAmount = aiParsed.amount;
              }
              if (aiParsed.type) parsedType = aiParsed.type;
              if (aiParsed.categoryId) parsedCategoryId = aiParsed.categoryId;
              if (Array.isArray(aiParsed.tags)) parsedTags = aiParsed.tags;
            } catch (err) {
              console.warn('JSON parse error from Gemini text:', err);
            }
          }
        }
      }

      // Match category object for preview UI
      const catObj = categories.find((c) => c.id === parsedCategoryId) || categories[0];

      if (parsedAmount > 0) {
        setProcessingStage(null);
        setParsedPreview({
          description: parsedDescription,
          amount: parsedAmount,
          categoryName: catObj.name,
          categoryEmoji: catObj.emoji,
          tags: parsedTags,
        });

        // Add transaction
        addTransaction({
          listId: currentListId,
          description: parsedDescription,
          amount: parsedAmount,
          type: parsedType,
          categoryId: parsedCategoryId,
          tags: parsedTags,
          date: new Date().toISOString().split('T')[0],
          recurrence: 'once',
        });

        setStatusMessage('¡Transacción categorizada y agregada!');
        setTimeout(() => {
          closeSheet();
        }, 1200);
      } else {
        setProcessingStage(null);
        setStatusMessage('No pudimos detectar un monto claro en la frase (ej: 30 mil).');
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      const catObj = categories.find((c) => c.id === parsedCategoryId) || categories[0];
      if (parsedAmount > 0) {
        addTransaction({
          listId: currentListId,
          description: parsedDescription,
          amount: parsedAmount,
          type: parsedType,
          categoryId: parsedCategoryId,
          tags: parsedTags,
          date: new Date().toISOString().split('T')[0],
          recurrence: 'once',
        });
        stopSpeechRecognition();
        setStatusMessage('¡Transacción registrada!');
        setTimeout(() => {
          closeSheet();
        }, 1000);
      } else {
        setProcessingStage(null);
        setStatusMessage('No se pudo procesar la voz.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (activeSheet !== 'voice') return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131313]/95 backdrop-blur-md flex flex-col justify-between p-6 animate-fade-in">
      {/* Top Header & Floating AI Processing Pill */}
      <div className="flex flex-col gap-3 pt-[max(env(safe-area-inset-top,40px),40px)]">
        <div className="flex items-center justify-between">
          <span className="text-[#8E8E93] font-black text-sm uppercase tracking-wider">
            Comando por Voz IA
          </span>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Floating Top AI Processing Pill Banner */}
        {processingStage && (
          <div className="w-full py-2.5 px-4 rounded-full bg-[#2A2A2C] border border-[#34C759]/30 text-[#34C759] font-extrabold text-xs flex items-center justify-center gap-2 animate-pulse shadow-elevation">
            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-[#34C759] rounded-full animate-spin" />
            <span>{processingStage}</span>
          </div>
        )}
      </div>

      {/* Mic Animation & Transcript Group */}
      <div className="flex flex-col items-center justify-center gap-6 my-auto text-center px-4">
        {/* Pulsing Red Mic Button */}
        <button
          onClick={isListening ? stopSpeechRecognition : requestMicPermissionAndStart}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
            isListening
              ? 'bg-[#E8505B] animate-pulse scale-110 ring-8 ring-[#E8505B]/30'
              : 'bg-[#E8505B] hover:scale-105 active:scale-95'
          }`}
        >
          <IconMic className="w-14 h-14 text-white" />
        </button>

        {/* Status Message */}
        <p className="text-white font-extrabold text-lg max-w-xs">{statusMessage}</p>

        {/* Live Transcript Bubble */}
        {transcript && !parsedPreview && (
          <div className="w-full max-w-sm p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 text-[#F5F5F7] font-bold text-base shadow-elevation animate-scale-up">
            "{transcript}"
          </div>
        )}

        {/* Parsed Result Preview Banner */}
        {parsedPreview && (
          <div className="w-full max-w-sm p-4 rounded-2xl bg-[#1C1C1E] border border-[#34C759]/40 flex flex-col gap-2 shadow-2xl animate-scale-up text-left">
            <div className="flex items-center justify-between">
              <span className="text-white font-black text-xl">{parsedPreview.description}</span>
              <span className="text-[#34C759] font-black text-lg">
                ${parsedPreview.amount.toLocaleString('es-CO')} COP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-[#2A2A2C] text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>{parsedPreview.categoryEmoji}</span>
                <span>{parsedPreview.categoryName}</span>
              </div>
              {parsedPreview.tags.map((tag) => (
                <span key={tag} className="text-xs font-bold text-[#8E8E93]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="pb-6">
        <button
          onClick={handleProcessVoiceCommand}
          disabled={!transcript.trim() || isProcessing}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-extrabold text-base transition-all ${
            !transcript.trim() || isProcessing
              ? 'bg-[#1C1C1E] text-[#8E8E93] cursor-not-allowed border border-white/5'
              : 'bg-[#34C759] active:scale-98 shadow-elevation'
          }`}
        >
          <IconCheck className="w-5 h-5 text-white" />
          <span>{isProcessing ? 'Procesando IA...' : 'Procesar con IA y Guardar'}</span>
        </button>
      </div>
    </div>
  );
};
