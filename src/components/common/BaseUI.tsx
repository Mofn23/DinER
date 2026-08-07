import React from 'react';
import { IconRecurrence, IconMinus, IconPlus } from './Icons';
import { formatAmount } from '@/lib/utils';

export const CircleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  size?: number; // default 56
  className?: string;
  badge?: React.ReactNode;
  ariaLabel?: string;
}> = ({ children, onClick, size = 56, className = '', badge, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative flex items-center justify-center rounded-full bg-[#1C1C1E] border border-white/10 text-white active:scale-95 transition-transform duration-150 shrink-0 ${className}`}
    >
      {children}
      {badge && <div className="absolute -top-0.5 -right-0.5">{badge}</div>}
    </button>
  );
};

export const CategoryAvatar: React.FC<{
  emoji: string;
  tint?: string;
  isRecurring?: boolean;
  size?: number;
}> = ({ emoji, tint = '#8A6E4B', isRecurring = false, size = 64 }) => {
  return (
    <div className="relative shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{ backgroundColor: tint }}
      >
        <span className="text-[28px] leading-none select-none">{emoji}</span>
      </div>
      {isRecurring && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1C1C1E] border border-white/20 flex items-center justify-center text-white shadow-md">
          <IconRecurrence className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};

export const AmountPill: React.FC<{
  amount: number;
  type: 'expense' | 'income';
  currency?: string;
}> = ({ amount, type, currency = 'COP' }) => {
  const isIncome = type === 'income';
  const formatted = formatAmount(amount, currency);

  return (
    <div
      className={`px-3 py-1.5 rounded-full flex items-center gap-1 font-extrabold text-[17px] tracking-tight shrink-0 ${
        isIncome ? 'bg-[#E9E9EC] text-[#1C1C1E]' : 'bg-[#2A2A2C] text-[#F5F5F7]'
      }`}
    >
      <span className={`flex items-center justify-center w-4 h-4 rounded-full text-xs ${isIncome ? 'bg-[#1C1C1E] text-white' : 'bg-[#3A3A3C] text-white'}`}>
        {isIncome ? '+' : '−'}
      </span>
      <span>{formatted}</span>
    </div>
  );
};

export const DayHeader: React.FC<{
  dateLabel: string;
  netAmount: number;
  currency?: string;
}> = ({ dateLabel, netAmount, currency = 'COP' }) => {
  const formattedNet = formatAmount(netAmount, currency);
  return (
    <div className="flex items-center justify-between my-3 px-1">
      {/* Left Date Pill */}
      <div className="h-7 px-3.5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-[#8E8E93] text-[14px] font-bold">
        {dateLabel}
      </div>
      {/* Right Net Pill */}
      <div className="h-7 px-3.5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-[#8E8E93] text-[14px] font-extrabold">
        {formattedNet}
      </div>
    </div>
  );
};

export const SegmentedControl: React.FC<{
  expenseAmount: number;
  incomeAmount: number;
  activeType: 'expense' | 'income';
  onChange: (type: 'expense' | 'income') => void;
  showIncome?: boolean;
}> = ({ expenseAmount, incomeAmount, activeType, onChange, showIncome = true }) => {
  return (
    <div className="w-full bg-[#1C1C1E] border border-white/10 p-1 rounded-full flex items-center gap-1">
      <button
        onClick={() => onChange('expense')}
        className={`flex-1 py-2.5 rounded-full text-center font-extrabold text-[15px] transition-all duration-150 flex items-center justify-center gap-1.5 ${
          activeType === 'expense'
            ? 'bg-[#2A2A2C] text-[#F5F5F7] shadow-sm'
            : 'text-[#8E8E93] hover:text-white'
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-[#3A3A3C] text-white text-xs flex items-center justify-center font-black">
          −
        </span>
        <span>{formatAmount(expenseAmount).replace('-$', '').replace('$', '')}</span>
      </button>

      {showIncome && (
        <button
          onClick={() => onChange('income')}
          className={`flex-1 py-2.5 rounded-full text-center font-extrabold text-[15px] transition-all duration-150 flex items-center justify-center gap-1.5 ${
            activeType === 'income'
              ? 'bg-[#2A2A2C] text-[#F5F5F7] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-[#34C759] text-white text-xs flex items-center justify-center font-black">
            +
          </span>
          <span>{formatAmount(incomeAmount).replace('-$', '').replace('$', '')}</span>
        </button>
      )}
    </div>
  );
};
