import { getLocalDateString } from './utils';

export interface CategoryData {
  id: string;
  name: string;
  emoji: string;
  tint: string;
  type: 'expense' | 'income';
}

export interface TransactionData {
  id: string;
  listId: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  tags: string[];
  date: string; // ISO String YYYY-MM-DD in America/Bogota
  recurrence: 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'yearly';
  createdAt: string;
}

export interface ListData {
  id: string;
  name: string;
  currency: string;
  defaultPeriod: string;
}

export interface BudgetData {
  id: string;
  listId: string;
  categoryId: string;
  monthlyAmount: number;
}

export const INITIAL_LISTS: ListData[] = [
  { id: 'list-1', name: 'RappiPay', currency: 'COP', defaultPeriod: 'Month' },
  { id: 'list-2', name: 'Personal', currency: 'COP', defaultPeriod: 'Month' },
];

export const INITIAL_CATEGORIES: CategoryData[] = [
  { id: 'cat-1', name: 'Mamá', emoji: '👩‍🍼', tint: '#8A7A55', type: 'expense' },
  { id: 'cat-2', name: 'Papá', emoji: '👴', tint: '#A8862B', type: 'income' },
  { id: 'cat-3', name: 'Gym', emoji: '🏋️', tint: '#7A5C43', type: 'expense' },
  { id: 'cat-4', name: 'Comida', emoji: '🍲', tint: '#8A6E4B', type: 'expense' },
  { id: 'cat-5', name: 'Uber', emoji: '🚘', tint: '#A05252', type: 'expense' },
  { id: 'cat-6', name: 'Suscripción', emoji: '📺', tint: '#5B6A8A', type: 'expense' },
  { id: 'cat-7', name: 'Apple', emoji: '🖥️', tint: '#707075', type: 'expense' },
  { id: 'cat-8', name: 'Apuestas', emoji: '🎲', tint: '#8A5B7A', type: 'expense' },
  { id: 'cat-9', name: 'Barbero', emoji: '💈', tint: '#5B8A82', type: 'expense' },
  { id: 'cat-10', name: 'Drinks', emoji: '🍺', tint: '#8A845B', type: 'expense' },
  { id: 'cat-11', name: 'Regalo', emoji: '🎁', tint: '#8A5B5B', type: 'expense' },
  { id: 'cat-12', name: 'Amorcito', emoji: '💙', tint: '#5B7A8A', type: 'expense' },
  { id: 'cat-13', name: 'Personal', emoji: '🧍', tint: '#6A5B8A', type: 'expense' },
  { id: 'cat-14', name: 'Salidas', emoji: '🎉', tint: '#8A5B7A', type: 'expense' },
  { id: 'cat-15', name: 'Credito', emoji: '💳', tint: '#34C759', type: 'income' },
];

export const INITIAL_TAGS: string[] = [
  '#debito', '#credito', '#mama', '#papa', '#gym', '#almuerzo',
  '#icloud+', '#suscripción', '#carrro'
];

// Bogota Local Dates
const now = new Date();
const todayIso = getLocalDateString(now); // e.g. "2026-08-06"

const yesterdayDate = new Date();
yesterdayDate.setDate(now.getDate() - 1);
const yesterdayIso = getLocalDateString(yesterdayDate); // e.g. "2026-08-05"

