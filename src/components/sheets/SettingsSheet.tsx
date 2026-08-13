import React from 'react';
import { useAppStore } from '@/lib/store';
import { requestNotificationPermission } from '@/lib/notifications';
import { IconClose, IconChevronDown } from '../common/Icons';

export const SettingsSheet: React.FC = () => {
  const { activeSheet, closeSheet, settings, updateSettings, openSheet } = useAppStore();

  if (activeSheet !== 'settings') return null;

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      alert('¡Notificaciones nativas activadas con éxito para tus suscripciones!');
    } else {
      alert('Por favor activa los permisos de notificaciones en los Ajustes de tu iPhone.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131313] flex flex-col justify-between animate-fade-in overflow-y-auto no-scrollbar">
      <div className="w-full h-full max-w-[390px] mx-auto flex flex-col justify-between px-5 pt-[max(env(safe-area-inset-top,48px),48px)] pb-6 relative min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <h2 className="text-white font-black text-2xl">Settings</h2>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 my-auto">
          {/* Shortcuts & Action Button Tutorial Option */}
          <button
            onClick={() => openSheet('shortcuts_tutorial')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div className="flex flex-col text-left">
                <span className="text-white font-extrabold">Atajos & Botón de Acción</span>
                <span className="text-[#8E8E93] text-xs font-semibold">Prompt IA, Apple Pay & Shortcuts</span>
              </div>
            </div>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* AI Memory Registry Option */}
          <button
            onClick={() => openSheet('ai_memory')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧠</span>
              <div className="flex flex-col text-left">
                <span className="text-white font-extrabold">Aprendizaje IA (AI Memory)</span>
                <span className="text-[#8E8E93] text-xs font-semibold">Reglas personalizadas de Gemini IA</span>
              </div>
            </div>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* Subscriptions Feature */}
          <button
            onClick={() => openSheet('subscriptions')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📺</span>
              <div className="flex flex-col text-left">
                <span className="text-white font-extrabold">Suscripciones</span>
                <span className="text-[#8E8E93] text-xs font-semibold">Gestionar y pagar suscripciones</span>
              </div>
            </div>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* Native Push Notifications Button */}
          <button
            onClick={handleEnableNotifications}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <div className="flex flex-col text-left">
                <span className="text-white font-extrabold">Notificaciones Nativas</span>
                <span className="text-[#8E8E93] text-xs font-semibold">Alertas (3 días, 1 día y hoy)</span>
              </div>
            </div>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* Categories */}
          <button
            onClick={() => openSheet('categories')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform"
          >
            <span>Categories</span>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* Tags */}
          <button
            onClick={() => openSheet('tags')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform"
          >
            <span>Tags</span>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* Budgets */}
          <button
            onClick={() => openSheet('budgets')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform"
          >
            <span>Budgets</span>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          {/* Lists */}
          <button
            onClick={() => openSheet('lists')}
            className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base active:scale-95 transition-transform"
          >
            <span>Lists & Accounts</span>
            <IconChevronDown className="w-5 h-5 text-[#8E8E93] -rotate-90" />
          </button>

          <div className="my-2 border-t border-white/10" />

          {/* Show Income Toggle */}
          <div className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base">
            <span>Show Income</span>
            <button
              onClick={() => updateSettings({ showIncome: !settings.showIncome })}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.showIncome ? 'bg-[#34C759]' : 'bg-[#2A2A2C]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.showIncome ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Rollover Toggle */}
          <div className="w-full h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between text-white font-bold text-base">
            <span>Rollover Balance</span>
            <button
              onClick={() => updateSettings({ rollover: !settings.rollover })}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.rollover ? 'bg-[#34C759]' : 'bg-[#2A2A2C]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.rollover ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[#8E8E93] text-xs font-bold pt-6">
          DinER Native iOS v4.0.0
        </div>
      </div>
    </div>
  );
};
