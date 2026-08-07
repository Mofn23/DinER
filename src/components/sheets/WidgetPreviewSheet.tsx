import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { formatAmount } from '@/lib/utils';
import { updateWidgetCache } from '@/lib/widgetSync';
import { IconClose, IconCheck } from '../common/Icons';

export const WidgetPreviewSheet: React.FC = () => {
  const { activeSheet, closeSheet, transactions, currentListId, settings } = useAppStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (activeSheet !== 'widgets' as any) return null;

  // Calculate Saldo Restante & Gasto del Mes
  const listTx = transactions.filter((t) => t.listId === currentListId);
  const totalExpense = listTx
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = listTx
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netTotal = totalIncome - totalExpense;

  const handleSyncWidget = () => {
    updateWidgetCache(netTotal, totalExpense, settings.currency);
    setToastMessage('¡Widget sincronizado con tu saldo actual!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0D] flex flex-col justify-between animate-fade-in overflow-y-auto no-scrollbar">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#34C759] text-white font-extrabold text-sm shadow-elevation animate-fade-in flex items-center gap-2">
          <IconCheck className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full h-full max-w-[390px] mx-auto flex flex-col justify-between px-5 pt-12 pb-6 relative min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <h2 className="text-white font-black text-2xl">Widget de iOS</h2>
          </div>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Live Widget Preview Card */}
        <div className="flex flex-col items-center my-auto gap-4">
          <span className="text-[#8E8E93] font-bold text-xs">VISTA PREVIA DEL WIDGET (iOS)</span>

          {/* Minimal iOS Widget Mock Container */}
          <div className="w-[280px] h-[160px] rounded-[32px] bg-[#0B0B0D] border border-white/15 p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Subtle glow background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#34C759]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-1.5 z-10">
              <span className="text-white font-black text-sm tracking-tight">DinER</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
            </div>

            {/* Saldo Restante Section */}
            <div className="flex flex-col gap-0.5 z-10">
              <span className="text-[#8E8E93] font-bold text-[11px]">Saldo Restante</span>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#34C759] text-white font-black text-xs flex items-center justify-center">
                  +
                </span>
                <span className="text-white font-black text-xl tracking-tight">
                  {formatAmount(Math.abs(netTotal))}
                </span>
              </div>
            </div>

            {/* Gasto del Mes Section */}
            <div className="flex flex-col gap-0.5 z-10">
              <span className="text-[#8E8E93] font-bold text-[11px]">Gasto del Mes</span>
              <span className="text-[#E8505B] font-black text-sm tracking-tight">
                {formatAmount(-totalExpense)} {settings.currency}
              </span>
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSyncWidget}
            className="w-full max-w-xs py-3.5 rounded-2xl bg-[#1C1C1E] border border-white/10 hover:border-white/20 text-white font-extrabold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <IconCheck className="w-4 h-4 text-[#34C759]" />
            <span>Sincronizar Datos del Widget</span>
          </button>
        </div>

        {/* Instructions list */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-2 mt-auto">
          <span className="text-white font-extrabold text-xs mb-1">Cómo añadir el Widget a tu iPhone:</span>
          <ol className="text-[#8E8E93] text-xs font-semibold flex flex-col gap-1.5 pl-4 list-decimal">
            <li>Mantén presionada la pantalla de inicio de tu iPhone.</li>
            <li>Toca el botón <span className="text-white font-bold">+</span> en la esquina superior izquierda.</li>
            <li>Busca <span className="text-white font-bold">DinER</span> y selecciona el Widget Minimalista.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
