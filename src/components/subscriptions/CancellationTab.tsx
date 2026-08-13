import React, { useState } from 'react';
import { SubscriptionData } from '@/lib/initialData';
import { IconCheck } from '../common/Icons';

interface CancellationTabProps {
  subscriptions: SubscriptionData[];
  onDelete: (id: string) => void;
}

export const CancellationTab: React.FC<CancellationTabProps> = ({ subscriptions, onDelete }) => {
  const [recoveredAmount, setRecoveredAmount] = useState(149900); // COP Saved
  const [toast, setToast] = useState<string | null>(null);

  const handleCancelAction = (sub: SubscriptionData) => {
    onDelete(sub.id);
    setRecoveredAmount((prev) => prev + sub.amount);
    setToast(`¡Suscripción "${sub.name}" cancelada con éxito!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#34C759] text-white font-extrabold text-sm shadow-elevation flex items-center gap-2">
          <IconCheck className="w-4 h-4 text-white" />
          <span>{toast}</span>
        </div>
      )}

      {/* Recovered Money Counter */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[#8E8E93] font-extrabold text-xs">Dinero Total Recuperado</span>
          <span className="text-[#34C759] font-black text-xl tracking-tight">
            ${recoveredAmount.toLocaleString('en-US')} COP
          </span>
        </div>
        <span className="text-2xl">💰</span>
      </div>

      {/* Cancellation List */}
      <div className="flex flex-col gap-3">
        <span className="text-[#8E8E93] font-extrabold text-xs px-1 uppercase tracking-wider">
          Asistente de Cancelaciones
        </span>

        {subscriptions.map((sub) => (
          <div key={sub.id} className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{sub.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm">{sub.name}</span>
                  <span className="text-[#8E8E93] text-xs font-semibold">
                    {sub.provider || 'Proveedor'} • ${sub.amount.toLocaleString('en-US')} COP
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCancelAction(sub)}
                className="px-3.5 py-1.5 rounded-full bg-[#E8505B] hover:bg-[#d4434e] text-white font-black text-xs active:scale-95 transition-transform"
              >
                Cancelar
              </button>
            </div>

            {sub.cancelSteps && (
              <div className="p-3 rounded-xl bg-[#242426] text-[#8E8E93] text-xs font-semibold leading-relaxed">
                <span className="text-white font-extrabold block mb-1">Pasos oficiales de cancelación:</span>
                {sub.cancelSteps}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
