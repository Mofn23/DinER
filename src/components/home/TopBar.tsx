import React, { useState } from 'react';
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
  } = useAppStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentList = lists.find((l) => l.id === currentListId) || lists[0];

  const handleCreateNewList = () => {
    setIsDropdownOpen(false);
    const name = prompt('New List Name:', 'Trabajo');
    if (name) {
      addList(name);
    }
  };

  return (
    <div className="relative flex items-center justify-between py-4 px-1 z-30">
      {/* Left List Selector Pill */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-[56px] px-5 rounded-[28px] bg-[#1C1C1E] border border-white/10 flex items-center gap-2 text-white font-extrabold text-[17px] active:scale-95 transition-transform duration-150"
        >
          <span>{currentList.name}</span>
          <IconChevronDown className="w-4 h-4 text-[#8E8E93]" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute left-0 top-[64px] w-64 bg-[#1C1C1E] border border-white/10 rounded-2xl p-2 shadow-elevation z-50 animate-scale-up">
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
                      className="w-full h-11 px-3 rounded-xl flex items-center justify-between text-left font-extrabold text-[16px] text-white hover:bg-[#2A2A2C] transition-colors"
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
              <div className="my-2 border-t border-white/10" />

              {/* Actions row: Share / Edit / New */}
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openSheet('lists');
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#2A2A2C] text-[#8E8E93] hover:text-white transition-colors"
                >
                  <IconShare className="w-5 h-5 mb-1 text-white" />
                  <span className="text-xs font-bold">Share</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openSheet('lists');
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#2A2A2C] text-[#8E8E93] hover:text-white transition-colors"
                >
                  <IconPencil className="w-5 h-5 mb-1 text-white" />
                  <span className="text-xs font-bold">Edit</span>
                </button>

                <button
                  onClick={handleCreateNewList}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#2A2A2C] text-[#8E8E93] hover:text-white transition-colors"
                >
                  <IconPlus className="w-5 h-5 mb-1 text-white" />
                  <span className="text-xs font-bold">New</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Circular Buttons: Calendar & Settings */}
      <div className="flex items-center gap-3">
        <CircleButton
          onClick={toggleMonthStrip}
          ariaLabel="Toggle calendar"
          badge={
            isMonthStripVisible ? (
              <div className="w-5 h-5 rounded-full bg-[#E8505B] flex items-center justify-center border border-[#1C1C1E]">
                <IconClose className="w-3.5 h-3.5 text-white" />
              </div>
            ) : undefined
          }
        >
          <IconCalendar className="w-6 h-6 text-white" />
        </CircleButton>

        <CircleButton onClick={() => openSheet('settings')} ariaLabel="Open settings">
          <IconGear className="w-6 h-6 text-white" />
        </CircleButton>
      </div>
    </div>
  );
};
