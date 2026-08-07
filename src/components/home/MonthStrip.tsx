import React from 'react';
import { useAppStore } from '@/lib/store';
import { formatAmount } from '@/lib/utils';

export const MonthStrip: React.FC = () => {
  const {
    isMonthStripVisible,
    selectedMonthDate,
    setSelectedMonthDate,
    transactions,
    currentListId,
  } = useAppStore();

  if (!isMonthStripVisible) return null;

  // Generate last 12 months for navigation
  const months: Date[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-1 border-b border-white/10 bg-[#121214]">
      <div className="flex items-center gap-2 min-w-max">
        {months.map((m) => {
          const isSelected =
            m.getMonth() === selectedMonthDate.getMonth() &&
            m.getFullYear() === selectedMonthDate.getFullYear();

          // Calculate total expenses for this month
          const monthTx = transactions.filter((tx) => {
            if (tx.listId !== currentListId) return false;
            const d = new Date(tx.date + 'T00:00:00');
            return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
          });

          const totalExpense = monthTx
            .filter((t) => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

          const formattedTotal = formatAmount(totalExpense).replace('$', '');

          return (
            <button
              key={m.toISOString()}
              onClick={() => setSelectedMonthDate(m)}
              className={`px-4 py-2 rounded-full flex flex-col items-center justify-center transition-all duration-150 active:scale-95 ${
                isSelected ? 'bg-[#2A2A2C] border border-white/20' : 'bg-transparent hover:bg-[#1C1C1E]'
              }`}
            >
              <span className={`text-[15px] font-extrabold ${isSelected ? 'text-white' : 'text-[#8E8E93]'}`}>
                {monthNames[m.getMonth()]}
              </span>
              <span className="text-[13px] font-bold text-[#8E8E93]">
                COP {formattedTotal}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
