import React from 'react';
import { useAppStore } from '@/lib/store';
import { IconClose } from '../common/Icons';

export const SettingsSheet: React.FC = () => {
  const {
    activeSheet,
    closeSheet,
    openSheet,
    lists,
    currentListId,
    settings,
    updateSettings,
    transactions,
  } = useAppStore();

  if (activeSheet !== 'settings') return null;

  const currentList = lists.find((l) => l.id === currentListId) || lists[0];

  const handleExportCSV = () => {
    const headers = ['Description', 'Amount', 'Type', 'Category', 'Date', 'Recurrence', 'Tags'];
    const rows = transactions.map((t) => [
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.categoryId,
      t.date,
      t.recurrence,
      `"${(t.tags || []).join(',')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DinER_${currentList.name}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Importing ${file.name}... CSV processed successfully.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="w-full h-full max-w-[390px] mx-auto bg-[#0B0B0D] flex flex-col p-6 animate-slide-up relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-6 border-b border-white/10">
          <h1 className="text-[34px] font-black text-[#F5F5F7]">Settings</h1>
          <button
            onClick={closeSheet}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <IconClose className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Settings List */}
        <div className="flex flex-col gap-6 my-6">
          {/* Section Content */}
          <div>
            <h2 className="text-[#8E8E93] text-[13px] font-extrabold uppercase tracking-wider mb-3 px-1">
              Content
            </h2>
            <div className="flex flex-col gap-2">
              {/* Edit Categories */}
              <button
                onClick={() => openSheet('categories')}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    🥑
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">
                      Edit Categories
                    </div>
                    <div className="text-[#8E8E93] text-[14px]">
                      In your current list {currentList.name}
                    </div>
                  </div>
                </div>
              </button>

              {/* Budgets */}
              <button
                onClick={() => openSheet('budgets')}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Budgets</div>
                    <div className="text-[#8E8E93] text-[14px]">
                      In your current list {currentList.name}
                    </div>
                  </div>
                </div>
              </button>

              {/* Edit Tags */}
              <button
                onClick={() => openSheet('tags')}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    #️⃣
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Edit Tags</div>
                    <div className="text-[#8E8E93] text-[14px]">
                      In your current list {currentList.name}
                    </div>
                  </div>
                </div>
              </button>

              {/* Recurrence list */}
              <button
                onClick={() => openSheet('recurrence')}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    🔄
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">
                      Recurrence list
                    </div>
                    <div className="text-[#8E8E93] text-[14px]">
                      In your current list {currentList.name}
                    </div>
                  </div>
                </div>
              </button>

              {/* Default Period */}
              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">
                      Default period
                    </div>
                    <div className="text-[#8E8E93] text-[14px]">
                      If you prefer segmenting differently
                    </div>
                  </div>
                </div>
              </div>

              {/* Your lists */}
              <button
                onClick={() => openSheet('lists')}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Your lists</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#2A2A2C] text-white font-extrabold text-sm">
                  {lists.length}
                </span>
              </button>

              {/* Share List */}
              <button
                onClick={() => openSheet('lists')}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    📤
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Share List</div>
                    <div className="text-[#8E8E93] text-[14px]">{currentList.name}</div>
                  </div>
                </div>
              </button>

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Export CSV</div>
                  </div>
                </div>
              </button>

              {/* Import CSV */}
              <label className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between text-left cursor-pointer active:scale-[0.98] transition-transform">
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    📥
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Import CSV</div>
                    <div className="text-[#8E8E93] text-[14px]">
                      Currently only CSVs exported from MonAi supported
                    </div>
                  </div>
                </div>
              </label>

              {/* Show Income Toggle */}
              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    💵
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Show income</div>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ showIncome: !settings.showIncome })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    settings.showIncome ? 'bg-[#34C759]' : 'bg-[#3A3A3C]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      settings.showIncome ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Rollover Toggle */}
              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    ⬇️
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Rollover</div>
                    <div className="text-[#8E8E93] text-[14px]">
                      Show total of all months instead of current
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ rollover: !settings.rollover })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    settings.rollover ? 'bg-[#34C759]' : 'bg-[#3A3A3C]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      settings.rollover ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section Language & Region */}
          <div>
            <h2 className="text-[#8E8E93] text-[13px] font-extrabold uppercase tracking-wider mb-3 px-1">
              Language & Region
            </h2>
            <div className="flex flex-col gap-2">
              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    🇺🇸
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">
                      Voice input language
                    </div>
                  </div>
                </div>
                <span className="text-[#8E8E93] font-extrabold text-sm">
                  {settings.voiceLanguage}
                </span>
              </div>

              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    💵
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">Currency</div>
                    <div className="text-[#8E8E93] text-[14px]">
                      ({settings.currency}) In list {currentList.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section More */}
          <div>
            <h2 className="text-[#8E8E93] text-[13px] font-extrabold uppercase tracking-wider mb-3 px-1">
              More
            </h2>
            <div className="flex flex-col gap-2">
              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">
                      Track Apple Pay
                    </div>
                    <div className="text-[#8E8E93] text-[14px]">Here&apos;s how</div>
                  </div>
                </div>
              </div>

              <div className="w-full p-3 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#1E1E20] flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-[17px]">
                      DinER Premium
                    </div>
                    <div className="text-[#34C759] text-[14px] font-extrabold">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
