import { create } from 'zustand';
import {
  INITIAL_LISTS,
  INITIAL_CATEGORIES,
  INITIAL_TAGS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  CategoryData,
  TransactionData,
  ListData,
  BudgetData,
} from './initialData';

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
  | 'search'
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
  settings: AppSettings;

  activeType: 'expense' | 'income';
  selectedCategoryFilter: string | null;
  selectedPeriod: string;
  selectedMonthDate: Date; // date representing active month
  isMonthStripVisible: boolean;

  activeSheet: ActiveSheet;
  editingTransactionId: string | null;

  // Actions
  setCurrentListId: (id: string) => void;
  setActiveType: (type: 'expense' | 'income') => void;
  setSelectedCategoryFilter: (catId: string | null) => void;
  setSelectedPeriod: (period: string) => void;
  setSelectedMonthDate: (date: Date) => void;
  toggleMonthStrip: () => void;
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

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Budget CRUD
  setBudget: (categoryId: string, amount: number) => void;

  // Lists CRUD
  addList: (name: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentListId: 'list-1',
  lists: INITIAL_LISTS,
  categories: INITIAL_CATEGORIES,
  tags: INITIAL_TAGS,
  transactions: INITIAL_TRANSACTIONS,
  budgets: INITIAL_BUDGETS,
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

  activeSheet: 'none',
  editingTransactionId: null,

  setCurrentListId: (id) => set({ currentListId: id, selectedCategoryFilter: null }),
  setActiveType: (type) => set({ activeType: type }),
  setSelectedCategoryFilter: (catId) => set({ selectedCategoryFilter: catId }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  setSelectedMonthDate: (date) => set({ selectedMonthDate: date }),
  toggleMonthStrip: () => set((state) => ({ isMonthStripVisible: !state.isMonthStripVisible })),
  
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
}));
