import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { formatAmount } from '@/lib/utils';
import { IconClose, IconPlus, IconCheck } from '../common/Icons';

export const BudgetsSheet: React.FC = () => {
  const {
    activeSheet,
    closeSheet,
    categories,
    budgets,
    transactions,
    currentListId,
    setBudget,
  } = useAppStore();

  const [selectedCatId, setSelectedCatId] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (activeSheet !== 'budgets') return null;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSaveBudget = () => {
    const numeric = parseInt(amountInput, 10);
    if (selectedCatId && numeric > 0) {
      setBudget(selectedCatId, numeric);
      setIsFormOpen(false);
      setAmountInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <h1 className="text-[32px] font-black text-[#F5F5F7]">Budgets</h1>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Create budget action button */}
        {!isFormOpen ? (
          <button
            onClick={() => {
              setIsFormOpen(true);
              setSelectedCatId(expenseCategories[0]?.id || '');
            }}
            className="my-4 h-12 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-center gap-2 text-white font-extrabold text-[15px] active:scale-95 transition-transform"
          >
            <IconPlus className="w-5 h-5 text-[#34C759]" />
            <span>Set Category Budget</span>
          </button>
        ) : (
          <div className="my-4 p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
            <span className="text-[#8E8E93] text-xs font-bold uppercase">
              Set Monthly Budget Limit
            </span>

            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount (COP)"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-9 h-9 rounded-full bg-[#2A2A2C] flex items-center justify-center text-white"
              >
                <IconClose className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleSaveBudget}
                className="w-9 h-9 rounded-full bg-[#34C759] flex items-center justify-center text-white"
              >
                <IconCheck className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Budget list */}
        <div className="flex flex-col gap-4 my-2">
          {expenseCategories.map((cat) => {
            const budget = budgets.find(
              (b) => b.categoryId === cat.id && b.listId === currentListId
            );

            // Calculate current spent amount for category
            const spent = transactions
              .filter((t) => t.categoryId === cat.id && t.type === 'expense')
              .reduce((acc, t) => acc + t.amount, 0);

            const limit = budget?.monthlyAmount || 0;
            const progress = limit > 0 ? Math.min(1, spent / limit) : 0;
            const isExceeded = limit > 0 && spent > limit;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-white font-extrabold text-[16px]">{cat.name}</span>
                  </div>

                  <div className="text-right">
                    <div className={`font-extrabold text-sm ${isExceeded ? 'text-[#E8505B]' : 'text-white'}`}>
                      {formatAmount(spent).replace('-$', '$')}
                      <span className="text-[#8E8E93] font-normal">
                        {limit > 0 ? ` / ${formatAmount(limit).replace('$', '')}` : ' (No limit)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {limit > 0 && (
                  <div className="w-full h-2 rounded-full bg-[#2A2A2C] overflow-hidden mt-1">
                    <div
                      style={{
                        width: `${progress * 100}%`,
                        backgroundColor: isExceeded ? '#E8505B' : cat.tint || '#34C759',
                      }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
