import React, { useState } from 'react';
import { CircleButton } from '../common/BaseUI';
import { IconPlus, IconChat, IconSearch, IconMic } from '../common/Icons';
import { useAppStore } from '@/lib/store';

export const FloatingControls: React.FC = () => {
  const { openSheet, isSearchActive, setSearchActive } = useAppStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChatClick = () => {
    setToastMessage('AI Chat assistant - Coming soon!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#2A2A2C] border border-white/20 text-white font-extrabold text-sm shadow-elevation animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-6 left-0 right-0 max-w-[390px] mx-auto px-5 flex items-center justify-between pointer-events-none z-30">
        {/* Left Control Group */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Plus Add Button */}
          <CircleButton
            onClick={() => openSheet('add_tx')}
            size={56}
            ariaLabel="Add transaction"
          >
            <IconPlus className="w-7 h-7 text-white" />
          </CircleButton>

          {/* Chat & Search Pill */}
          <div className="h-[56px] px-3.5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-3 shadow-sm">
            <button
              onClick={handleChatClick}
              aria-label="Open AI Chat"
              className="p-1 text-white hover:text-white/80 active:scale-95 transition-transform"
            >
              <IconChat className="w-6 h-6 text-white" />
            </button>
            <div className="w-[1px] h-6 bg-white/10" />
            <button
              onClick={() => setSearchActive(!isSearchActive)}
              aria-label="Toggle Search"
              className={`p-1 active:scale-95 transition-transform ${
                isSearchActive ? 'text-[#34C759]' : 'text-white hover:text-white/80'
              }`}
            >
              <IconSearch className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right Voice FAB */}
        <div className="pointer-events-auto">
          <button
            onClick={() => openSheet('voice')}
            aria-label="Voice Input"
            className="w-[76px] h-[76px] rounded-full bg-[#E8505B] flex items-center justify-center text-white shadow-elevation active:scale-95 transition-transform duration-150"
          >
            <IconMic className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </>
  );
};
