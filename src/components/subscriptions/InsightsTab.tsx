import React from 'react';
import { SubscriptionData } from '@/lib/initialData';
import { calculateFinancialSummary } from '@/lib/financialsEngine';
import { formatAmount } from '@/lib/utils';

interface InsightsTabProps {
  subscriptions: SubscriptionData[];
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ subscriptions }) => {
  const summary = calculateFinancialSummary(subscriptions);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Leak Detector Card */}
      <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h3 className="text-white font-extrabold text-sm">Detector de Fugas de Dinero</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#242426] flex flex-col">
            <span className="text-[#8E8E93] font-extrabold text-[11px]">Proyección Anual</span>
            <span className="text-white font-black text-base mt-0.5">
              {formatAmount(summary.annualProjection)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#242426] flex flex-col">
            <span className="text-[#8E8E93] font-extrabold text-[11px]">Ahorro Potencial</span>
            <span className="text-[#34C759] font-black text-base mt-0.5">
              {formatAmount(summary.potentialSavingsMonthly)} / mes
            </span>
          </div>
        </div>

        <p className="text-[#8E8E93] text-xs font-semibold leading-relaxed pt-1">
          Mantener únicamente las suscripciones esenciales optimiza tu presupuesto en más de un 15% anual.
        </p>
      </div>

      {/* Breakdown per subscription */}
      <div className="flex flex-col gap-2">
        <span className="text-[#8E8E93] font-extrabold text-xs px-1 uppercase tracking-wider">
          Distribución de Costos Recurrentes
        </span>

        {subscriptions.map((sub) => {
          const monthlyPrice = sub.frequency === 'yearly' ? sub.amount / 12 : sub.amount;
          const percentage = Math.round((monthlyPrice / (summary.totalMonthlySpend || 1)) * 100);

          return (
            <div key={sub.id} className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{sub.emoji}</span>
                  <span className="text-white font-bold text-sm">{sub.name}</span>
                </div>
                <span className="text-white font-black text-xs">
                  {formatAmount(Math.round(monthlyPrice))} / mes ({percentage}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#2A2A2C] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#34C759] transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
