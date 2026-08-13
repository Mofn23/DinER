import React, { useState, useEffect, useRef } from 'react';
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
    settings,
    aiMemory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    addTag,
    addAiRule,
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
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasManuallySelectedCategory, setHasManuallySelectedCategory] = useState(false);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSourceTag, setAiSourceTag] = useState<string | null>(null);

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

  // Refs for auto-focus and debounce
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (editingTx) {
      setDescription(editingTx.description);
      setAmount(editingTx.amount.toLocaleString('es-CO'));
      setDate(editingTx.date);
      setRecurrence(editingTx.recurrence as any);
      setTxType(editingTx.type);
      setSelectedCategoryId(editingTx.categoryId);
      setSelectedTags(editingTx.tags || []);
      setHasManuallySelectedCategory(true);
    } else {
      setDescription('');
      setAmount('');
      setDate(getLocalDateString(new Date()));
      setRecurrence('once');
      setTxType('expense');
      setSelectedCategoryId(categories[0]?.id || '');
      setSelectedTags([]);
      setHasManuallySelectedCategory(false);
      setAiSourceTag(null);
    }

    if (activeSheet === 'add_tx' || activeSheet === 'edit_tx') {
      const timer = setTimeout(() => {
        descriptionInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [editingTx, activeSheet, categories]);

  if (activeSheet !== 'add_tx' && activeSheet !== 'edit_tx') return null;

  // Amount input handler with thousand separator (e.g. 30.000 COP)
  const handleAmountChange = (val: string) => {
    const rawDigits = val.replace(/[^0-9]/g, '');
    if (!rawDigits) {
      setAmount('');
      return;
    }
    const formatted = parseInt(rawDigits, 10).toLocaleString('es-CO');
    setAmount(formatted);
  };

  // Smart Hybrid Gemini 2.0 Flash AI Auto-Categorization
  const handleDescriptionChange = (val: string) => {
    setDescription(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim() || hasManuallySelectedCategory) return;

    debounceTimerRef.current = setTimeout(async () => {
      setIsAiSuggesting(true);
      try {
        const res = await fetch('/api/ai-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: val,
            categories,
            aiMemory,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.categoryId && !hasManuallySelectedCategory) {
            setSelectedCategoryId(data.categoryId);
            if (data.type) setTxType(data.type);
            setAiSourceTag(data.source === 'memory' ? '🧠 AI Memory' : '✨ Gemini AI');
          }
        }
      } catch (err) {
        console.warn('AI parsing failed:', err);
      } finally {
        setIsAiSuggesting(false);
      }
    }, 280);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategoryId(catId);
    setHasManuallySelectedCategory(true);
    setAiSourceTag(null);

    const catObj = categories.find((c) => c.id === catId);
    if (catObj) {
      setTxType(catObj.type);
    }

    // Automatically save learned rule into AI Memory if description exists!
    if (description.trim()) {
      addAiRule(description.trim(), catId);
    }
  };

  const handleSave = () => {
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!numericAmount || !selectedCategoryId) return;

    const selectedCat = categories.find((c) => c.id === selectedCategoryId);

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
    setTxType(created.type);
    setHasManuallySelectedCategory(true);
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

  const rawNumericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
  const isSaveDisabled = !rawNumericAmount || rawNumericAmount <= 0 || !selectedCategoryId;
  const isExpense = txType === 'expense';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in overflow-hidden">
      {/* MonAI Bottom Sheet Card: Sits comfortably below Dynamic Island (h-[calc(100vh-68px)]), rounded top corners [36px] */}
      <div className="w-full max-w-[430px] mx-auto h-[calc(100vh-68px)] bg-[#131313] border-t border-white/10 rounded-t-[36px] px-5 pt-4 pb-[max(env(safe-area-inset-bottom,20px),20px)] flex flex-col justify-between shadow-2xl animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Top Header Row with Close Button ✕ in top right */}
        <div className="flex items-center justify-between pt-1 mb-1">
          {aiSourceTag ? (
            <div className="px-2.5 py-1 rounded-full bg-[#34C759]/20 border border-[#34C759]/30 text-[#34C759] font-extrabold text-[11px] flex items-center gap-1 animate-fade-in">
              <span>{aiSourceTag}</span>
            </div>
          ) : isAiSuggesting ? (
            <div className="px-2.5 py-1 rounded-full bg-[#2A2A2C] text-[#8E8E93] font-bold text-[11px] animate-pulse">
              <span>✨ Gemini Analizando...</span>
            </div>
          ) : <div />}

          <button
            onClick={closeSheet}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform shrink-0"
          >
            <IconClose className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Main Content Group */}
        <div className="flex flex-col gap-3 my-auto">
          {/* Small Delicate Date & Recurrence Pills (Sitting snugly right above Description) */}
          <div className="flex items-center gap-2 mb-1">
            {/* Date Chip */}
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div className="h-7 px-3 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-1 text-[#F5F5F7] font-bold text-xs">
                <span>Today</span>
                <IconChevronDown className="w-3 h-3 text-[#8E8E93]" />
              </div>
            </div>

            {/* Recurrence Chip */}
            <div className="relative">
              <button
                onClick={() => setIsRecurrenceOpen(!isRecurrenceOpen)}
                className="h-7 px-3 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-1 text-[#F5F5F7] font-bold text-xs"
              >
                <span className="capitalize">{recurrence}</span>
                <IconChevronDown className="w-3 h-3 text-[#8E8E93]" />
              </button>

              {isRecurrenceOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsRecurrenceOpen(false)}
                  />
                  <div className="absolute left-0 top-9 w-40 bg-[#1C1C1E] border border-white/10 rounded-2xl p-1 shadow-elevation z-50 animate-scale-up">
                    {recurrenceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setRecurrence(opt.value as any);
                          setIsRecurrenceOpen(false);
                        }}
                        className="w-full h-9 px-3 rounded-xl flex items-center justify-between text-left font-bold text-xs text-white hover:bg-[#2A2A2C]"
                      >
                        <span>{opt.label}</span>
                        {recurrence === opt.value && (
                          <IconCheck className="w-3.5 h-3.5 text-[#34C759]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description Input (MonAI 32px font-black with autoFocus) */}
          <div>
            <input
              ref={descriptionInputRef}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full bg-transparent text-[32px] font-black text-[#F5F5F7] placeholder-[#3A3A3C] outline-none border-none leading-tight tracking-tight"
            />
          </div>

          {/* MonAI Amount Row: [ - | + ] Toggle Pill + Formatted Amount Input */}
          <div className="flex items-center gap-3 my-1">
            {/* [ - | + ] Toggle Pill */}
            <div className="h-[34px] bg-[#1C1C1E] border border-white/10 rounded-full p-0.5 flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => setTxType('expense')}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  isExpense
                    ? 'bg-[#E8505B] text-white shadow-sm'
                    : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                −
              </button>
              <button
                onClick={() => setTxType('income')}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  !isExpense
                    ? 'bg-[#34C759] text-white shadow-sm'
                    : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                +
              </button>
            </div>

            {/* Colored Currency & Thousand-Separated Amount Input */}
            <div className="flex items-center gap-2 flex-1">
              <span
                className={`text-[32px] font-black tracking-tight ${
                  isExpense ? 'text-[#E8505B]' : 'text-[#34C759]'
                }`}
              >
                {settings.currency}
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`w-full bg-transparent text-[32px] font-black outline-none border-none tracking-tight ${
                  isExpense ? 'text-[#E8505B] placeholder-[#E8505B]/40' : 'text-[#34C759] placeholder-[#34C759]/40'
                }`}
              />
            </div>
          </div>

          {/* MonAI Full-Bleed Edge-to-Edge Categories Carousel */}
          <div className="flex flex-col gap-3">
            {isCreatingCategory ? (
              <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
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
              /* Full-bleed edge-to-edge scroll container */
              <div className="-mx-5 px-5 overflow-x-auto no-scrollbar py-1">
                <div className="flex items-center gap-2.5 min-w-max pr-5">
                  {/* (+) Create Category Circle Button */}
                  <button
                    onClick={() => setIsCreatingCategory(true)}
                    className="w-[42px] h-[42px] rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"
                  >
                    <IconPlus className="w-5 h-5 text-white" />
                  </button>

                  {/* Category Pills */}
                  {categories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`h-[42px] px-4 rounded-full border flex items-center gap-2 font-extrabold text-[14px] transition-all shrink-0 active:scale-95 ${
                          isSelected
                            ? 'bg-[#1C1C1E] border-white/30 text-white shadow-sm'
                            : 'bg-[#1C1C1E] border-white/5 text-[#8E8E93] hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MonAI Full-Bleed Edge-to-Edge Tag Section & Chips */}
            <div className="flex flex-col gap-2">
              {/* Tag Chips Row (Edge-to-edge scroll) */}
              <div className="-mx-5 px-5 overflow-x-auto no-scrollbar py-1">
                <div className="flex items-center gap-2 min-w-max pr-5">
                  {tags.map((t) => {
                    const isSelected = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTagSelection(t)}
                        className={`h-7 px-3 rounded-full text-xs font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-[#2A2A2C] border border-white/20 text-white'
                            : 'bg-[#1C1C1E] border border-white/5 text-[#8E8E93] hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expanded #Tag Input Panel */}
              {isTagModeActive && (
                <div className="p-3 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center gap-2 animate-fade-in">
                  <input
                    type="text"
                    placeholder="#Tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTagSubmit()}
                    className="flex-1 h-9 px-3 rounded-xl bg-[#242426] text-white font-bold text-xs outline-none placeholder-[#8E8E93]"
                  />
                  <button
                    onClick={handleAddTagSubmit}
                    className="w-9 h-9 rounded-xl bg-[#242426] flex items-center justify-center text-white"
                  >
                    <IconCheck className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MonAI Bottom Actions Row: [#] Square Button + [✓ Save] Button */}
        <div className="flex flex-col gap-3 pt-2 mt-auto">
          <div className="flex items-center gap-2.5">
            {/* [#] Tag Square Button */}
            <button
              onClick={() => setIsTagModeActive(!isTagModeActive)}
              className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-black text-lg border transition-colors ${
                isTagModeActive
                  ? 'bg-[#34C759] text-white border-transparent'
                  : 'bg-[#1C1C1E] text-white border-white/10'
              }`}
            >
              #
            </button>

            {/* [✓ Save] Button */}
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`flex-1 h-[52px] rounded-2xl flex items-center justify-center gap-2 text-white font-extrabold text-[16px] transition-all ${
                isSaveDisabled
                  ? 'bg-[#1C1C1E] text-[#3A3A3C] cursor-not-allowed'
                  : 'bg-[#2A2A2C] hover:bg-[#343437] active:scale-[0.98]'
              }`}
            >
              <IconCheck className="w-4 h-4 text-white" />
              <span>Save</span>
            </button>
          </div>

          {/* Delete Action in Edit Mode */}
          {isEditing && (
            <button
              onClick={handleDelete}
              className="w-full py-2 text-center text-[#E8505B] font-extrabold text-[14px] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
            >
              <IconTrash className="w-4 h-4 text-[#E8505B]" />
              <span>Delete Transaction</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
