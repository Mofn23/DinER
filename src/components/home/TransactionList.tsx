import React from 'react';
import { TransactionData, CategoryData } from '@/lib/initialData';
import { DayHeader, CategoryAvatar, AmountPill } from '../common/BaseUI';
import { formatDateHeader } from '@/lib/utils';

interface TransactionListProps {
  transactions: TransactionData[];
  categories: CategoryData[];
  onSelectTransaction: (txId: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onSelectTransaction,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-cross-dissolve">
        <span className="text-5xl mb-3">💸</span>
        <h3 className="text-white font-extrabold text-[17px] mb-1">
          No transactions yet
        </h3>
        <p className="text-[#8E8E93] text-[14px]">
          Tap + to add your first expense
        </p>
      </div>
    );
  }

  // Group transactions by date string YYYY-MM-DD
  const grouped = new Map<string, TransactionData[]>();
  transactions.forEach((tx) => {
    const list = grouped.get(tx.date) || [];
    list.push(tx);
    grouped.set(tx.date, list);
  });

  // Sort dates descending
  const sortedDates = Array.from(grouped.keys()).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="flex flex-col gap-5 pb-28 animate-cross-dissolve">
      {sortedDates.map((dateStr) => {
        const dayTxs = grouped.get(dateStr) || [];
        const dateLabel = formatDateHeader(dateStr);

        // Calculate day net total
        const dayNet = dayTxs.reduce((acc, tx) => {
          return tx.type === 'expense' ? acc - tx.amount : acc + tx.amount;
        }, 0);

        return (
          <div key={dateStr} className="flex flex-col gap-2">
            {/* Day Header Pill */}
            <DayHeader dateLabel={dateLabel} netAmount={dayNet} />

            {/* MonAI Pill Transaction Cards */}
            <div className="flex flex-col gap-2.5">
              {dayTxs.map((tx) => {
                const category = categories.find((c) => c.id === tx.categoryId) || {
                  name: 'General',
                  emoji: '📦',
                  tint: '#8A6E4B',
                };
                const isRecurring = tx.recurrence !== 'once';

                return (
                  <button
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx.id)}
                    className="w-full flex items-center justify-between p-3.5 rounded-[22px] bg-[#1C1C1E] border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200 text-left shadow-sm"
                  >
                    {/* Left Category Emoji Avatar */}
                    <CategoryAvatar
                      emoji={category.emoji}
                      tint={category.tint}
                      isRecurring={isRecurring}
                      size={52}
                    />

                    {/* Middle Title & Details Column (MonAI delicate typography) */}
                    <div className="flex-1 ml-3.5 mr-2 overflow-hidden flex flex-col justify-center gap-0.5">
                      <span className="text-[#8E8E93] text-[13px] font-bold tracking-tight truncate">
                        {category.name}
                      </span>
                      <span className="text-[#F5F5F7] text-[16px] font-extrabold tracking-tight truncate leading-tight">
                        {tx.description}
                      </span>
                      {tx.tags && tx.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 overflow-x-auto no-scrollbar">
                          {tx.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-[#2A2A2C] text-[#8E8E93] text-[11px] font-extrabold tracking-tight shrink-0"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right MonAI Amount Pill */}
                    <AmountPill amount={tx.amount} type={tx.type} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
