import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, Lightbulb, Eye, BookOpen, Award } from 'lucide-react';
import { Difficulty } from '../types/game';

interface Props {
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUseHint: () => void;
  onToggleReveal: () => void;
  isRevealed: boolean;
  onOpenStory: () => void;
  onOpenScore: () => void;
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  remainingCount: number;
  totalCount: number;
}

export const Header: React.FC<Props> = ({
  speechEnabled,
  onToggleSpeech,
  soundEnabled,
  onToggleSound,
  onUseHint,
  onToggleReveal,
  isRevealed,
  onOpenStory,
  onOpenScore,
  difficulty,
  onChangeDifficulty,
  remainingCount,
  totalCount,
}) => {
  return (
    <header className="w-full bg-[#8B1E1E] text-amber-50 shadow-lg border-b-4 border-[#5E1212]">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-red-900 font-extrabold text-2xl shadow-inner">
            光
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center gap-2">
              효도 두뇌 화투 틀린그림찾기
            </h1>
            <p className="text-xs sm:text-sm text-amber-200 font-medium">
              어르신 집중력 향상과 치매 예방을 위한 건강 두뇌 놀이
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* TTS Audio Toggle */}
          <button
            onClick={onToggleSpeech}
            className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              speechEnabled
                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }`}
            title="목소리 안내 켜기/끄기"
          >
            {speechEnabled ? <Volume2 className="w-5 h-5 text-red-800" /> : <VolumeX className="w-5 h-5" />}
            <span>음성 안내 {speechEnabled ? '켜짐' : '꺼짐'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              soundEnabled
                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }`}
            title="효과음 켜기/끄기"
          >
            {soundEnabled ? <Bell className="w-5 h-5 text-red-800" /> : <BellOff className="w-5 h-5" />}
            <span>효과음</span>
          </button>

          {/* Story Button */}
          <button
            onClick={onOpenStory}
            className="px-3 py-2 rounded-xl text-sm font-bold bg-amber-100 text-amber-950 hover:bg-amber-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <BookOpen className="w-5 h-5 text-amber-800" />
            <span>화투 이야기</span>
          </button>

          {/* Workout Certificate / Stamp */}
          <button
            onClick={onOpenScore}
            className="px-3 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span>두뇌 도장판</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Difficulty & Quick Action Bar */}
      <div className="bg-[#6B1414] py-2 px-4 border-t border-red-900/50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Difficulty Selector */}
          <div className="flex items-center gap-2">
            <span className="text-amber-200 font-bold text-sm sm:text-base mr-1">
              난이도 선택:
            </span>
            <button
              onClick={() => onChangeDifficulty('easy')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                difficulty === 'easy'
                  ? 'bg-amber-300 text-amber-950 ring-2 ring-white shadow-md'
                  : 'bg-red-900/70 text-amber-100 hover:bg-red-800'
              }`}
            >
              쉬움 (1개)
            </button>
            <button
              onClick={() => onChangeDifficulty('normal')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                difficulty === 'normal'
                  ? 'bg-amber-300 text-amber-950 ring-2 ring-white shadow-md'
                  : 'bg-red-900/70 text-amber-100 hover:bg-red-800'
              }`}
            >
              보통 (2개)
            </button>
            <button
              onClick={() => onChangeDifficulty('hard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                difficulty === 'hard'
                  ? 'bg-amber-300 text-amber-950 ring-2 ring-white shadow-md'
                  : 'bg-red-900/70 text-amber-100 hover:bg-red-800'
              }`}
            >
              도전 (3개)
            </button>
          </div>

          {/* In-game helper buttons: Hint & Reveal Answer */}
          <div className="flex items-center gap-2">
            <button
              onClick={onUseHint}
              disabled={remainingCount === 0}
              className={`px-4 py-1.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center gap-1.5 shadow-md transition-all ${
                remainingCount === 0
                  ? 'bg-stone-500 text-stone-300 cursor-not-allowed opacity-60'
                  : 'bg-amber-400 hover:bg-amber-300 text-stone-900 active:scale-95 animate-pulse'
              }`}
            >
              <Lightbulb className="w-5 h-5 text-amber-900 fill-amber-900" />
              <span>힌트 보기 💡</span>
            </button>

            <button
              onClick={onToggleReveal}
              className={`px-3 py-1.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-1.5 shadow transition-all ${
                isRevealed
                  ? 'bg-rose-700 text-white hover:bg-rose-600'
                  : 'bg-stone-700/80 hover:bg-stone-600 text-amber-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isRevealed ? '정답 숨기기' : '정답 확인'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
