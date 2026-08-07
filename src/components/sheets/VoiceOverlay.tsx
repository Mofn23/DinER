import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getLocalDateString } from '@/lib/utils';
import { IconClose, IconMic } from '../common/Icons';

export const VoiceOverlay: React.FC = () => {
  const { activeSheet, closeSheet, addTransaction, categories, currentListId } = useAppStore();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(true);

  if (activeSheet !== 'voice') return null;

  const handleSimulatedSpeech = (phrase: string) => {
    setTranscript(phrase);
    setIsListening(false);

    setTimeout(() => {
      let parsedAmount = 0;
      if (phrase.includes('48 mil')) parsedAmount = 48000;
      else if (phrase.includes('105000')) parsedAmount = 105000;
      else parsedAmount = 35000;

      let matchedCat = categories.find((c) => phrase.toLowerCase().includes(c.name.toLowerCase())) || categories[0];

      addTransaction({
        listId: currentListId,
        description: phrase,
        amount: parsedAmount,
        type: 'expense',
        categoryId: matchedCat.id,
        tags: [`#${matchedCat.name.toLowerCase()}`],
        date: getLocalDateString(new Date()),
        recurrence: 'once',
      });

      closeSheet();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex flex-col items-center justify-between p-8 animate-fade-in">
      {/* Top Close Button */}
      <div className="w-full flex justify-end pt-4">
        <button
          onClick={closeSheet}
          className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95"
        >
          <IconClose className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Middle Animated Pulsing Mic */}
      <div className="flex flex-col items-center text-center my-auto gap-6">
        <div className="relative">
          {/* Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-[#E8505B] animate-ping opacity-30 scale-150" />
          <div className="relative w-28 h-28 rounded-full bg-[#E8505B] flex items-center justify-center text-white shadow-elevation">
            <IconMic className="w-12 h-12 text-white" />
          </div>
        </div>

        <h2 className="text-white font-black text-2xl">Listening...</h2>
        <p className="text-[#8E8E93] font-bold text-sm max-w-xs">
          Say something like <br />
          <span className="text-white font-extrabold">&quot;105000 gym bodyfit&quot;</span> or{' '}
          <span className="text-white font-extrabold">&quot;cena 48 mil&quot;</span>
        </p>

        {transcript && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-[#1C1C1E] border border-white/10 text-[#34C759] font-extrabold text-base animate-fade-in">
            &quot;{transcript}&quot;
          </div>
        )}
      </div>

      {/* Quick Demo Buttons for Voice Recognition */}
      <div className="w-full max-w-xs flex flex-col gap-2 pb-6">
        <button
          onClick={() => handleSimulatedSpeech('105000 gym bodyfit')}
          className="w-full py-3 rounded-2xl bg-[#1C1C1E] border border-white/10 text-white font-bold text-sm active:scale-95"
        >
          Test: &quot;105000 gym bodyfit&quot;
        </button>
        <button
          onClick={() => handleSimulatedSpeech('cena 48 mil')}
          className="w-full py-3 rounded-2xl bg-[#1C1C1E] border border-white/10 text-white font-bold text-sm active:scale-95"
        >
          Test: &quot;cena 48 mil&quot;
        </button>
      </div>
    </div>
  );
};
