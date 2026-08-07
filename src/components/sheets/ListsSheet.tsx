import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconCheck, IconPlus, IconShare } from '../common/Icons';

export const ListsSheet: React.FC = () => {
  const {
    activeSheet,
    closeSheet,
    lists,
    currentListId,
    setCurrentListId,
    addList,
    transactions,
  } = useAppStore();

  const [newListName, setNewListName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (activeSheet !== 'lists') return null;

  const handleCreate = () => {
    if (!newListName.trim()) return;
    addList(newListName.trim());
    setNewListName('');
    setIsAdding(false);
  };

  const handleShare = (listName: string) => {
    if (navigator.share) {
      navigator.share({
        title: `DinER - ${listName}`,
        text: `Join my financial list ${listName} on DinER!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(`Share link for "${listName}" copied to clipboard!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <h1 className="text-[32px] font-black text-[#F5F5F7]">Your lists</h1>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Add list button / input */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="my-4 h-12 rounded-2xl bg-[#1C1C1E] border border-white/10 flex items-center justify-center gap-2 text-white font-extrabold text-[15px] active:scale-95 transition-transform"
          >
            <IconPlus className="w-5 h-5 text-[#34C759]" />
            <span>Create New List</span>
          </button>
        ) : (
          <div className="my-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="flex-1 h-12 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 text-white font-bold text-base outline-none"
            />
            <button
              onClick={handleCreate}
              className="w-12 h-12 rounded-2xl bg-[#34C759] flex items-center justify-center text-white shrink-0 active:scale-95"
            >
              <IconCheck className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {/* Lists grid */}
        <div className="flex flex-col gap-3 my-2">
          {lists.map((l) => {
            const isActive = l.id === currentListId;
            const count = transactions.filter((t) => t.listId === l.id).length;

            return (
              <div
                key={l.id}
                onClick={() => {
                  setCurrentListId(l.id);
                  closeSheet();
                }}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#2A2A2C] border-white/20'
                    : 'bg-[#1C1C1E] border-white/5 hover:bg-[#242426]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isActive && <IconCheck className="w-5 h-5 text-[#34C759]" />}
                  <div>
                    <div className="text-white font-extrabold text-[17px]">{l.name}</div>
                    <div className="text-[#8E8E93] text-[13px] font-bold">
                      {count} transactions · {l.currency}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(l.name);
                  }}
                  className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white active:scale-95"
                >
                  <IconShare className="w-5 h-5 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
