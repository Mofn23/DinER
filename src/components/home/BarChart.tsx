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

  // Determine height proportions (min 52px for capsules, max 280px for high bars)
  const maxTotal = Math.max(...categoryTotals.map((c) => c.total), 1);
  const MIN_CAPSULE_HEIGHT = 52;
  const MAX_HEIGHT = 280;

  return (
    <div className="my-4 overflow-x-auto no-scrollbar py-2">
      <div className="flex items-end gap-2.5 min-w-max px-1">
        {categoryTotals.map(({ category, total }) => {
          const heightRatio = total / maxTotal;
          const calculatedHeight = Math.round(heightRatio * MAX_HEIGHT);
          const isSelected = selectedCategoryFilter === category.id;

          // MonAI aesthetic: Short bars render as delicate horizontal capsules (52px high),
          // while taller bars stretch vertically up to 280px.
          const isTall = calculatedHeight > 76;
          const barHeight = isTall
            ? calculatedHeight
            : MIN_CAPSULE_HEIGHT;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ height: `${barHeight}px` }}
              className={`rounded-[22px] transition-all duration-150 active:scale-95 shrink-0 flex ${
                isTall
                  ? 'w-[86px] p-3 flex-col justify-end items-center'
                  : 'w-[92px] h-[52px] items-center justify-center px-2.5'
              } ${
                isSelected
                  ? 'bg-[#242426] ring-1 ring-white/20 shadow-sm'
                  : 'bg-[#1C1C1E] hover:bg-[#242426]'
              }`}
            >
              {isTall ? (
                /* Tall slender bar content */
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-[22px] leading-none select-none">
                    {category.emoji}
                  </span>
                  <span className="text-white font-extrabold text-[14px] tracking-tight">
                    {formatCompact(total)}
                  </span>
                </div>
              ) : (
                /* Short delicate capsule content (emoji + amount in horizontal row) */
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[20px] leading-none select-none">
                    {category.emoji}
                  </span>
                  <span className="text-white font-extrabold text-[14px] tracking-tight">
                    {formatCompact(total)}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
