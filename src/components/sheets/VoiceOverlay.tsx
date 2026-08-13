import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconMic, IconCheck } from '../common/Icons';

// Helper to extract amounts from spoken Spanish text reliably (e.g., "30 mil", "30.000", "cincuenta mil")
function parseSpanishAmount(text: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();

  // 1. Check direct digit numbers with "mil" or "k" e.g., "30 mil", "30mil", "30 k"
  const milMatch = lower.match(/(\d+)\s*(mil|k)/);
  if (milMatch) {
    return parseInt(milMatch[1], 10) * 1000;
  }

  // 2. Check formatted or raw digits e.g., "30.000", "50000"
  const digitsMatch = lower.match(/\b\d+[\d\.]*\b/);
  if (digitsMatch) {
    const cleaned = digitsMatch[0].replace(/\./g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 0) return num;
  }

  // 3. Spoken Spanish word numbers
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

export const VoiceOverlay: React.FC = () => {
  const { activeSheet, closeSheet, addTransaction, currentListId, categories } = useAppStore();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Presiona el micrófono y habla naturalmente');
  const [isProcessing, setIsProcessing] = useState(false);

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
        setStatusMessage('Escuchando... Di ej: "Gasto de 30 mil en almuerzo con crédito"');
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
    setStatusMessage('✨ Gemini 2.0 Flash procesando tu comando...');

    // Extract fallback amount immediately from transcript text
    const fallbackAmount = parseSpanishAmount(transcript);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    try {
      let parsedAmount = fallbackAmount;
      let parsedDescription = transcript;
      let parsedType: 'expense' | 'income' = 'expense';
      let parsedCategoryId = categories[0]?.id || 'cat-1';
      let parsedTags: string[] = [];

      if (apiKey) {
        const categoriesPrompt = categories
          ? categories.map((c: any) => `ID: "${c.id}", Name: "${c.name}", Type: "${c.type}"`).join('\n')
          : '';

        const promptText = `
You are a voice transaction parser for DinER expense tracking app in Colombia.
Extract transaction parameters from the spoken transcript: "${transcript}"

Available Categories:
${categoriesPrompt}

Return ONLY raw JSON with keys "description", "amount" (integer), "type" ("expense" or "income"), "categoryId", "tags".
Do not surround with markdown code blocks.
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
          // Clean markdown backticks if any
          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

          if (rawText) {
            try {
              const aiParsed = JSON.parse(rawText);
              if (aiParsed.amount && typeof aiParsed.amount === 'number' && aiParsed.amount > 0) {
                parsedAmount = aiParsed.amount;
              }
              if (aiParsed.description) parsedDescription = aiParsed.description;
              if (aiParsed.type) parsedType = aiParsed.type;
              if (aiParsed.categoryId) parsedCategoryId = aiParsed.categoryId;
              if (Array.isArray(aiParsed.tags)) parsedTags = aiParsed.tags;
            } catch (err) {
              console.warn('JSON parse error from Gemini text:', err);
            }
          }
        }
      }

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
        setStatusMessage('¡Transacción registrada con éxito!');
        setTimeout(() => {
          closeSheet();
        }, 600);
      } else {
        setStatusMessage('No pudimos detectar un monto claro en la frase. Intenta incluir el valor (ej: 30 mil).');
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      // Even if API throws, if fallbackAmount exists, save it!
      if (fallbackAmount > 0) {
        addTransaction({
          listId: currentListId,
          description: transcript,
          amount: fallbackAmount,
          type: 'expense',
          categoryId: categories[0]?.id || 'cat-1',
          tags: [],
          date: new Date().toISOString().split('T')[0],
          recurrence: 'once',
        });
        stopSpeechRecognition();
        setStatusMessage('¡Transacción registrada con éxito!');
        setTimeout(() => {
          closeSheet();
        }, 600);
      } else {
        setStatusMessage('No pudimos detectar un monto claro en la frase.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (activeSheet !== 'voice') return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131313]/95 backdrop-blur-md flex flex-col justify-between p-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-[max(env(safe-area-inset-top,40px),40px)]">
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
        {transcript && (
          <div className="w-full max-w-sm p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 text-[#F5F5F7] font-bold text-base shadow-elevation animate-scale-up">
            "{transcript}"
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
          <span>{isProcessing ? 'Procesando IA...' : 'Guardar Transacción de Voz'}</span>
        </button>
      </div>
    </div>
  );
};
