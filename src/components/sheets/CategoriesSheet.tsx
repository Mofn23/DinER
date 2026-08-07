import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconPlus, IconCheck, IconTrash } from '../common/Icons';

export const CategoriesSheet: React.FC = () => {
  const { activeSheet, closeSheet, categories, addCategory, deleteCategory } = useAppStore();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  if (activeSheet !== 'categories') return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    addCategory({
      name: name.trim(),
      emoji,
      tint: type === 'income' ? '#34C759' : '#8A6E4B',
      type,
    });
    setName('');
  };

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <h1 className="text-[32px] font-black text-[#F5F5F7]">Edit Categories</h1>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Inline Create Category */}
        <div className="my-4 p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
          <span className="text-[#8E8E93] text-xs font-bold uppercase">Add New Category</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-12 h-10 rounded-xl bg-[#2A2A2C] text-center text-xl text-white outline-none"
            />
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 h-10 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setType('expense')}
                className={`px-3 py-1.5 rounded-full text-xs font-black ${
                  type === 'expense' ? 'bg-[#E8505B] text-white' : 'bg-[#2A2A2C] text-[#8E8E93]'
                }`}
              >
                Expense
              </button>
              <button
                onClick={() => setType('income')}
                className={`px-3 py-1.5 rounded-full text-xs font-black ${
                  type === 'income' ? 'bg-[#34C759] text-white' : 'bg-[#2A2A2C] text-[#8E8E93]'
                }`}
              >
                Income
              </button>
            </div>

            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded-xl bg-[#34C759] text-white font-extrabold text-sm flex items-center gap-1"
            >
              <IconCheck className="w-4 h-4 text-white" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2 my-2 pb-12">
          {sortedCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-[22%] flex items-center justify-center text-xl"
                  style={{ backgroundColor: cat.tint }}
                >
                  {cat.emoji}
                </div>
                <div>
                  <div className="text-white font-extrabold text-[17px]">{cat.name}</div>
                  {cat.type === 'income' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#34C759]/20 text-[#34C759] text-xs font-bold">
                      Income
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteCategory(cat.id)}
                className="w-9 h-9 rounded-full bg-[#2A2A2C] flex items-center justify-center text-[#E8505B] active:scale-95"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
