import React from 'react';
import { HwatuCard } from '../types/game';
import { soundManager } from '../utils/sound';
import { X, Volume2, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  card: HwatuCard;
}

export const StoryModal: React.FC<Props> = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  const handleReadStory = () => {
    const textToRead = `${card.title}. ${card.subtitle}. ${card.story}`;
    soundManager.speak(textToRead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF7] border-4 border-[#8B1E1E] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center font-black text-sm">
            {card.month}월
          </span>
          <span className="text-stone-600 font-bold text-sm">재미있는 화투 이야기</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-1 flex items-center gap-2">
          {card.title}
        </h2>
        <p className="text-base font-bold text-red-700 mb-5">
          {card.subtitle}
        </p>

        {/* Story Content Box */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-5 mb-6 text-stone-800 text-lg sm:text-xl leading-relaxed font-medium">
          <p>{card.story}</p>
        </div>

        {/* Story Elements description */}
        <div className="mb-6 space-y-2">
          <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>화투패 속에 숨겨진 뜻:</span>
          </h4>
          <div className="text-stone-700 text-sm sm:text-base bg-stone-100 p-3 rounded-xl border border-stone-200">
            {card.differences.map((diff) => (
              <div key={diff.id} className="py-1">
                <span className="font-bold text-red-800">● {diff.name}:</span> {diff.description}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReadStory}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-900 font-extrabold text-base flex items-center justify-center gap-2 shadow"
          >
            <Volume2 className="w-5 h-5 text-red-800" />
            <span>이야기 소리내어 듣기</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-base"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
