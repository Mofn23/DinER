import React, { useState } from 'react';
import { SubscriptionData } from '@/lib/initialData';
import { formatAmount } from '@/lib/utils';
import { IconCheck } from '../common/Icons';

interface TimelineTabProps {
  subscriptions: SubscriptionData[];
  onPay: (id: string, name: string) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ subscriptions, onPay }) => {
  const [horizon, setHorizon] = useState<7 | 30 | 90 | 365>(30);

  // Group subscriptions by days remaining
  const now = new Date();
  const currentDay = now.getDate();

  const sortedSubs = [...subscriptions].sort((a, b) => (a.billingDay || 1) - (b.billingDay || 1));

  const filteredSubs = sortedSubs.filter((sub) => {
    let diff = sub.billingDay - currentDay;
    if (diff < 0) diff += 30;
    return diff <= horizon;
  });

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Horizon Filter Bar */}
      <div className="flex items-center justify-between p-1 rounded-2xl bg-[#1C1C1E] border border-white/10">
        {([7, 30, 90, 365] as const).map((days) => (
          <button
            key={days}
            onClick={() => setHorizon(days)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
              horizon === days
                ? 'bg-[#34C759] text-white shadow-sm'
                : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            {days === 365 ? '1 Año' : `${days} Días`}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="flex flex-col gap-3">
        {filteredSubs.length === 0 ? (
          <div className="p-8 text-center text-[#8E8E93] text-sm font-semibold">
            No hay renovaciones en los próximos {horizon} días.
          </div>
        ) : (
          filteredSubs.map((sub) => {
            let daysLeft = sub.billingDay - currentDay;
            if (daysLeft < 0) daysLeft += 30;

            const isToday = daysLeft === 0;

            return (
              <div
                key={sub.id}
                className={`p-4 rounded-2xl bg-[#1C1C1E] border flex items-center justify-between transition-all ${
                  isToday ? 'border-[#34C759]/60 shadow-lg' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#242426] border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {sub.emoji}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-sm">{sub.name}</span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-[#34C759]/20 text-[#34C759] text-[10px] font-black uppercase">
                          ¡Hoy!
                        </span>
                      )}
                    </div>
                    <span className="text-[#8E8E93] text-xs font-bold">
                      {daysLeft === 0 ? 'Cobro hoy' : `En ${daysLeft} días`} • Día {sub.billingDay}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#E8505B] font-black text-sm">
                    {formatAmount(-sub.amount)}
                  </span>
                  <button
                    onClick={() => onPay(sub.id, sub.name)}
                    className="px-3 py-1.5 rounded-full bg-[#34C759] text-white font-extrabold text-xs active:scale-95 transition-transform"
                  >
                    Pagar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
