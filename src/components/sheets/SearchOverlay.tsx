import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { TransactionList } from '../home/TransactionList';
import { IconClose } from '../common/Icons';

export const SearchOverlay: React.FC = () => {
  const { activeSheet, closeSheet, transactions, categories, openSheet } = useAppStore();
  const [query, setQuery] = useState('');

  if (activeSheet !== 'search') return null;

  const filtered = transactions.filter((tx) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();

    const category = categories.find((c) => c.id === tx.categoryId);
    const categoryMatch = category?.name.toLowerCase().includes(q);
    const descMatch = tx.description.toLowerCase().includes(q);
    const tagMatch = (tx.tags || []).some((t) => t.toLowerCase().includes(q));
    const amountMatch = tx.amount.toString().includes(q);

    return categoryMatch || descMatch || tagMatch || amountMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <input
            type="text"
            placeholder="Search transactions..."
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[28px] font-black text-[#F5F5F7] placeholder-[#3A3A3C] outline-none"
          />
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 shrink-0 ml-2"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Results */}
        <div className="my-4">
          <TransactionList
            transactions={filtered}
            categories={categories}
            onSelectTransaction={(id) => openSheet('edit_tx', id)}
          />
        </div>
      </div>
    </div>
  );
};
