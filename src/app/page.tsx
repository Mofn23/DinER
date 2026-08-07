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
import { SearchOverlay } from '@/components/sheets/SearchOverlay';
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

  // 3. Calculate Expense and Income totals for active period
  const totalExpense = periodTx
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = periodTx
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netTotal = totalIncome - totalExpense;

  // 4. Calculate Category Totals for Bar Chart based on active type (expense or income)
  const categoryTotals = getCategoryTotals(periodTx, categories, activeType);

  // 5. Filter transaction list by active type and category filter if applied
  const filteredListTx = periodTx.filter((t) => {
    // If showIncome is false, hide income transactions
    if (!settings.showIncome && t.type === 'income') return false;

    if (selectedCategoryFilter) {
      return t.categoryId === selectedCategoryFilter;
    }
    return t.type === activeType;
  });

  return (
    <main className="w-full h-full min-h-screen bg-[#0B0B0D] text-[#F5F5F7] flex flex-col justify-between overflow-x-hidden relative">
      {/* Scrollable Main Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        {/* 1. Top Bar */}
        <TopBar />

        {/* 2. Month Strip (visible when calendar is toggled) */}
        <MonthStrip />

        {/* 3. Total Block */}
        <TotalBlock
          netTotal={netTotal}
          totalExpense={totalExpense}
          totalIncome={totalIncome}
        />

        {/* 4. Category Bar Chart */}
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
      <SearchOverlay />
      <VoiceOverlay />
    </main>
  );
}
