import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconPlus, IconTrash, IconCheck } from '../common/Icons';

export const AiMemorySheet: React.FC = () => {
  const { activeSheet, closeSheet, aiMemory, addAiRule, deleteAiRule, categories } = useAppStore();

  const [newPhrase, setNewPhrase] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');

  if (activeSheet !== 'ai_memory') return null;

  const handleAddRule = () => {
    if (!newPhrase.trim() || !selectedCatId) return;
    addAiRule(newPhrase.trim(), selectedCatId);
    setNewPhrase('');
  };

  const rulesList = Object.entries(aiMemory);

  return (
    <div className="fixed inset-0 z-50 bg-[#131313] flex flex-col justify-between animate-fade-in overflow-y-auto no-scrollbar">
      <div className="w-full h-full max-w-[390px] mx-auto flex flex-col justify-between px-5 pt-[max(env(safe-area-inset-top,48px),48px)] pb-6 relative min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h2 className="text-white font-black text-2xl">Aprendizaje IA</h2>
          </div>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Add New Rule Form */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col gap-3 mb-4">
          <span className="text-white font-extrabold text-sm">Añadir nueva regla de IA</span>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder='Frase clave (ej: "mi niña")'
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none border border-white/5 focus:border-white/20"
            />

            <div className="flex items-center gap-2">
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="flex-1 h-11 px-3 rounded-xl bg-[#2A2A2C] text-white font-bold text-sm outline-none border border-white/5"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddRule}
                disabled={!newPhrase.trim()}
                className={`h-11 px-4 rounded-xl flex items-center gap-1.5 font-extrabold text-sm text-white ${
                  !newPhrase.trim() ? 'bg-[#2A2A2C] opacity-50 cursor-not-allowed' : 'bg-[#34C759] active:scale-95'
                }`}
              >
                <IconPlus className="w-4 h-4 text-white" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Rules List */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2.5 my-2">
          <span className="text-[#8E8E93] text-xs font-bold uppercase tracking-wider px-1">
            Reglas Guardadas ({rulesList.length})
          </span>

          {rulesList.length === 0 ? (
            <div className="p-6 text-center text-[#8E8E93] font-semibold text-sm">
              No hay reglas registradas aún. Al categorizar transacciones, la IA aprenderá automáticamente de tus frases.
            </div>
          ) : (
            rulesList.map(([phrase, catId]) => {
              const catObj = categories.find((c) => c.id === catId);
              return (
                <div
                  key={phrase}
                  className="h-14 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-extrabold text-sm capitalize">"{phrase}"</span>
                    <span className="text-[#8E8E93] text-xs font-bold">➔</span>
                    <div className="px-3 py-1 rounded-full bg-[#2A2A2C] flex items-center gap-1.5 text-white font-bold text-xs">
                      <span>{catObj?.emoji || '🏷️'}</span>
                      <span>{catObj?.name || 'Categoría'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAiRule(phrase)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#E8505B] hover:bg-[#E8505B]/20 transition-colors"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[#8E8E93] text-xs font-semibold pt-4">
          La IA aprende tus costumbres en tiempo real. Gemini 2.0 Flash se ajusta a tus reglas guardadas.
        </div>
      </div>
    </div>
  );
};