export const INITIAL_TRANSACTIONS: TransactionData[] = [
  // TODAY EXPENSES (-$347,776)
  {
    id: 'tx-1',
    listId: 'list-1',
    description: 'Bodyfit Fitness Center',
    amount: 105000,
    type: 'expense',
    categoryId: 'cat-3', // Gym
    tags: ['#debito', '#gym'],
    date: todayIso,
    recurrence: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    listId: 'list-1',
    description: 'Mamá fallabella',
    amount: 182400,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-3',
    listId: 'list-1',
    description: 'Mamá',
    amount: 6000,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#debito', '#mama'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-4',
    listId: 'list-1',
    description: 'Uber',
    amount: 6226,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#debito', '#mama'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-5',
    listId: 'list-1',
    description: 'Qbano',
    amount: 48150,
    type: 'expense',
    categoryId: 'cat-4', // Comida
    tags: ['#credito', '#almuerzo'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // TODAY INCOMES (+$313,797)
  {
    id: 'tx-6',
    listId: 'list-1',
    description: 'Dinero recibido de papá',
    amount: 200000,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#debito', '#papa'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-7',
    listId: 'list-1',
    description: 'Dinero recibido de papá',
    amount: 100000,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#debito', '#papa'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-8',
    listId: 'list-1',
    description: 'Ajuste',
    amount: 13797,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#papa'],
    date: todayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // YESTERDAY EXPENSES (-$65,000)
  {
    id: 'tx-9',
    listId: 'list-1',
    description: 'Arepas',
    amount: 65000,
    type: 'expense',
    categoryId: 'cat-4', // Comida
    tags: ['#debito'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // YESTERDAY INCOMES (+$2,940,164)
  {
    id: 'tx-10',
    listId: 'list-1',
    description: 'Papá',
    amount: 70000,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#debito', '#papa'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-11',
    listId: 'list-1',
    description: 'Crédito',
    amount: 2700000,
    type: 'income',
    categoryId: 'cat-15', // Credito
    tags: ['#credito'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-12',
    listId: 'list-1',
    description: 'Ajuste',
    amount: 170164,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#debito', '#papa'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // 8/4/26 EXPENSES (-$32,964)
  {
    id: 'tx-13',
    listId: 'list-1',
    description: 'Mercar bochalema',
    amount: 32964,
    type: 'expense',
    categoryId: 'cat-4', // Comida
    tags: ['#debito'],
    date: '2026-08-04',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // 8/3/26 EXPENSES (-$298,230)
  {
    id: 'tx-14',
    listId: 'list-1',
    description: 'iCloud+',
    amount: 44900,
    type: 'expense',
    categoryId: 'cat-6', // Suscripción
    tags: ['#icloud+', '#credito'],
    date: '2026-08-03',
    recurrence: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-15',
    listId: 'list-1',
    description: 'Mamá',
    amount: 247158,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: '2026-08-03',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-16',
    listId: 'list-1',
    description: 'WhatsApp plus',
    amount: 2999,
    type: 'expense',
    categoryId: 'cat-6', // Suscripción
    tags: ['#suscripción', '#credito'],
    date: '2026-08-03',
    recurrence: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-17',
    listId: 'list-1',
    description: 'Uber',
    amount: 3173,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#debito', '#carrro'],
    date: '2026-08-03',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // 8/3/26 INCOMES (+$147,000)
  {
    id: 'tx-18',
    listId: 'list-1',
    description: 'Papá',
    amount: 147000,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#debito', '#papa'],
    date: '2026-08-03',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // 8/2/26 EXPENSES (-$359,128)
  {
    id: 'tx-19',
    listId: 'list-1',
    description: 'Uber',
    amount: 22977,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#carrro', '#credito'],
    date: '2026-08-02',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-20',
    listId: 'list-1',
    description: 'Uber',
    amount: 27251,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#carrro', '#credito'],
    date: '2026-08-02',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-21',
    listId: 'list-1',
    description: 'Avance',
    amount: 200000,
    type: 'expense',
    categoryId: 'cat-15', // Credito
    tags: ['#credito'],
    date: '2026-08-02',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-22',
    listId: 'list-1',
    description: 'Dollarcity',
    amount: 12500,
    type: 'expense',
    categoryId: 'cat-13', // Personal
    tags: ['#debito'],
    date: '2026-08-02',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-23',
    listId: 'list-1',
    description: 'KFC',
    amount: 36400,
    type: 'expense',
    categoryId: 'cat-4', // Comida
    tags: ['#debito', '#almuerzo'],
    date: '2026-08-02',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-24',
    listId: 'list-1',
    description: 'Entradas fiesta',
    amount: 60000,
    type: 'expense',
    categoryId: 'cat-14', // Salidas
    tags: ['#debito'],
    date: '2026-08-02',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },

  // 8/1/26 EXPENSES (-$1,456,125)
  {
    id: 'tx-25',
    listId: 'list-1',
    description: 'Mamá rodilleras',
    amount: 71155,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-26',
    listId: 'list-1',
    description: 'Mamá pull and bear',
    amount: 240500,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-27',
    listId: 'list-1',
    description: 'Mamá Zara',
    amount: 370800,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-28',
    listId: 'list-1',
    description: 'Crédito',
    amount: 417283,
    type: 'expense',
    categoryId: 'cat-15', // Credito
    tags: ['#credito'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-29',
    listId: 'list-1',
    description: 'Mamá ropa',
    amount: 119900,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-30',
    listId: 'list-1',
    description: 'Uber',
    amount: 30261,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#carrro', '#credito'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-31',
    listId: 'list-1',
    description: 'Mamá ropa',
    amount: 132480,
    type: 'expense',
    categoryId: 'cat-1', // Mamá
    tags: ['#credito', '#mama'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-32',
    listId: 'list-1',
    description: 'Uber',
    amount: 34487,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#carrro', '#credito'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-33',
    listId: 'list-1',
    description: 'Uber',
    amount: 10599,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#debito', '#carrro'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-34',
    listId: 'list-1',
    description: 'Uber',
    amount: 3660,
    type: 'expense',
    categoryId: 'cat-5', // Uber
    tags: ['#debito', '#carrro'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-35',
    listId: 'list-1',
    description: 'Cóctel',
    amount: 25000,
    type: 'expense',
    categoryId: 'cat-10', // Drinks
    tags: ['#debito'],
    date: '2026-08-01',
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_BUDGETS: BudgetData[] = [
  { id: 'b-1', listId: 'list-1', categoryId: 'cat-3', monthlyAmount: 200000 },
  { id: 'b-2', listId: 'list-1', categoryId: 'cat-4', monthlyAmount: 300000 },
  { id: 'b-3', listId: 'list-1', categoryId: 'cat-1', monthlyAmount: 1500000 },
];
