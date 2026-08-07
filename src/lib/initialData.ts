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
  date: string; // ISO String YYYY-MM-DD
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
  { id: 'list-1', name: 'Personal', currency: 'COP', defaultPeriod: 'Month' },
  { id: 'list-2', name: 'Negocios', currency: 'COP', defaultPeriod: 'Month' },
];

export const INITIAL_CATEGORIES: CategoryData[] = [
  { id: 'cat-1', name: 'Mamá', emoji: '👩‍🍼', tint: '#8A7A55', type: 'expense' },
  { id: 'cat-2', name: 'Papá', emoji: '👴', tint: '#A8862B', type: 'expense' },
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
  { id: 'cat-14', name: 'PayPal', emoji: '🪽', tint: '#5B7A8A', type: 'expense' },
  { id: 'cat-15', name: 'Credito', emoji: '💳', tint: '#34C759', type: 'income' },
];

export const INITIAL_TAGS: string[] = [
  '#mama', '#papa', '#gym', '#debito', '#credito', '#almuerzo',
  '#suscripción', '#icloud+', '#transferencia', '#uberone', '#cena',
  '#bebida', '#cine', '#deporte', '#regalo', '#yo'
];

const now = new Date();
const todayIso = now.toISOString().split('T')[0];

const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const yesterdayIso = yesterday.toISOString().split('T')[0];

const threeDaysAgo = new Date(now);
threeDaysAgo.setDate(now.getDate() - 3);
const threeDaysAgoIso = threeDaysAgo.toISOString().split('T')[0];

const fourDaysAgo = new Date(now);
fourDaysAgo.setDate(now.getDate() - 4);
const fourDaysAgoIso = fourDaysAgo.toISOString().split('T')[0];

export const INITIAL_TRANSACTIONS: TransactionData[] = [
  {
    id: 'tx-1',
    listId: 'list-1',
    description: 'Bodyfit Fitness Center',
    amount: 105000,
    type: 'expense',
    categoryId: 'cat-3', // Gym
    tags: ['#gym', '#debito'],
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
    date: yesterdayIso,
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
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-6',
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
  {
    id: 'tx-7',
    listId: 'list-1',
    description: 'Dinero recibido de papá',
    amount: 200000,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#papa'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-8',
    listId: 'list-1',
    description: 'Dinero recibido de papá',
    amount: 100000,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#papa'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-9',
    listId: 'list-1',
    description: 'Ajuste',
    amount: 13797,
    type: 'income',
    categoryId: 'cat-2', // Papá
    tags: ['#papa'],
    date: yesterdayIso,
    recurrence: 'once',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-10',
    listId: 'list-1',
    description: 'WhatsApp plus',
    amount: 2999,
    type: 'expense',
    categoryId: 'cat-6', // Suscripción
    tags: ['#suscripción'],
    date: threeDaysAgoIso,
    recurrence: 'monthly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx-11',
    listId: 'list-1',
    description: 'iCloud+',
    amount: 44900,
    type: 'expense',
    categoryId: 'cat-6', // Suscripción
    tags: ['#suscripción', '#icloud+'],
    date: fourDaysAgoIso,
    recurrence: 'monthly',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_BUDGETS: BudgetData[] = [
  { id: 'b-1', listId: 'list-1', categoryId: 'cat-3', monthlyAmount: 200000 },
  { id: 'b-2', listId: 'list-1', categoryId: 'cat-4', monthlyAmount: 300000 },
  { id: 'b-3', listId: 'list-1', categoryId: 'cat-1', monthlyAmount: 500000 },
];
