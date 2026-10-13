import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HwatuCard, CardDifference } from '../types/game';
import { ArrowRight, RotateCcw, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  card: HwatuCard;
  foundDifferences: CardDifference[];
  onNextCard: () => void;
  onRetry: () => void;
  onOpenStory: () => void;
}

export const CongratulationModal: React.FC<Props> = ({
  isOpen,
  card,
  foundDifferences,
  onNextCard,
  onRetry,
  onOpenStory,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebration confetti!
      const end = Date.now() + 1500;
      const colors = ['#FFD700', '#FF1744', '#00E676', '#FF9100', '#FFFFFF'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0.1, y: 0.6 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 0.9, y: 0.6 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF7] border-4 border-[#C92A2A] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-100 border-2 border-red-300 text-red-800 font-extrabold text-lg mb-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>두뇌 집중력 만점!</span>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7F1D1D] mb-2">
          참 잘하셨습니다! 👏
        </h2>
        <p className="text-lg sm:text-xl text-stone-700 font-bold mb-6">
          <span className="text-red-700 font-black">[{card.title}]</span>의 다른 곳을 모두 찾아내셨어요!
        </p>

        {/* Discovered Items List */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 mb-6 text-left">
          <h3 className="text-sm font-extrabold text-amber-900 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>어르신이 찾으신 다른 곳:</span>
          </h3>
          <ul className="space-y-2">
            {foundDifferences.map((diff, index) => (
              <li key={diff.id} className="flex items-start gap-2.5 text-stone-800 text-base font-semibold">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <span className="font-extrabold text-stone-900">{diff.name}:</span>{' '}
                  <span className="text-stone-700">{diff.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Big Next Button */}
          <button
            onClick={onNextCard}
            className="w-full py-4 px-6 rounded-2xl bg-[#C92A2A] hover:bg-[#A61E1E] active:scale-[0.98] text-white text-xl sm:text-2xl font-black shadow-lg flex items-center justify-center gap-3 transition-transform"
          >
            <span>다음 화투패 도전하기</span>
            <ArrowRight className="w-7 h-7" />
          </button>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onRetry}
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-base font-bold flex items-center justify-center gap-2 border border-stone-300"
            >
              <RotateCcw className="w-5 h-5 text-stone-600" />
              <span>다시 하기</span>
            </button>
            <button
              onClick={onOpenStory}
              className="py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-base font-bold flex items-center justify-center gap-2 border border-amber-300"
            >
              <BookOpen className="w-5 h-5 text-amber-800" />
              <span>화투패 이야기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
