import React from 'react';
import { HWATU_CARDS } from '../data/cards';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Props {
  currentCardIndex: number;
  onSelectIndex: (idx: number) => void;
  completedCardIds: string[];
}

export const CardSelectorBar: React.FC<Props> = ({
  currentCardIndex,
  onSelectIndex,
  completedCardIds,
}) => {
  const handlePrev = () => {
    const prev = (currentCardIndex - 1 + HWATU_CARDS.length) % HWATU_CARDS.length;
    onSelectIndex(prev);
  };

  const handleNext = () => {
    const next = (currentCardIndex + 1) % HWATU_CARDS.length;
    onSelectIndex(next);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        {/* Previous Card Button */}
        <button
          onClick={handlePrev}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 font-extrabold text-sm sm:text-base border border-amber-300 shadow flex items-center gap-1 shrink-0"
          title="이전 화투패"
        >
          <ChevronLeft className="w-5 h-5 text-red-800" />
          <span className="hidden sm:inline">이전 패</span>
        </button>

        {/* Card Pills Grid */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 no-scrollbar justify-center flex-1">
          {HWATU_CARDS.map((card, idx) => {
            const isCurrent = idx === currentCardIndex;
            const isDone = completedCardIds.includes(card.id);

            return (
              <button
                key={card.id}
                onClick={() => onSelectIndex(idx)}
                className={`relative px-3 sm:px-4 py-2 rounded-xl font-extrabold text-sm sm:text-base whitespace-nowrap transition-all shadow-sm ${
                  isCurrent
                    ? 'bg-[#C92A2A] text-white ring-3 ring-amber-400 scale-105 z-10'
                    : 'bg-white hover:bg-amber-50 text-stone-800 border border-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{card.month}월</span>
                  <span className="hidden md:inline">{card.title.split(' ')[1]}</span>
                  {isDone && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Card Button */}
        <button
          onClick={handleNext}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 font-extrabold text-sm sm:text-base border border-amber-300 shadow flex items-center gap-1 shrink-0"
          title="다음 화투패"
        >
          <span className="hidden sm:inline">다음 패</span>
          <ChevronRight className="w-5 h-5 text-red-800" />
        </button>
      </div>
    </div>
  );
};
