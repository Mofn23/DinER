import { TransactionData, CategoryData } from './initialData';

export function getLocalDateString(dateInput: Date = new Date()): string {
  // Returns YYYY-MM-DD in America/Bogota (Colombia, UTC-5) timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(dateInput);
}

export function formatAmount(amount: number, currency = 'COP'): string {
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
  const todayStr = getLocalDateString(new Date());

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  if (dateStr === todayStr) {
    return 'Today';
  }
  if (dateStr === yesterdayStr) {
    return 'Yesterday';
  }

  // Format dateStr (YYYY-MM-DD) as M/D/YY e.g. 8/4/26
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0].slice(-2);
    const month = parseInt(parts[1], 10).toString();
    const day = parseInt(parts[2], 10).toString();
    return `${month}/${day}/${year}`;
  }

  return dateStr;
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
    const parts = tx.date.split('-');
    if (parts.length !== 3) return true;

    const txYear = parseInt(parts[0], 10);
    const txMonth = parseInt(parts[1], 10) - 1;

    if (period === 'Month') {
      if (rollover) {
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
