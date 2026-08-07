import React from 'react';
import { SegmentedControl } from '../common/BaseUI';
import { useAppStore } from '@/lib/store';
import { formatAmount } from '@/lib/utils';

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

  // Format large display total
  const formattedNetNumber = formatAmount(netTotal)
    .replace('-$', '')
    .replace('$', '');

  return (
    <div className="flex flex-col items-center my-4 px-2">
      {/* "Total" Label */}
      <span className="text-[15px] font-bold text-[#8E8E93] tracking-wide mb-1">
        Total
      </span>

      {/* Main Giant Total Row */}
      <div className="flex items-center gap-3 justify-center mb-5">
        {/* Sign Badge */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-lg ${
            isPositive ? 'bg-[#34C759]' : 'bg-[#E8505B]'
          }`}
        >
          {isPositive ? '+' : '−'}
        </div>

        {/* Giant Number */}
        <span className="text-[64px] leading-none font-black text-[#F5F5F7] tracking-tight">
          {formattedNetNumber}
        </span>

        {/* Currency Suffix */}
        <span className="text-[24px] font-bold text-[#8E8E93] self-end mb-2">
          {settings.currency}
        </span>
      </div>

      {/* Segmented Control: Expense vs Income */}
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
