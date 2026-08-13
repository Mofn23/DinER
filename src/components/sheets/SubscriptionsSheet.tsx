import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { formatAmount, getLocalDateString } from '@/lib/utils';
import {
  requestNotificationPermission,
  sendLocalNotification,
} from '@/lib/notifications';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { IconClose, IconPlus, IconCheck, IconTrash } from '../common/Icons';

export const SubscriptionsSheet: React.FC = () => {
  const {
    activeSheet,
    closeSheet,
    subscriptions,
    tags,
    currentListId,
    addSubscription,
    deleteSubscription,
    paySubscription,
  } = useAppStore();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📺');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'bimonthly' | 'yearly'>('monthly');
  const [billingDay, setBillingDay] = useState('3');
  const [selectedCategoryId] = useState('cat-6'); // Suscripción
  const [selectedTags, setSelectedTags] = useState<string[]>(['#suscripción', '#credito']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, [activeSheet]);

  if (activeSheet !== 'subscriptions') return null;

  const todayStr = getLocalDateString(new Date());

  // Calculate Monthly & Annual Totals
  const monthlyTotal = Math.round(
    subscriptions.reduce((acc, sub) => {
      if (sub.frequency === 'monthly') return acc + sub.amount;
      if (sub.frequency === 'weekly') return acc + sub.amount * 4.33;
      if (sub.frequency === 'bimonthly') return acc + sub.amount / 2;
      if (sub.frequency === 'yearly') return acc + sub.amount / 12;
      return acc + sub.amount;
    }, 0)
  );

  const annualTotal = monthlyTotal * 12;

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setHasNotificationPermission(granted);
    if (granted) {
      setToastMessage('¡Notificaciones Push activadas!');
    } else {
      setToastMessage('Permiso de notificaciones denegado en el navegador');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestNotification = async () => {
    if (!hasNotificationPermission) {
      const granted = await requestNotificationPermission();
      setHasNotificationPermission(granted);
      if (!granted) return;
    }

    sendLocalNotification(
      999,
      '📺 DinER - Recordatorio de Suscripción',
      '¡Notificación de prueba enviada con éxito! Recordatorio de suscripción listo.'
    );

    setToastMessage('Notificación enviada a tu dispositivo');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePay = (subId: string, subName: string) => {
    paySubscription(subId);
    setToastMessage(`¡Pago de ${subName} registrado en el inicio!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateSubmit = () => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!name.trim() || !numAmount) return;

    addSubscription({
      listId: currentListId,
      name: name.trim(),
      emoji: emoji || '📺',
      amount: numAmount,
      frequency,
      billingDay: parseInt(billingDay, 10) || 1,
      categoryId: selectedCategoryId || 'cat-6',
      tags: selectedTags,
    });

    setName('');
    setAmount('');
    setIsCreating(false);
    setToastMessage('Suscripción agregada con éxito');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleTagSelection = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((item) => item !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
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
            <span className="text-2xl">📺</span>
            <h2 className="text-white font-black text-2xl">Suscripciones</h2>
          </div>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Top Summary Cards: Monthly vs Annual */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Monthly Card */}
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col">
            <span className="text-[#8E8E93] font-extrabold text-xs mb-1">Costo Mensual</span>
            <div className="text-white font-black text-lg tracking-tight flex items-baseline gap-1">
              <span>$</span>
              <AnimatedNumber value={monthlyTotal} duration={350} />
            </div>
            <span className="text-[#8E8E93] text-[11px] font-bold mt-1">/ mes</span>
          </div>

          {/* Annual Card */}
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col">
            <span className="text-[#8E8E93] font-extrabold text-xs mb-1">Costo Anual</span>
            <div className="text-white font-black text-lg tracking-tight flex items-baseline gap-1">
              <span>$</span>
              <AnimatedNumber value={annualTotal} duration={350} />
            </div>
            <span className="text-[#8E8E93] text-[11px] font-bold mt-1">/ año</span>
          </div>
        </div>

        {/* Push Notification Bar */}
        <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xs">Notificaciones Push</span>
              <span className="text-[#8E8E93] text-[11px] font-semibold">
                {hasNotificationPermission ? 'Notificaciones activas' : 'Avisos de vencimiento'}
              </span>
            </div>
          </div>

          {hasNotificationPermission ? (
            <button
              onClick={handleTestNotification}
              className="px-3 py-1.5 rounded-full bg-[#2A2A2C] border border-white/10 hover:border-white/20 text-white font-black text-xs active:scale-95 transition-transform"
            >
              Probar
            </button>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="px-3.5 py-1.5 rounded-full bg-[#34C759] hover:bg-[#2eb752] text-white font-black text-xs active:scale-95 transition-transform shadow-sm"
            >
              Activar
            </button>
          )}
        </div>

        {/* Add Subscription Form or Toggle Button */}
        {isCreating ? (
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3 mb-5 animate-slide-up">
            <h3 className="text-white font-extrabold text-sm mb-1">Nueva Suscripción</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-12 h-11 rounded-xl bg-[#2A2A2C] text-center text-xl text-white outline-none"
              />
              <input
                type="text"
                placeholder="Nombre (ej. Netflix)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-11 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Monto COP"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 h-11 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Día (1-31)"
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                className="w-24 h-11 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm text-center outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-xs outline-none"
              >
                <option value="monthly">Mensual</option>
                <option value="weekly">Semanal</option>
                <option value="bimonthly">Bimensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            {/* Tag Selection */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTagSelection(t)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedTags.includes(t)
                      ? 'bg-[#34C759] text-white'
                      : 'bg-[#2A2A2C] text-[#8E8E93]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-[#2A2A2C] text-white font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSubmit}
                className="px-4 py-2 rounded-xl bg-[#34C759] text-white font-extrabold text-xs"
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full h-12 rounded-2xl bg-[#1C1C1E] border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 text-white font-extrabold text-sm mb-5 active:scale-95 transition-transform"
          >
            <IconPlus className="w-4 h-4 text-white" />
            <span>Agregar Suscripción</span>
          </button>
        )}

        {/* Subscriptions List */}
        <div className="flex flex-col gap-3 my-auto pb-6">
          {subscriptions.length === 0 ? (
            <div className="text-center text-[#8E8E93] text-sm py-8 font-semibold">
              No tienes suscripciones activas
            </div>
          ) : (
            subscriptions.map((sub) => {
              const isPaidToday = sub.lastPaidDate === todayStr;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between shadow-sm"
                >
                  {/* Left Avatar & Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#242426] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {sub.emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-black text-base leading-tight">
                        {sub.name}
                      </span>
                      <span className="text-[#8E8E93] font-bold text-xs">
                        {sub.frequency === 'monthly' ? 'Mensual' : sub.frequency} • Día {sub.billingDay}
                      </span>
                      <div className="flex gap-1 mt-1">
                        {sub.tags.map((t) => (
                          <span key={t} className="text-[#8E8E93] text-[11px] font-extrabold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Amount & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[#E8505B] font-black text-base">
                      {formatAmount(-sub.amount)}
                    </span>

                    <div className="flex items-center gap-2">
                      {isPaidToday ? (
                        <div className="px-3 py-1 rounded-full bg-[#34C759]/20 border border-[#34C759]/40 text-[#34C759] font-black text-xs flex items-center gap-1">
                          <IconCheck className="w-3.5 h-3.5 text-[#34C759]" />
                          <span>Pagado</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePay(sub.id, sub.name)}
                          className="px-3.5 py-1.5 rounded-full bg-[#34C759] hover:bg-[#2eb752] text-white font-black text-xs active:scale-95 transition-transform shadow-sm"
                        >
                          Pagar
                        </button>
                      )}

                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="p-1.5 text-[#8E8E93] hover:text-[#E8505B] transition-colors"
                        aria-label="Delete"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
