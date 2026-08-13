import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconMic, IconCheck } from '../common/Icons';

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
      setStatusMessage('Debes permitir acceso al micrófono en los ajustes de tu iPhone para usar esta función.');
    }
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Tu dispositivo no soporta reconocimiento de voz nativo. Escribe tu comando.');
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

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    setIsListening(false);
  };

  const handleProcessVoiceCommand = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    setStatusMessage('✨ Gemini 2.0 Flash procesando tu comando...');

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    try {
      const categoriesPrompt = categories
        ? categories.map((c: any) => `ID: "${c.id}", Name: "${c.name}", Type: "${c.type}"`).join('\n')
        : '';

      const promptText = `
You are a voice transaction parser for DinER expense tracking app in Colombia.
Extract transaction parameters from the following spoken voice command transcript:

Spoken Transcript: "${transcript}"

Available Categories:
${categoriesPrompt}

Currency is COP (Colombian Pesos). Note: Phrases like "45 mil", "45k", "45000" mean amount 45000.

Return ONLY valid JSON matching this exact structure:
{
  "description": "Clean concise transaction description title string (e.g. McDonald's)",
  "amount": numeric integer value (e.g. 45000),
  "type": "expense" or "income",
  "categoryId": "matched category ID string or null",
  "tags": ["array", "of", "#lowercase_tags"]
}
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
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          if (parsed.amount && parsed.amount > 0) {
            addTransaction({
              listId: currentListId,
              description: parsed.description || 'Voice Transaction',
              amount: parsed.amount,
              type: parsed.type || 'expense',
              categoryId: parsed.categoryId || categories[0]?.id || 'cat-1',
              tags: parsed.tags || [],
              date: new Date().toISOString().split('T')[0],
              recurrence: 'once',
            });
            setStatusMessage('¡Transacción registrada con éxito!');
            setTimeout(() => {
              closeSheet();
            }, 800);
            return;
          }
        }
      }
      setStatusMessage('No pudimos detectar un monto claro. Inténtalo de nuevo.');
    } catch (err) {
      console.error('Voice processing error:', err);
      setStatusMessage('Error procesando el comando.');
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
          onClick={closeSheet}
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
