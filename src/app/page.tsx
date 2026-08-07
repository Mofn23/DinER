'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { filterTransactionsByPeriod, getCategoryTotals } from '@/lib/utils';
import { TopBar } from '@/components/home/TopBar';
import { MonthStrip } from '@/components/home/MonthStrip';
import { TotalBlock } from '@/components/home/TotalBlock';
import { BarChart } from '@/components/home/BarChart';
import { TransactionList } from '@/components/home/TransactionList';
import { FloatingControls } from '@/components/home/FloatingControls';

// Sheets
import { TransactionSheet } from '@/components/sheets/TransactionSheet';
import { SettingsSheet } from '@/components/sheets/SettingsSheet';
import { CategoriesSheet } from '@/components/sheets/CategoriesSheet';
import { TagsSheet } from '@/components/sheets/TagsSheet';
import { RecurrenceSheet } from '@/components/sheets/RecurrenceSheet';
import { BudgetsSheet } from '@/components/sheets/BudgetsSheet';
import { ListsSheet } from '@/components/sheets/ListsSheet';
import { VoiceOverlay } from '@/components/sheets/VoiceOverlay';

export default function HomePage() {
  const {
    currentListId,
    transactions,
    categories,
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

  // 4. Calculate Expense and Income totals for active dataset
  const totalExpense = searchFilteredTx
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = searchFilteredTx
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netTotal = totalIncome - totalExpense;

  // 5. Category Totals for Bar Chart based on active type
  const categoryTotals = getCategoryTotals(searchFilteredTx, categories, activeType);

  // 6. Filter transaction list for display
  const filteredListTx = searchFilteredTx.filter((t) => {
    if (!settings.showIncome && t.type === 'income') return false;
    if (selectedCategoryFilter) {
      return t.categoryId === selectedCategoryFilter;
    }
    // If search active with query, display all matching search results regardless of active type tab
    if (searchQuery.trim()) return true;
    return t.type === activeType;
  });

  return (
    <main className="w-full h-full min-h-screen bg-[#0B0B0D] text-[#F5F5F7] flex flex-col justify-between overflow-x-hidden relative">
      {/* Scrollable Main Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        {/* 1. Top Bar / Search Header */}
        <TopBar />

        {/* 2. Month Strip (visible when calendar is toggled) */}
        {!isSearchActive && <MonthStrip />}

        {/* 3. Total Block (Dynamically updates live for search query!) */}
        <TotalBlock
          netTotal={netTotal}
          totalExpense={totalExpense}
          totalIncome={totalIncome}
        />

        {/* 4. Category Bar Chart (Dynamically updates live for search query!) */}
        <BarChart
          categoryTotals={categoryTotals}
          selectedCategoryFilter={selectedCategoryFilter}
          onSelectCategory={setSelectedCategoryFilter}
        />

        {/* 5. Grouped Transaction List */}
        <TransactionList
          transactions={filteredListTx}
          categories={categories}
          onSelectTransaction={(txId) => openSheet('edit_tx', txId)}
        />
      </div>

      {/* 6. Floating Bottom Controls */}
      <FloatingControls />

      {/* 7. Sheet Modals & Overlays */}
      <TransactionSheet />
      <SettingsSheet />
      <CategoriesSheet />
      <TagsSheet />
      <RecurrenceSheet />
      <BudgetsSheet />
      <ListsSheet />
      <VoiceOverlay />
    </main>
  );
}
