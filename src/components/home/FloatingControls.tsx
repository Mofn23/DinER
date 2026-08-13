import React, { useState, useRef, useEffect } from 'react';
import { CircleButton } from '../common/BaseUI';
import { IconPlus, IconChat, IconSearch, IconMic, IconClose } from '../common/Icons';
import { useAppStore } from '@/lib/store';

export const FloatingControls: React.FC = () => {
  const { openSheet, isSearchActive, setSearchActive, searchQuery, setSearchQuery, tags } = useAppStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSearchActive]);

  const handleChatClick = () => {
    setToastMessage('AI Chat assistant - Coming soon!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // MonAI Search Mode Floating Dock (Docks right above iOS keyboard with Tag Chips Carousel)
  if (isSearchActive) {
    return (
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-4 flex flex-col gap-2.5 z-50 animate-slide-up bg-gradient-to-t from-[#131313] via-[#131313] to-transparent pt-6">
        {/* Horizontal Tag Chips Carousel */}
        <div className="overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 min-w-max">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSearchQuery(t)}
                className={`h-9 px-4 rounded-full border text-xs font-bold transition-all ${
                  searchQuery === t
                    ? 'bg-[#34C759] text-white border-transparent'
                    : 'bg-[#1C1C1E] border-white/10 text-white hover:bg-[#2A2A2C]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar Row: [ Search Input Pill ] + [ Circular ✕ Button ] */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[52px] px-5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center shadow-elevation">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-base outline-none border-none placeholder-[#8E8E93]"
            />
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchActive(false);
            }}
            className="w-[52px] h-[52px] rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"
          >
            <IconClose className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

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
          <div className="h-[56px] px-3.5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-3">
            <button
              onClick={handleChatClick}
              aria-label="Open AI Chat"
              className="p-1 text-white hover:text-white/80 active:scale-95 transition-transform"
            >
              <IconChat className="w-6 h-6 text-white" />
            </button>
            <div className="w-[1px] h-6 bg-white/10" />
            <button
              onClick={() => setSearchActive(true)}
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
