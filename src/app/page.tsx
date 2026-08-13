'use client';

import React, { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import { useAppStore } from '@/lib/store';
import { filterTransactionsByPeriod, getCategoryTotals } from '@/lib/utils';
import { checkAndNotifyUpcomingSubscriptions, sendLocalNotification } from '@/lib/notifications';
import { matchCategoryFromDescription } from '@/lib/autoCategory';
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
import { AiMemorySheet } from '@/components/sheets/AiMemorySheet';
import { ShortcutsTutorialSheet } from '@/components/sheets/ShortcutsTutorialSheet';
import { VoiceOverlay } from '@/components/sheets/VoiceOverlay';

export default function HomePage() {
  const {
    currentListId,
    transactions,
    categories,
    subscriptions,
    aiMemory,
    activeType,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedPeriod,
    selectedMonthDate,
    settings,
    openSheet,
    addTransaction,
    isSearchActive,
    searchQuery,
  } = useAppStore();

  const [currentView, setCurrentView] = useState<'finance' | 'subscriptions'>('finance');

  // Register Service Worker, check subscription notifications & listen to deep link URLs
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('ServiceWorker registered successfully:', reg.scope))
        .catch((err) => console.warn('ServiceWorker registration failed:', err));
    }
    checkAndNotifyUpcomingSubscriptions(subscriptions);

    // Deep Link URL Listener for iOS Shortcuts, Action Button, and Apple Pay
    const listener = App.addListener('appUrlOpen', async (data) => {
      console.log('App opened with URL:', data.url);
      try {
        const urlObj = new URL(data.url);
        const host = urlObj.host || urlObj.pathname.replace(/^\/\//, '');

        if (host === 'voice') {
          openSheet('voice');
        } else if (host === 'add') {
          openSheet('add_tx');
        } else if (host === 'prompt' || host === 'pay') {
          const rawText = urlObj.searchParams.get('text') || urlObj.searchParams.get('amount') || '';
          if (rawText.trim()) {
            await handleProcessTextPrompt(rawText.trim());
          }
        }
      } catch (err) {
        console.warn('Error handling deep link URL:', err);
      }
    });

    return () => {
      listener.then((h) => h.remove());
    };
  }, [subscriptions, categories, currentListId, aiMemory]);

  // Deep Link text prompt parser powered by Gemini 2.0 Flash
  const handleProcessTextPrompt = async (promptText: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    let parsedDescription = promptText;
    let parsedAmount = 0;
    let parsedType: 'expense' | 'income' = promptText.toLowerCase().includes('ingreso') ? 'income' : 'expense';
    let parsedCategoryId = categories[0]?.id || 'cat-1';
    let parsedTags: string[] = [];

    // Fallback amount match e.g. "20000", "20 mil"
    const digitMatch = promptText.match(/\b\d+[\d\.]*\b/);
    if (digitMatch) {
      parsedAmount = parseInt(digitMatch[0].replace(/\./g, ''), 10);
    }

    // Match hashtags in prompt e.g. #debito
    const hashtags = promptText.match(/#\w+/g);
    if (hashtags) {
      parsedTags = hashtags.map((h) => h.toLowerCase());
    }

    // Initial local category matching
    const matchedLocalId = matchCategoryFromDescription(promptText, categories);
    if (matchedLocalId) parsedCategoryId = matchedLocalId;

    try {
      if (apiKey) {
        const categoriesPrompt = categories
          ? categories.map((c: any) => `ID: "${c.id}", Name: "${c.name}", Type: "${c.type}"`).join('\n')
          : '';

        const geminiPrompt = `
You are an AI financial transaction parser for DinER mobile app.
Extract structured transaction details from this text prompt: "${promptText}"

Available Categories:
${categoriesPrompt}

Return ONLY raw JSON with keys:
{
  "description": "Clean concise short title string (e.g., Dominos Pizza)",
  "amount": integer amount (e.g., 20000),
  "type": "expense" or "income",
  "categoryId": "matched category ID string or null",
  "tags": ["#tag1", "#tag2"]
}
`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed.description) parsedDescription = parsed.description;
            if (parsed.amount && typeof parsed.amount === 'number') parsedAmount = parsed.amount;
            if (parsed.type) parsedType = parsed.type;
            if (parsed.categoryId) parsedCategoryId = parsed.categoryId;
            if (Array.isArray(parsed.tags)) parsedTags = parsed.tags;
          }
        }
      }
    } catch (err) {
      console.warn('Prompt AI parsing error:', err);
    }

    if (parsedAmount > 0) {
      addTransaction({
        listId: currentListId,
        description: parsedDescription,
        amount: parsedAmount,
        type: parsedType,
        categoryId: parsedCategoryId,
        tags: parsedTags,
        date: new Date().toISOString().split('T')[0],
        recurrence: 'once',
      });

      sendLocalNotification(
        Date.now() % 100000,
        `✅ Transacción Registrada: ${parsedDescription}`,
        `Monto: $${parsedAmount.toLocaleString('es-CO')} COP • Categoría: ${categories.find(c=>c.id===parsedCategoryId)?.name || ''}`
      );
    }
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
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32 transition-colors duration-300">
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

            {/* Category Bar Chart */}
            <BarChart
              categoryTotals={categoryTotals}
              selectedCategoryFilter={selectedCategoryFilter}
              onSelectCategory={setSelectedCategoryFilter}
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
      <AiMemorySheet />
      <ShortcutsTutorialSheet />
      <VoiceOverlay />
    </main>
  );
}
