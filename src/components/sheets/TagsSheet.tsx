import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose, IconCheck, IconTrash } from '../common/Icons';

export const TagsSheet: React.FC = () => {
  const { activeSheet, closeSheet, tags, addTag, deleteTag } = useAppStore();
  const [newTag, setNewTag] = useState('');

  if (activeSheet !== 'tags') return null;

  const handleAdd = () => {
    if (!newTag.trim()) return;
    addTag(newTag.trim());
    setNewTag('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
          <h1 className="text-[32px] font-black text-[#F5F5F7]">Tags</h1>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Input */}
        <div className="my-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="#New tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 h-12 px-4 rounded-2xl bg-[#1C1C1E] border border-white/10 text-white font-bold text-base outline-none"
          />
          <button
            onClick={handleAdd}
            className="w-12 h-12 rounded-2xl bg-[#34C759] flex items-center justify-center text-white shrink-0 active:scale-95"
          >
            <IconCheck className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2.5 my-2">
          {tags.map((t) => (
            <div
              key={t}
              className="px-4 py-2 rounded-full bg-[#1E1E20] border border-white/5 flex items-center gap-2 text-white font-bold text-sm"
            >
              <span>{t}</span>
              <button
                onClick={() => deleteTag(t)}
                className="text-[#8E8E93] hover:text-[#E8505B] transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
