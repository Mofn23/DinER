import React, { useState, useRef, useEffect } from 'react';
import { CircleButton } from '../common/BaseUI';
import {
  IconChevronDown,
  IconCalendar,
  IconGear,
  IconClose,
  IconShare,
  IconPencil,
  IconPlus,
  IconCheck,
} from '../common/Icons';
import { useAppStore } from '@/lib/store';

export const TopBar: React.FC = () => {
  const {
    currentListId,
    lists,
    setCurrentListId,
    isMonthStripVisible,
    toggleMonthStrip,
    openSheet,
    addList,
    isSearchActive,
    setSearchActive,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentList = lists.find((l) => l.id === currentListId) || lists[0];

  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSearchActive]);

  const handleCreateNewList = () => {
    setIsDropdownOpen(false);
    const name = prompt('New List Name:', 'Trabajo');
    if (name) {
      addList(name);
    }
  };

  // Top Live Search Mode Header (Safe area padded for Dynamic Island)
  if (isSearchActive) {
    return (
      <div className="relative flex items-center justify-between pt-[max(env(safe-area-inset-top,50px),50px)] pb-3 px-1 border-b border-white/10 z-30 animate-fade-in">
        {/* Giant Top Search Input Field */}
        <div className="flex-1 mr-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[32px] font-black text-[#F5F5F7] placeholder-[#3A3A3C] outline-none border-none tracking-tight"
          />
        </div>

        {/* Circular Close Button ✕ */}
        <button
          onClick={() => {
            setSearchQuery('');
            setSearchActive(false);
          }}
          aria-label="Close Search"
          className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform shrink-0"
        >
          <IconClose className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  // Normal TopBar Mode (Padded for Dynamic Island & Status Bar safe area)
  return (
    <div className="relative flex items-center justify-between pt-[max(env(safe-area-inset-top,50px),50px)] pb-3 px-1 z-30">
      {/* Left List Selector Pill (Subtle MonAI proportion) */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-11 px-4 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-1.5 text-white font-extrabold text-[14px] active:scale-95 transition-transform duration-150 shadow-sm"
        >
          <span>{currentList.name}</span>
          <IconChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute left-0 top-[52px] w-60 bg-[#1C1C1E] border border-white/10 rounded-2xl p-2 shadow-elevation z-50 animate-scale-up">
              {/* Lists */}
              <div className="flex flex-col gap-1">
                {lists.map((l) => {
                  const isActive = l.id === currentListId;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setCurrentListId(l.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full h-10 px-3 rounded-xl flex items-center justify-between text-left font-extrabold text-[14px] text-white hover:bg-[#2A2A2C] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {isActive && <IconCheck className="w-4 h-4 text-[#34C759]" />}
                        <span>{l.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-white/10" />

              {/* Actions row: Share / Edit / New */}
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openSheet('lists');
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#2A2A2C] text-[#8E8E93] hover:text-white transition-colors"
                >
                  <IconShare className="w-4 h-4 mb-1 text-white" />
                  <span className="text-[11px] font-bold">Share</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openSheet('lists');
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#2A2A2C] text-[#8E8E93] hover:text-white transition-colors"
                >
                  <IconPencil className="w-4 h-4 mb-1 text-white" />
                  <span className="text-[11px] font-bold">Edit</span>
                </button>

                <button
                  onClick={handleCreateNewList}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#2A2A2C] text-[#8E8E93] hover:text-white transition-colors"
                >
                  <IconPlus className="w-4 h-4 mb-1 text-white" />
                  <span className="text-[11px] font-bold">New</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Subtle Circular Buttons: Calendar & Settings (42px perfectly centered) */}
      <div className="flex items-center gap-2.5">
        <CircleButton
          onClick={toggleMonthStrip}
          size={42}
          ariaLabel="Toggle calendar"
          badge={
            isMonthStripVisible ? (
              <div className="w-4 h-4 rounded-full bg-[#E8505B] flex items-center justify-center border border-[#1C1C1E]">
                <IconClose className="w-3 h-3 text-white" />
              </div>
            ) : undefined
          }
        >
          <IconCalendar className="w-5 h-5 text-white shrink-0" />
        </CircleButton>

        <CircleButton onClick={() => openSheet('settings')} size={42} ariaLabel="Open settings">
          <IconGear className="w-5 h-5 text-white shrink-0" />
        </CircleButton>
      </div>
    </div>
  );
};
