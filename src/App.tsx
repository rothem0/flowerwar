import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HWATU_CARDS } from './data/cards';
import { Difficulty, CardDifference } from './types/game';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { CardSelectorBar } from './components/CardSelectorBar';
import { HwatuCardSVG } from './components/HwatuCardSVG';
import { CongratulationModal } from './components/CongratulationModal';
import { StoryModal } from './components/StoryModal';
import { BrainScoreModal } from './components/BrainScoreModal';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  HeartHandshake,
} from 'lucide-react';

export default function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [foundDiffIds, setFoundDiffIds] = useState<string[]>([]);
  const [hintDiffId, setHintDiffId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isCongratulationOpen, setIsCongratulationOpen] = useState(false);
  const [completedCardIds, setCompletedCardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hwatu_completed_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentCard = HWATU_CARDS[currentCardIndex];

  // Sync sound manager settings
  useEffect(() => {
    soundManager.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    soundManager.speechEnabled = speechEnabled;
  }, [speechEnabled]);

  // Save completed cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hwatu_completed_cards', JSON.stringify(completedCardIds));
    } catch {
      // Ignore storage errors in sandbox
    }
  }, [completedCardIds]);

  // Determine active differences based on difficulty
  const activeDifferenceIds = useMemo(() => {
    const count = difficulty === 'easy' ? 1 : difficulty === 'normal' ? 2 : 3;
    return currentCard.differences.slice(0, count).map((d) => d.id);
  }, [difficulty, currentCard]);

  const activeDifferences = useMemo(() => {
    return currentCard.differences.filter((d) => activeDifferenceIds.includes(d.id));
  }, [currentCard, activeDifferenceIds]);

  // Clear found state when card or difficulty changes
  const resetRound = useCallback(() => {
    setFoundDiffIds([]);
    setHintDiffId(null);
    setIsRevealed(false);
    setIsCongratulationOpen(false);
  }, []);

  useEffect(() => {
    resetRound();
    // Welcome speech for new card
    const targetCount = difficulty === 'easy' ? 1 : difficulty === 'normal' ? 2 : 3;
    const msg = `${currentCard.title}입니다. 두 화투패에서 다른 곳 ${targetCount}군데를 찾아 눌러보세요.`;
    soundManager.speak(msg);
  }, [currentCardIndex, difficulty, resetRound]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Card click handler (works for either left or right card!)
  const handleCardClick = (svgX: number, svgY: number) => {
    if (isCongratulationOpen) return;

    // Check against active differences
    let matchedDiff: CardDifference | null = null;

    for (const diff of activeDifferences) {
      const dist = Math.hypot(svgX - diff.x, svgY - diff.y);
      // Generous touch tolerance for seniors (diff.radius + 16px)
      if (dist <= diff.radius + 16) {
        matchedDiff = diff;
        break;
      }
    }

    if (matchedDiff) {
      if (foundDiffIds.includes(matchedDiff.id)) {
        // Already found
        soundManager.playCardTap();
        showToast(`이미 찾으신 '${matchedDiff.name}'입니다! 참 잘하셨어요.`);
      } else {
        // Newly found!
        const newFound = [...foundDiffIds, matchedDiff.id];
        setFoundDiffIds(newFound);
        setHintDiffId(null);

        soundManager.playCorrectChime();
        soundManager.speak(`참 잘하셨어요! ${matchedDiff.name}을(를) 찾으셨습니다!`);
        showToast(`👏 찾았다! [${matchedDiff.name}]`);

        // Check if all active differences are found
        if (newFound.length >= activeDifferences.length) {
          if (!completedCardIds.includes(currentCard.id)) {
            setCompletedCardIds((prev) => [...prev, currentCard.id]);
          }

          setTimeout(() => {
            soundManager.playCelebrationFanfare();
            soundManager.speak('참 대단하십니다! 모든 다른 곳을 다 찾으셨어요!');
            setIsCongratulationOpen(true);
          }, 600);
        }
      }
    } else {
      // Clicked on identical part
      soundManager.playCardTap();
      showToast('여기는 서로 같아요~ 다른 곳을 천천히 둘러보세요 😊');
    }
  };

  // Hint button handler
  const handleUseHint = () => {
    const unfound = activeDifferences.find((d) => !foundDiffIds.includes(d.id));
    if (!unfound) {
      showToast('모든 다른 곳을 이미 다 찾으셨습니다!');
      return;
    }

    setHintDiffId(unfound.id);
    soundManager.playHintChime();
    soundManager.speak(`힌트입니다. ${unfound.hintText}`);
    showToast(`💡 힌트: ${unfound.hintText}`);
  };

  const handleToggleReveal = () => {
    setIsRevealed((prev) => !prev);
    if (!isRevealed) {
      soundManager.speak('정답 위치를 표시해 드렸습니다.');
    }
  };

  const handleNextCard = () => {
    setIsCongratulationOpen(false);
    const next = (currentCardIndex + 1) % HWATU_CARDS.length;
    setCurrentCardIndex(next);
  };

  const remainingCount = activeDifferences.length - foundDiffIds.length;

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2C2523] flex flex-col selection:bg-amber-300">
      {/* Accessible Header */}
      <Header
        speechEnabled={speechEnabled}
        onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onUseHint={handleUseHint}
        onToggleReveal={handleToggleReveal}
        isRevealed={isRevealed}
        onOpenStory={() => setIsStoryModalOpen(true)}
        onOpenScore={() => setIsScoreModalOpen(true)}
        difficulty={difficulty}
        onChangeDifficulty={(d) => setDifficulty(d)}
        remainingCount={remainingCount}
        totalCount={activeDifferences.length}
      />

      {/* Card Selector Pills */}
      <div className="bg-[#EFE7DA] border-b border-stone-300 py-1 shadow-sm">
        <CardSelectorBar
          currentCardIndex={currentCardIndex}
          onSelectIndex={(idx) => setCurrentCardIndex(idx)}
          completedCardIds={completedCardIds}
        />
      </div>

      {/* Main Play Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col items-center">
        {/* Current Round Status Bar */}
        <div className="w-full max-w-4xl bg-white/90 border-2 border-amber-300/80 rounded-2xl p-4 mb-4 shadow-md flex flex-wrap items-center justify-between gap-3">
          {/* Card Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#C92A2A] text-white font-extrabold text-sm">
                {currentCard.month}월
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {currentCard.title}
              </h2>
            </div>
            <p className="text-stone-600 text-sm font-semibold mt-0.5">
              {currentCard.subtitle}
            </p>
          </div>

          {/* Finding Progress Badges */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-stone-500">다른 곳 찾기 현황</div>
              <div className="text-xl sm:text-2xl font-black text-[#C92A2A]">
                {foundDiffIds.length} / {activeDifferences.length}개 찾음
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5">
              {activeDifferences.map((diff, index) => {
                const isFound = foundDiffIds.includes(diff.id);
                return (
                  <div
                    key={diff.id}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-sm transition-all ${
                      isFound
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105'
                        : 'bg-stone-200 text-stone-600 border border-stone-300'
                    }`}
                    title={isFound ? diff.name : `${index + 1}번째 다른 곳`}
                  >
                    {isFound ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Zoom / Card size toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 shadow-sm ml-1"
              title="화투패 크게 보기"
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Guidance Instruction Banner */}
        <div className="mb-4 text-center">
          <p className="text-lg sm:text-xl font-extrabold text-[#7F1D1D] bg-red-100/90 border border-red-300/80 px-6 py-2 rounded-full inline-flex items-center gap-2 shadow-sm animate-gentle-pulse">
            <Volume2 className="w-5 h-5 text-red-700 shrink-0" />
            <span>
              양쪽 화투패 중에서 <strong>서로 다른 곳을 손가락이나 마우스로 콕</strong> 눌러보세요!
            </span>
          </p>
        </div>

        {/* Traditional Korean Hwatu Mat (전통 녹색 화투 모포 / 담요) */}
        <div
          className={`w-full max-w-6xl rounded-3xl p-4 sm:p-8 shadow-2xl border-8 border-[#3A1E16] transition-all duration-300 ${
            isZoomed ? 'scale-105 my-4' : ''
          }`}
          style={{
            backgroundColor: '#1E4620', // Traditional deep green felt mat
            backgroundImage: 'radial-gradient(#2E6032 15%, transparent 16%)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Mat center decorative gold thread border */}
          <div className="w-full h-full border-2 border-dashed border-amber-400/40 rounded-2xl p-3 sm:p-6 flex flex-col md:flex-row items-center justify-around gap-6 sm:gap-10">
            {/* LEFT CARD: Original */}
            <div className="flex-1 flex justify-center">
              <HwatuCardSVG
                card={currentCard}
                isModified={false}
                activeDifferenceIds={activeDifferenceIds}
                foundDiffIds={foundDiffIds}
                hintDiffId={hintDiffId}
                revealedDiffIds={isRevealed ? activeDifferenceIds : []}
                onCardClick={handleCardClick}
                label="원래 화투패 (기준)"
              />
            </div>

            {/* CENTER DIVIDER / VERSUS BADGE */}
            <div className="flex flex-col items-center justify-center gap-2 shrink-0 py-2">
              <div className="w-14 h-14 rounded-full bg-amber-400 border-4 border-amber-200 text-red-950 font-black text-xl flex items-center justify-center shadow-lg">
                VS
              </div>
              <span className="text-amber-200 text-xs sm:text-sm font-extrabold tracking-widest bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
                어느 쪽을 눌러도 정답!
              </span>
            </div>

            {/* RIGHT CARD: Modified with differences */}
            <div className="flex-1 flex justify-center">
              <HwatuCardSVG
                card={currentCard}
                isModified={true}
                activeDifferenceIds={activeDifferenceIds}
                foundDiffIds={foundDiffIds}
                hintDiffId={hintDiffId}
                revealedDiffIds={isRevealed ? activeDifferenceIds : []}
                onCardClick={handleCardClick}
                label="다른 화투패 (찾아보세요!)"
              />
            </div>
          </div>
        </div>

        {/* Found Differences Review List Below Mat */}
        <div className="w-full max-w-4xl mt-6 bg-white/80 border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>현재 화투패의 다른 곳 확인:</span>
            </h3>
            <button
              onClick={resetRound}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold flex items-center gap-1 border border-stone-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>이 패 처음부터 다시 하기</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {activeDifferences.map((diff, idx) => {
              const isFound = foundDiffIds.includes(diff.id);
              return (
                <div
                  key={diff.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isFound
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-stone-50 border-stone-200 text-stone-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-extrabold text-sm mb-1">
                    <span>
                      {idx + 1}. {diff.name}
                    </span>
                    {isFound ? (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        ✓ 찾음!
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400 bg-stone-200 px-2 py-0.5 rounded-md">
                        찾는 중
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-stone-600 line-clamp-2">
                    {isFound || isRevealed ? diff.description : '화투패를 잘 살펴보고 눌러보세요.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Senior Care & Dementia Support Message */}
        <footer className="mt-8 mb-6 text-center text-stone-500 text-sm flex items-center justify-center gap-2">
          <HeartHandshake className="w-5 h-5 text-red-700" />
          <span>
            어르신의 뇌 건강을 위해 천천히, 즐거운 마음으로 풀어보세요. 틀려도 아무런 감점이 없습니다!
          </span>
        </footer>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 text-amber-200 px-6 py-3 rounded-2xl shadow-2xl text-base sm:text-lg font-extrabold border-2 border-amber-400 backdrop-blur-md animate-gentle-pulse max-w-md text-center">
          {toastMessage}
        </div>
      )}

      {/* Congratulation Modal */}
      <CongratulationModal
        isOpen={isCongratulationOpen}
        card={currentCard}
        foundDifferences={activeDifferences}
        onNextCard={handleNextCard}
        onRetry={resetRound}
        onOpenStory={() => {
          setIsCongratulationOpen(false);
          setIsStoryModalOpen(true);
        }}
      />

      {/* Story Modal */}
      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        card={currentCard}
      />

      {/* Brain Workout / Stamp Board Modal */}
      <BrainScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        completedCardIds={completedCardIds}
        onSelectCard={(id) => {
          const idx = HWATU_CARDS.findIndex((c) => c.id === id);
          if (idx !== -1) {
            setCurrentCardIndex(idx);
          }
        }}
      />
    </div>
  );
}
