import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getLocalDateString } from '@/lib/utils';
import {
  IconClose,
  IconChevronDown,
  IconPlus,
  IconCheck,
  IconTrash,
} from '../common/Icons';

export const TransactionSheet: React.FC = () => {
  const {
    activeSheet,
    closeSheet,
    editingTransactionId,
    transactions,
    categories,
    tags,
    currentListId,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    addTag,
  } = useAppStore();

  const isEditing = activeSheet === 'edit_tx' && Boolean(editingTransactionId);
  const editingTx = isEditing
    ? transactions.find((t) => t.id === editingTransactionId)
    : null;

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getLocalDateString(new Date()));
  const [recurrence, setRecurrence] = useState<
    'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'yearly'
  >('once');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Inline Category Creator
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📦');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');

  // Tag Mode
  const [isTagModeActive, setIsTagModeActive] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Dropdown states
  const [isRecurrenceOpen, setIsRecurrenceOpen] = useState(false);

  useEffect(() => {
    if (editingTx) {
      setDescription(editingTx.description);
      setAmount(editingTx.amount.toString());
      setDate(editingTx.date);
      setRecurrence(editingTx.recurrence as any);
      setSelectedCategoryId(editingTx.categoryId);
      setSelectedTags(editingTx.tags || []);
    } else {
      setDescription('');
      setAmount('');
      setDate(getLocalDateString(new Date()));
      setRecurrence('once');
      setSelectedCategoryId(categories[0]?.id || '');
      setSelectedTags([]);
    }
  }, [editingTx, activeSheet, categories]);

  if (activeSheet !== 'add_tx' && activeSheet !== 'edit_tx') return null;

  const handleSave = () => {
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!numericAmount || !selectedCategoryId) return;

    const selectedCat = categories.find((c) => c.id === selectedCategoryId);
    const txType = selectedCat?.type || 'expense';

    if (isEditing && editingTransactionId) {
      updateTransaction(editingTransactionId, {
        description: description || selectedCat?.name || 'Transaction',
        amount: numericAmount,
        type: txType,
        categoryId: selectedCategoryId,
        tags: selectedTags,
        date,
        recurrence,
      });
    } else {
      addTransaction({
        listId: currentListId,
        description: description || selectedCat?.name || 'Transaction',
        amount: numericAmount,
        type: txType,
        categoryId: selectedCategoryId,
        tags: selectedTags,
        date,
        recurrence,
      });
    }
    closeSheet();
  };

  const handleDelete = () => {
    if (editingTransactionId) {
      deleteTransaction(editingTransactionId);
      closeSheet();
    }
  };

  const handleCreateCategorySubmit = () => {
    if (!newCatName.trim()) return;
    const created = addCategory({
      name: newCatName.trim(),
      emoji: newCatEmoji,
      tint: newCatType === 'income' ? '#34C759' : '#8A6E4B',
      type: newCatType,
    });
    setSelectedCategoryId(created.id);
    setNewCatName('');
    setIsCreatingCategory(false);
  };

  const handleAddTagSubmit = () => {
    if (!newTagInput.trim()) return;
    const formatted = newTagInput.startsWith('#')
      ? newTagInput.toLowerCase()
      : `#${newTagInput.toLowerCase()}`;
    addTag(formatted);
    if (!selectedTags.includes(formatted)) {
      setSelectedTags([...selectedTags, formatted]);
    }
    setNewTagInput('');
  };

  const toggleTagSelection = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((item) => item !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  const recurrenceOptions = [
    { label: 'Once', value: 'once' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-weekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Bi-monthly', value: 'bimonthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const isSaveDisabled = !amount || parseInt(amount, 10) <= 0 || !selectedCategoryId;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col justify-between p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header Close Button */}
        <div className="flex items-center justify-between pt-2 mb-4">
          {/* Fila de chips: Date & Recurrence */}
          <div className="flex items-center gap-2">
            {/* Date Chip */}
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div className="h-9 px-3.5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-1.5 text-white font-extrabold text-[14px]">
                <span>Today</span>
                <IconChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
              </div>
            </div>

            {/* Recurrence Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRecurrenceOpen(!isRecurrenceOpen)}
                className="h-9 px-3.5 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-1.5 text-white font-extrabold text-[14px]"
              >
                <span className="capitalize">{recurrence}</span>
                <IconChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
              </button>

              {isRecurrenceOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsRecurrenceOpen(false)}
                  />
                  <div className="absolute left-0 top-11 w-44 bg-[#1C1C1E] border border-white/10 rounded-2xl p-1 shadow-elevation z-50 animate-scale-up">
                    {recurrenceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setRecurrence(opt.value as any);
                          setIsRecurrenceOpen(false);
                        }}
                        className="w-full h-10 px-3 rounded-xl flex items-center justify-between text-left font-bold text-[14px] text-white hover:bg-[#2A2A2C]"
                      >
                        <span>{opt.label}</span>
                        {recurrence === opt.value && (
                          <IconCheck className="w-4 h-4 text-[#34C759]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Close Circular Button */}
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Inputs block: Description & Amount */}
        <div className="flex flex-col gap-2 my-auto">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent text-[38px] font-black text-[#F5F5F7] placeholder-[#3A3A3C] outline-none border-none leading-tight"
          />

          <input
            type="number"
            inputMode="numeric"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-[40px] font-black text-[#F5F5F7] placeholder-[#3A3A3C] outline-none border-none leading-tight"
          />
        </div>

        {/* Category Horizontal Selector + Tag Mode */}
        <div className="flex flex-col gap-4 my-4">
          {/* Inline Category Creator Form */}
          {isCreatingCategory ? (
            <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  className="w-12 h-10 rounded-xl bg-[#2A2A2C] text-center text-xl text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewCatType('expense')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black ${
                      newCatType === 'expense'
                        ? 'bg-[#E8505B] text-white'
                        : 'bg-[#2A2A2C] text-[#8E8E93]'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setNewCatType('income')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black ${
                      newCatType === 'income'
                        ? 'bg-[#34C759] text-white'
                        : 'bg-[#2A2A2C] text-[#8E8E93]'
                    }`}
                  >
                    Income
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreatingCategory(false)}
                    className="w-8 h-8 rounded-full bg-[#2A2A2C] text-white flex items-center justify-center"
                  >
                    <IconClose className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={handleCreateCategorySubmit}
                    className="w-8 h-8 rounded-full bg-[#34C759] text-white flex items-center justify-center"
                  >
                    <IconCheck className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Horizontal Scrollable Categories */
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setIsCreatingCategory(true)}
                  className="w-12 h-12 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white shrink-0 active:scale-95"
                >
                  <IconPlus className="w-5 h-5 text-white" />
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`h-12 px-4 rounded-[24px] border flex items-center gap-2 font-extrabold text-[15px] transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#2A2A2C] border-white/20 text-white'
                          : 'bg-[#1C1C1E] border-white/5 text-[#8E8E93]'
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tag Mode Section */}
          {isTagModeActive && (
            <div className="p-3 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="#Tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTagSubmit()}
                  className="flex-1 h-10 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
                />
                <button
                  onClick={handleAddTagSubmit}
                  className="w-10 h-10 rounded-xl bg-[#2A2A2C] flex items-center justify-center text-white"
                >
                  <IconCheck className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar">
                {tags.map((t) => {
                  const isSelected = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTagSelection(t)}
                      className={`px-3 py-1 rounded-full text-[13px] font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#34C759] text-white'
                          : 'bg-[#1E1E20] text-[#8E8E93]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-3">
            {/* Tag Toggle Button */}
            <button
              onClick={() => setIsTagModeActive(!isTagModeActive)}
              className={`w-14 h-[56px] rounded-2xl flex items-center justify-center font-black text-xl border transition-colors ${
                isTagModeActive
                  ? 'bg-[#34C759] text-white border-transparent'
                  : 'bg-[#1C1C1E] text-white border-white/10'
              }`}
            >
              #
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`flex-1 h-[56px] rounded-2xl flex items-center justify-center gap-2 text-white font-extrabold text-[17px] transition-all ${
                isSaveDisabled
                  ? 'bg-[#1C1C1E] text-[#3A3A3C] cursor-not-allowed'
                  : 'bg-[#2A2A2C] hover:bg-[#343437] active:scale-[0.98]'
              }`}
            >
              <IconCheck className="w-5 h-5 text-white" />
              <span>Save</span>
            </button>
          </div>

          {/* Delete Action in Edit Mode */}
          {isEditing && (
            <button
              onClick={handleDelete}
              className="w-full py-3 text-center text-[#E8505B] font-extrabold text-[16px] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
            >
              <IconTrash className="w-5 h-5 text-[#E8505B]" />
              <span>Delete Transaction</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
