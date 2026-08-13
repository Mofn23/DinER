import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  INITIAL_LISTS,
  INITIAL_CATEGORIES,
  INITIAL_TAGS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SUBSCRIPTIONS,
  CategoryData,
  TransactionData,
  ListData,
  BudgetData,
  SubscriptionData,
} from './initialData';
import { getLocalDateString } from './utils';

export type ActiveSheet =
  | 'none'
  | 'add_tx'
  | 'edit_tx'
  | 'settings'
  | 'categories'
  | 'tags'
  | 'recurrence'
  | 'budgets'
  | 'lists'
  | 'subscriptions'
  | 'voice';

interface AppSettings {
  showIncome: boolean;
  rollover: boolean;
  currency: string;
  voiceLanguage: string;
}

interface AppStore {
  // State
  currentListId: string;
  lists: ListData[];
  categories: CategoryData[];
  tags: string[];
  transactions: TransactionData[];
  budgets: BudgetData[];
  subscriptions: SubscriptionData[];
  settings: AppSettings;

  activeType: 'expense' | 'income';
  selectedCategoryFilter: string | null;
  selectedPeriod: string;
  selectedMonthDate: Date;
  isMonthStripVisible: boolean;

  // Search state
  isSearchActive: boolean;
  searchQuery: string;

  activeSheet: ActiveSheet;
  editingTransactionId: string | null;

  // Actions
  setCurrentListId: (id: string) => void;
  setActiveType: (type: 'expense' | 'income') => void;
  setSelectedCategoryFilter: (catId: string | null) => void;
  setSelectedPeriod: (period: string) => void;
  setSelectedMonthDate: (date: Date) => void;
  toggleMonthStrip: () => void;

  // Search actions
  setSearchActive: (active: boolean) => void;
  setSearchQuery: (query: string) => void;

  openSheet: (sheet: ActiveSheet, editingTxId?: string | null) => void;
  closeSheet: () => void;

  // Transaction CRUD
  addTransaction: (tx: Omit<TransactionData, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<TransactionData>) => void;
  deleteTransaction: (id: string) => void;

  // Category CRUD
  addCategory: (cat: Omit<CategoryData, 'id'>) => CategoryData;
  updateCategory: (id: string, cat: Partial<CategoryData>) => void;
  deleteCategory: (id: string) => void;

  // Tag CRUD
  addTag: (tag: string) => void;
  deleteTag: (tag: string) => void;

  // Subscription CRUD & Pay Action
  addSubscription: (sub: Omit<SubscriptionData, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, sub: Partial<SubscriptionData>) => void;
  deleteSubscription: (id: string) => void;
  paySubscription: (id: string) => void;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Budget CRUD
  setBudget: (categoryId: string, amount: number) => void;

  // Lists CRUD
  addList: (name: string) => void;
}

