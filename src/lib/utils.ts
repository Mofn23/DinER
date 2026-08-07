import { TransactionData, CategoryData } from './initialData';

export function formatAmount(amount: number, currency = 'COP'): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  // standard COP output format e.g. "$ 105.000" or "$ 105,000" -> we convert to pixel-exact spec style e.g. "$105,000" or "-$347,776"
  const cleanNumber = Math.abs(amount).toLocaleString('en-US');
  if (amount < 0) {
    return `-$${cleanNumber}`;
  }
  return `$${cleanNumber}`;
}

export function formatCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    const formatted = (abs / 1_000_000).toFixed(2);
    return `${formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted}M`;
  }
  if (abs >= 1_000) {
    const formatted = Math.round(abs / 1_000);
    return `${formatted}K`;
  }
  return `${abs}`;
}

export function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (targetDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  // Format as M/D/YY e.g. 8/4/26
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${day}/${year}`;
}

export function filterTransactionsByPeriod(
  transactions: TransactionData[],
  period: string,
  selectedMonthDate: Date,
  rollover: boolean = false
): TransactionData[] {
  if (period === 'All time') {
    return transactions;
  }

  const selectedYear = selectedMonthDate.getFullYear();
  const selectedMonth = selectedMonthDate.getMonth();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date + 'T00:00:00');
    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();

    if (period === 'Month') {
      if (rollover) {
        // Rollover ON: includes all transactions up to the end of selected month
        return (
          txYear < selectedYear ||
          (txYear === selectedYear && txMonth <= selectedMonth)
        );
      }
      return txYear === selectedYear && txMonth === selectedMonth;
    }

    if (period === 'Year') {
      return txYear === selectedYear;
    }

    return true;
  });
}

export function getCategoryTotals(
  transactions: TransactionData[],
  categories: CategoryData[],
  type: 'expense' | 'income'
): { category: CategoryData; total: number }[] {
  const typeCats = categories.filter((c) => c.type === type);
  
  const totalsMap = new Map<string, number>();
  typeCats.forEach((cat) => totalsMap.set(cat.id, 0));

  transactions
    .filter((tx) => tx.type === type)
    .forEach((tx) => {
      const current = totalsMap.get(tx.categoryId) || 0;
      totalsMap.set(tx.categoryId, current + tx.amount);
    });

  return typeCats
    .map((cat) => ({
      category: cat,
      total: totalsMap.get(cat.id) || 0,
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
}
