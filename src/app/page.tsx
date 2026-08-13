'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { filterTransactionsByPeriod, getCategoryTotals } from '@/lib/utils';
import { checkAndNotifyUpcomingSubscriptions } from '@/lib/notifications';
import { TopBar } from '@/components/home/TopBar';
import { MonthStrip } from '@/components/home/MonthStrip';
import { TotalBlock } from '@/components/home/TotalBlock';
import { BarChart } from '@/components/home/BarChart';
import { TransactionList } from '@/components/home/TransactionList';
import { FloatingControls } from '@/components/home/FloatingControls';
import { SubscriptionsHubView } from '@/components/subscriptions/SubscriptionsHubView';

// Sheets
import { TransactionSheet } from '@/components/sheets/TransactionSheet';
import { SettingsSheet } from '@/components/sheets/SettingsSheet';
import { CategoriesSheet } from '@/components/sheets/CategoriesSheet';
import { TagsSheet } from '@/components/sheets/TagsSheet';
import { RecurrenceSheet } from '@/components/sheets/RecurrenceSheet';
import { BudgetsSheet } from '@/components/sheets/BudgetsSheet';
import { ListsSheet } from '@/components/sheets/ListsSheet';
import { SubscriptionsSheet } from '@/components/sheets/SubscriptionsSheet';
import { VoiceOverlay } from '@/components/sheets/VoiceOverlay';

export default function HomePage() {
  const {
    currentListId,
    transactions,
    categories,
    subscriptions,
    activeType,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedPeriod,
    selectedMonthDate,
    settings,
    openSheet,
    isSearchActive,
    searchQuery,
  } = useAppStore();

  const [currentView, setCurrentView] = useState<'finance' | 'subscriptions'>('finance');
  const [scrollOffset, setScrollOffset] = useState(0);

  // Register Service Worker & check subscription notifications on startup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('ServiceWorker registered successfully:', reg.scope))
        .catch((err) => console.warn('ServiceWorker registration failed:', err));
    }
    checkAndNotifyUpcomingSubscriptions(subscriptions);
  }, [subscriptions]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollOffset(e.currentTarget.scrollTop);
  };

  // 1. Filter transactions by current list
  const listTx = transactions.filter((t) => t.listId === currentListId);

  // 2. Filter transactions by period & rollover setting
  const periodTx = filterTransactionsByPeriod(
    listTx,
    selectedPeriod,
    selectedMonthDate,
    settings.rollover
  );

  // 3. Live search filter (matches description, tag, category name, amount)
  const searchFilteredTx = periodTx.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const category = categories.find((c) => c.id === t.categoryId);
    const categoryMatch = category?.name.toLowerCase().includes(q);
    const descMatch = t.description.toLowerCase().includes(q);
    const tagMatch = (t.tags || []).some((tag) => tag.toLowerCase().includes(q));
    const amountMatch = t.amount.toString().includes(q);
    return categoryMatch || descMatch || tagMatch || amountMatch;
  });

  // 4. Category Totals for Bar Chart (calculated from searchFilteredTx before category selection)
  const categoryTotals = getCategoryTotals(searchFilteredTx, categories, activeType);

  // 5. Active dataset: if a category filter is selected, filter by that category
  const activeDataset = selectedCategoryFilter
    ? searchFilteredTx.filter((t) => t.categoryId === selectedCategoryFilter)
    : searchFilteredTx;

  // 6. Calculate Expense and Income totals for active dataset (reflects category filter)
  const totalExpense = activeDataset
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = activeDataset
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // When a specific category is selected, display its specific net/total amount in TotalBlock
  const selectedCategoryObj = selectedCategoryFilter
    ? categories.find((c) => c.id === selectedCategoryFilter)
    : null;

  const netTotal = selectedCategoryObj
    ? (selectedCategoryObj.type === 'income' ? totalIncome : -totalExpense)
    : totalIncome - totalExpense;

  // 7. Filter transaction list for display
  const filteredListTx = activeDataset.filter((t) => {
    if (!settings.showIncome && t.type === 'income') return false;
    if (selectedCategoryFilter || searchQuery.trim()) return true;
    return t.type === activeType;
  });

  return (
    <main className="w-full h-full min-h-screen bg-[#131313] text-[#F5F5F7] flex flex-col justify-between overflow-x-hidden relative">
      {/* Scrollable Main Content Container */}
      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32 transition-colors duration-300"
      >
        {/* Top Header & Search */}
        <TopBar />

        {/* View Segment Switcher: Gastos & Finanzas vs Suscripciones Hub */}
        {!isSearchActive && (
          <div className="flex items-center justify-between p-1 rounded-2xl bg-[#1C1C1E] border border-white/10 mb-4 animate-fade-in">
            <button
              onClick={() => setCurrentView('finance')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                currentView === 'finance'
                  ? 'bg-[#34C759] text-white shadow-sm'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Gastos & Finanzas 💳
            </button>
            <button
              onClick={() => setCurrentView('subscriptions')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                currentView === 'subscriptions'
                  ? 'bg-[#34C759] text-white shadow-sm'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              Suscripciones 📺
            </button>
          </div>
        )}

        {currentView === 'finance' ? (
          <div className="animate-cross-dissolve">
            {/* Month Strip (visible when calendar is toggled) */}
            {!isSearchActive && <MonthStrip />}

            {/* Total Block */}
            <TotalBlock
              netTotal={netTotal}
              totalExpense={totalExpense}
              totalIncome={totalIncome}
            />

            {/* Category Bar Chart (Hides when search is active & shrinks from top down) */}
            <BarChart
              categoryTotals={categoryTotals}
              selectedCategoryFilter={selectedCategoryFilter}
              onSelectCategory={setSelectedCategoryFilter}
              scrollOffset={scrollOffset}
              isSearchActive={isSearchActive}
            />

            {/* Grouped Transaction List */}
            <TransactionList
              transactions={filteredListTx}
              categories={categories}
              onSelectTransaction={(txId) => openSheet('edit_tx', txId)}
            />
          </div>
        ) : (
          <div className="animate-cross-dissolve">
            <SubscriptionsHubView />
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <FloatingControls />

      {/* Sheet Modals & Overlays */}
      <TransactionSheet />
      <SettingsSheet />
      <CategoriesSheet />
      <TagsSheet />
      <RecurrenceSheet />
      <BudgetsSheet />
      <ListsSheet />
      <SubscriptionsSheet />
      <VoiceOverlay />
    </main>
  );
}