// Function to recover any saved subscriptions from existing localStorage keys
function getSavedSubscriptionsFromLocalStorage(): SubscriptionData[] | null {
  if (typeof window === 'undefined') return null;
  const storageKeys = [
    'diner_app_storage_v5',
    'diner_app_storage_v4',
    'diner_app_storage_v3',
    'diner_app_storage_v2',
    'diner_app_storage',
  ];
  for (const key of storageKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.state?.subscriptions && Array.isArray(parsed.state.subscriptions) && parsed.state.subscriptions.length > 0) {
          return parsed.state.subscriptions;
        }
      }
    } catch {
      // continue check
    }
  }
  return null;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentListId: 'list-1',
      lists: INITIAL_LISTS,
      categories: INITIAL_CATEGORIES,
      tags: INITIAL_TAGS,
      transactions: INITIAL_TRANSACTIONS,
      budgets: INITIAL_BUDGETS,
      subscriptions: getSavedSubscriptionsFromLocalStorage() || INITIAL_SUBSCRIPTIONS,
      settings: {
        showIncome: true,
        rollover: false,
        currency: 'COP',
        voiceLanguage: 'ES',
      },

      activeType: 'expense',
      selectedCategoryFilter: null,
      selectedPeriod: 'Month',
      selectedMonthDate: new Date(),
      isMonthStripVisible: false,

      isSearchActive: false,
      searchQuery: '',

      activeSheet: 'none',
      editingTransactionId: null,

      setCurrentListId: (id) => set({ currentListId: id, selectedCategoryFilter: null }),
      setActiveType: (type) => set({ activeType: type }),
      setSelectedCategoryFilter: (catId) => set({ selectedCategoryFilter: catId }),
      setSelectedPeriod: (period) => set({ selectedPeriod: period }),
      setSelectedMonthDate: (date) => set({ selectedMonthDate: date }),
      toggleMonthStrip: () => set((state) => ({ isMonthStripVisible: !state.isMonthStripVisible })),

      setSearchActive: (active) => set({ isSearchActive: active, searchQuery: active ? get().searchQuery : '' }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      openSheet: (sheet, editingTxId = null) =>
        set({ activeSheet: sheet, editingTransactionId: editingTxId }),
      closeSheet: () => set({ activeSheet: 'none', editingTransactionId: null }),

      addTransaction: (tx) => {
        const newTx: TransactionData = {
          ...tx,
          id: 'tx-' + Date.now(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [newTx, ...state.transactions] }));
      },

      updateTransaction: (id, updatedFields) => {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      addCategory: (cat) => {
        const newCat: CategoryData = {
          ...cat,
          id: 'cat-' + Date.now(),
        };
        set((state) => ({ categories: [...state.categories, newCat] }));
        return newCat;
      },

      updateCategory: (id, updatedFields) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addTag: (tag) => {
        const formatted = tag.startsWith('#') ? tag.toLowerCase() : `#${tag.toLowerCase()}`;
        set((state) => {
          if (state.tags.includes(formatted)) return state;
          return { tags: [...state.tags, formatted] };
        });
      },

      deleteTag: (tag) => {
        set((state) => ({
          tags: state.tags.filter((t) => t !== tag),
        }));
      },

      addSubscription: (sub) => {
        const newSub: SubscriptionData = {
          ...sub,
          id: 'sub-' + Date.now(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ subscriptions: [...state.subscriptions, newSub] }));
      },

      updateSubscription: (id, updatedFields) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)),
        }));
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }));
      },

      paySubscription: (id) => {
        const state = get();
        const sub = state.subscriptions.find((s) => s.id === id);
        if (!sub) return;

        const todayStr = getLocalDateString(new Date());

        const newTx: TransactionData = {
          id: 'tx-' + Date.now(),
          listId: sub.listId || state.currentListId,
          description: sub.name,
          amount: sub.amount,
          type: 'expense',
          categoryId: sub.categoryId || 'cat-6',
          tags: sub.tags.length > 0 ? sub.tags : ['#suscripción'],
          date: todayStr,
          recurrence: sub.frequency === 'yearly' ? 'yearly' : 'monthly',
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          transactions: [newTx, ...s.transactions],
          subscriptions: s.subscriptions.map((item) =>
            item.id === id ? { ...item, lastPaidDate: todayStr } : item
          ),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setBudget: (categoryId, amount) => {
        set((state) => {
          const existing = state.budgets.find(
            (b) => b.categoryId === categoryId && b.listId === state.currentListId
          );
          if (existing) {
            return {
              budgets: state.budgets.map((b) =>
                b.id === existing.id ? { ...b, monthlyAmount: amount } : b
              ),
            };
          }
          return {
            budgets: [
              ...state.budgets,
              { id: 'b-' + Date.now(), listId: state.currentListId, categoryId, monthlyAmount: amount },
            ],
          };
        });
      },

      addList: (name) => {
        const newList: ListData = {
          id: 'list-' + Date.now(),
          name,
          currency: 'COP',
          defaultPeriod: 'Month',
        };
        set((state) => ({
          lists: [...state.lists, newList],
          currentListId: newList.id,
        }));
      },
    }),
    {
      name: 'diner_app_storage_v5',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentListId: state.currentListId,
        lists: state.lists,
        categories: state.categories,
        tags: state.tags,
        transactions: state.transactions,
        budgets: state.budgets,
        subscriptions: state.subscriptions,
        settings: state.settings,
      }),
    }
  )
);
