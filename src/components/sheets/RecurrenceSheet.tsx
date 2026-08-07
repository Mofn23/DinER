import React from 'react';
import { useAppStore } from '@/lib/store';
import { CategoryAvatar, AmountPill } from '../common/BaseUI';
import { IconClose } from '../common/Icons';

export const RecurrenceSheet: React.FC = () => {
  const { activeSheet, closeSheet, transactions, categories, openSheet } = useAppStore();

  if (activeSheet !== 'recurrence') return null;

  const recurringTxs = transactions.filter((t) => t.recurrence !== 'once');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <h1 className="text-[32px] font-black text-[#F5F5F7]">Recurrence list</h1>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Recurring transactions list */}
        <div className="flex flex-col gap-3 my-4">
          {recurringTxs.length === 0 ? (
            <div className="text-center py-12 text-[#8E8E93] font-bold">
              No recurring transactions set up yet
            </div>
          ) : (
            recurringTxs.map((tx) => {
              const category = categories.find((c) => c.id === tx.categoryId) || {
                name: 'General',
                emoji: '📦',
                tint: '#8A6E4B',
              };

              return (
                <button
                  key={tx.id}
                  onClick={() => openSheet('edit_tx', tx.id)}
                  className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
                >
                  <CategoryAvatar
                    emoji={category.emoji}
                    tint={category.tint}
                    isRecurring={true}
                    size={56}
                  />

                  <div className="flex-1 ml-3 mr-2">
                    <div className="text-white font-extrabold text-[16px]">
                      {tx.description}
                    </div>
                    <div className="text-[#8E8E93] text-[13px] font-bold capitalize">
                      {category.name} · {tx.recurrence}
                    </div>
                  </div>

                  <AmountPill amount={tx.amount} type={tx.type} />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
