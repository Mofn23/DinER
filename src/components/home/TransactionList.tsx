import React from 'react';
import { TransactionData, CategoryData } from '@/lib/initialData';
import { DayHeader, CategoryAvatar, AmountPill } from '../common/BaseUI';
import { formatDateHeader } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

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
      <div className="flex flex-col items-center justify-center py-16 text-center">
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
    <div className="flex flex-col gap-4 pb-28">
      {sortedDates.map((dateStr) => {
        const dayTxs = grouped.get(dateStr) || [];
        const dateLabel = formatDateHeader(dateStr);

        // Calculate day net total
        const dayNet = dayTxs.reduce((acc, tx) => {
          return tx.type === 'expense' ? acc - tx.amount : acc + tx.amount;
        }, 0);

        return (
          <div key={dateStr} className="flex flex-col">
            {/* Day Header */}
            <DayHeader dateLabel={dateLabel} netAmount={dayNet} />

            {/* Transaction Rows */}
            <div className="flex flex-col gap-3">
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
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 active:scale-[0.98] transition-transform duration-150 text-left"
                  >
                    {/* Left Avatar */}
                    <CategoryAvatar
                      emoji={category.emoji}
                      tint={category.tint}
                      isRecurring={isRecurring}
                      size={64}
                    />

                    {/* Middle Info Column */}
                    <div className="flex-1 ml-3.5 mr-2 overflow-hidden flex flex-col gap-0.5">
                      <span className="text-[#8E8E93] text-[14px] font-bold truncate">
                        {category.name}
                      </span>
                      <span className="text-[#F5F5F7] text-[17px] font-extrabold truncate">
                        {tx.description}
                      </span>
                      {tx.tags && tx.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar">
                          {tx.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-[#1E1E20] text-[#8E8E93] text-[13px] font-bold shrink-0"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Amount Pill */}
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
