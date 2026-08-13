import React from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconChevronDown } from '../common/Icons';

export const ShortcutsTutorialSheet: React.FC = () => {
  const { activeSheet, closeSheet } = useAppStore();

  if (activeSheet !== 'shortcuts_tutorial') return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131313] flex flex-col justify-between animate-fade-in overflow-y-auto no-scrollbar">
      <div className="w-full h-full max-w-[390px] mx-auto flex flex-col justify-between px-5 pt-[max(env(safe-area-inset-top,48px),48px)] pb-6 relative min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-white font-black text-2xl">Atajos & Botón de Acción</h2>
          </div>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar my-2">
          {/* Section 1: Botón de Acción con Prompt de Texto */}
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔘</span>
              <h3 className="text-white font-extrabold text-base">
                1. Botón de Acción (Prompt de Texto IA)
              </h3>
            </div>
            <p className="text-[#8E8E93] text-xs font-semibold leading-relaxed">
              Configura tu iPhone para que al mantener presionado el Botón de Acción te pregunte qué gastaste y Gemini IA lo registre automáticamente:
            </p>

            <ol className="flex flex-col gap-2.5 text-xs text-[#F5F5F7] font-bold pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  1
                </span>
                <span>Abre la app nativa <b>Atajos (Shortcuts)</b> en tu iPhone y toca el botón <b>+</b>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  2
                </span>
                <span>Busca y agrega la acción <b>"Solicitar entrada"</b> con el texto <i>"¿Qué gastaste?"</i>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  3
                </span>
                <span>Agrega la acción <b>"Abrir URL"</b> y pon la dirección: <code className="px-1.5 py-0.5 rounded bg-[#2A2A2C] text-[#34C759]">diner://prompt?text=Entrada</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  4
                </span>
                <span>En <b>Ajustes de iOS ➔ Botón de Acción</b>, asigna este nuevo atajo.</span>
              </li>
            </ol>

            <div className="p-3 rounded-xl bg-[#2A2A2C] text-xs font-semibold text-[#8E8E93]">
              💡 <b>Ejemplo:</b> Al presionar el Botón de Acción escribes: <i>"Me gasté 20000 en Dominos pizza #debito"</i> y DinER creará la transacción categorizada como <b>Comida 🍲</b> sin abrir la app.
            </div>
          </div>

          {/* Section 2: Apple Pay Automatizaciones */}
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <h3 className="text-white font-extrabold text-base">
                2. Automatización con Apple Pay
              </h3>
            </div>
            <p className="text-[#8E8E93] text-xs font-semibold leading-relaxed">
              Agrega automáticamente cada compra que realices con Apple Pay en tu iPhone:
            </p>

            <ol className="flex flex-col gap-2.5 text-xs text-[#F5F5F7] font-bold pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  1
                </span>
                <span>En la app <b>Atajos</b>, ve a la pestaña <b>Automatizaciones</b> ➔ Toca <b>+</b>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  2
                </span>
                <span>Selecciona el activador <b>"Al pagar con Apple Pay / Wallet"</b>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0 text-[11px] font-black">
                  3
                </span>
                <span>Agrega la acción <b>"Abrir URL"</b>: <code className="px-1.5 py-0.5 rounded bg-[#2A2A2C] text-[#34C759]">diner://prompt?text=Gasto de Monto en Comercio</code></span>
              </li>
            </ol>
          </div>

          {/* Section 3: Deep Link Reference */}
          <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-2">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">
              Comandos Rápidos Disponibles (URL Schemes)
            </h4>
            <div className="flex flex-col gap-1.5 text-xs font-mono text-[#8E8E93]">
              <div><span className="text-[#34C759]">diner://prompt?text=...</span> (Prompt IA automático)</div>
              <div><span className="text-[#34C759]">diner://voice</span> (Abre Voz Gemini IA)</div>
              <div><span className="text-[#34C759]">diner://add</span> (Abre modal de agregar)</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[#8E8E93] text-xs font-semibold pt-4">
          DinER Native iOS v4.0.0 • Integración Nativa con iOS Shortcuts
        </div>
      </div>
    </div>
  );
};
