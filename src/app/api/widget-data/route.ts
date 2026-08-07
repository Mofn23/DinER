import { NextResponse } from 'next/server';
import { INITIAL_TRANSACTIONS } from '@/lib/initialData';

export async function GET() {
  const listTx = INITIAL_TRANSACTIONS.filter((t) => t.listId === 'list-1');

  const totalExpense = listTx
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = listTx
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netTotal = totalIncome - totalExpense;

  return NextResponse.json({
    netTotal,
    totalExpense,
    currency: 'COP',
    formattedNet: `+$${netTotal.toLocaleString('en-US')}`,
    formattedExpense: `-$${totalExpense.toLocaleString('en-US')}`,
    updatedAt: new Date().toISOString(),
  });
}
