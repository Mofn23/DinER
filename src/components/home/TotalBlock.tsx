import React from 'react';
import { SegmentedControl } from '../common/BaseUI';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { useAppStore } from '@/lib/store';

interface TotalBlockProps {
  netTotal: number;
  totalExpense: number;
  totalIncome: number;
}

export const TotalBlock: React.FC<TotalBlockProps> = ({
  netTotal,
  totalExpense,
  totalIncome,
}) => {
  const { activeType, setActiveType, settings } = useAppStore();
  const isPositive = netTotal >= 0;

  return (
    <div className="flex flex-col items-center my-4 px-2 animate-cross-dissolve">
      {/* "Total" Label */}
      <span className="text-[13px] font-extrabold text-[#8E8E93] tracking-wider uppercase mb-1">
        Total
      </span>

      {/* Giant MonAI Balance Display (Cloned 1:1 scale & font size) */}
      <div className="flex items-center gap-2 justify-center mb-5">
        {/* Sign Badge */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-base transition-colors duration-300 ${
            isPositive ? 'bg-[#34C759]' : 'bg-[#E8505B]'
          }`}
        >
          {isPositive ? '+' : '−'}
        </div>

        {/* Giant Ticking Balance Number */}
        <AnimatedNumber
          value={Math.abs(netTotal)}
          duration={380}
          formatter={(val) => val.toLocaleString('en-US')}
          className="text-[54px] sm:text-[60px] leading-none font-black text-[#F5F5F7] tracking-tight"
        />

        {/* Currency Suffix */}
        <span className="text-[20px] font-bold text-[#8E8E93] self-end mb-1">
          {settings.currency}
        </span>
      </div>

      {/* Segmented Control Pill: Gastos vs Ingresos */}
      <div className="w-full max-w-sm">
        <SegmentedControl
          expenseAmount={totalExpense}
          incomeAmount={totalIncome}
          activeType={activeType}
          onChange={setActiveType}
          showIncome={settings.showIncome}
        />
      </div>
    </div>
  );
};
