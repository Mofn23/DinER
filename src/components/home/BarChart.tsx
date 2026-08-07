import React from 'react';
import { CategoryData } from '@/lib/initialData';
import { formatCompact } from '@/lib/utils';
import { IconClose } from '../common/Icons';

interface CategoryTotal {
  category: CategoryData;
  total: number;
}

interface BarChartProps {
  categoryTotals: CategoryTotal[];
  selectedCategoryFilter: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export const BarChart: React.FC<BarChartProps> = ({
  categoryTotals,
  selectedCategoryFilter,
  onSelectCategory,
}) => {
  // If a category filter is active, show the floating filter chip and hide the chart bar track
  if (selectedCategoryFilter) {
    const activeCategory = categoryTotals.find(
      (c) => c.category.id === selectedCategoryFilter
    )?.category;

    return (
      <div className="flex justify-end my-3 px-1">
        <button
          onClick={() => onSelectCategory(null)}
          className="h-10 px-4 rounded-full bg-[#2A2A2C] border border-white/10 flex items-center gap-2 text-white font-extrabold text-[15px] shadow-elevation active:scale-95 transition-all duration-150"
        >
          <span>{activeCategory?.emoji || '🏷️'}</span>
          <span>{activeCategory?.name}</span>
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
            <IconClose className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>
    );
  }

  if (categoryTotals.length === 0) {
    return (
      <div className="h-[120px] flex items-center justify-center text-[#8E8E93] text-sm my-3 font-semibold">
        No data for selected period
      </div>
    );
  }

  // Determine height proportions (min 72px, max 260px)
  const maxTotal = Math.max(...categoryTotals.map((c) => c.total), 1);
  const MIN_HEIGHT = 72;
  const MAX_HEIGHT = 220;

  return (
    <div className="my-4 overflow-x-auto no-scrollbar py-2">
      <div className="flex items-end gap-3 min-w-max px-1">
        {categoryTotals.map(({ category, total }) => {
          const heightRatio = total / maxTotal;
          const barHeight = Math.max(MIN_HEIGHT, Math.round(heightRatio * MAX_HEIGHT));
          const isSelected = selectedCategoryFilter === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ height: `${barHeight}px` }}
              className={`w-[108px] rounded-[24px] p-3 flex flex-col justify-end items-center transition-all duration-150 active:scale-95 shrink-0 ${
                isSelected ? 'bg-[#242426] ring-1 ring-white/20' : 'bg-[#1A1A1C]'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-[26px] leading-none select-none">{category.emoji}</span>
                <span className="text-white font-extrabold text-[17px] tracking-tight">
                  {formatCompact(total)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
