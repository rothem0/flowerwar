import React from 'react';
import { HWATU_CARDS } from '../data/cards';
import { X, Award, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  completedCardIds: string[];
  onSelectCard: (id: string) => void;
}

export const BrainScoreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  completedCardIds,
  onSelectCard,
}) => {
  if (!isOpen) return null;

  const totalCards = HWATU_CARDS.length;
  const completedCount = completedCardIds.length;
  const progressPercent = Math.round((completedCount / totalCards) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF7] border-4 border-[#8B1E1E] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm mb-2">
            <Award className="w-4 h-4 text-red-700" />
            <span>오늘의 두뇌 건강 출석부</span>
          </div>
          <h2 className="text-3xl font-black text-stone-900">
            두뇌 활력 도장판
          </h2>
          <p className="text-stone-600 font-semibold text-base mt-1">
            화투패를 풀 때마다 참 잘했어요 매화 도장이 콕 찍힙니다!
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
          <div className="flex justify-between items-center mb-2 font-bold text-stone-800 text-base">
            <span>오늘의 완주율</span>
            <span className="text-red-700 font-black text-lg">
              {completedCount} / {totalCards} 완료 ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {completedCount === totalCards && (
            <div className="mt-3 text-center text-emerald-800 font-black text-base flex items-center justify-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>축하합니다! 오늘의 두뇌 운동을 모두 달성하셨습니다!</span>
            </div>
          )}
        </div>

        {/* Stamp Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {HWATU_CARDS.map((card) => {
            const isDone = completedCardIds.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => {
                  onSelectCard(card.id);
                  onClose();
                }}
                className={`relative p-3 rounded-2xl border-2 text-left transition-all ${
                  isDone
                    ? 'bg-amber-100/70 border-red-500 shadow-sm hover:scale-[1.02]'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="text-xs font-bold text-stone-500">{card.month}월 화투</div>
                <div className="text-base font-extrabold text-stone-900 line-clamp-1">{card.title.split(' ')[1]}</div>

                {/* Stamp Graphic */}
                {isDone ? (
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-black shadow">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>참 잘했어요!</span>
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-bold text-stone-400">
                    아직 도전 전
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-lg"
        >
          계속 풀기
        </button>
      </div>
    </div>
  );
};
