import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { AudioPlayState, LastReadCheckpoint } from '../types';

interface LectorControlPanelProps {
  audioState: AudioPlayState;
  checkpoint: LastReadCheckpoint;
  currentBookName: string;
  currentSegmentLabel: string;
  isCurrentChapterRead: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrevSegment: () => void;
  onNextSegment: () => void;
  onResumeCheckpoint: () => void;
  onChangeEngine: (engine: 'gemini_tts' | 'browser_tts') => void;
  onChangeVoice: (voice: string) => void;
  onChangeRate: (rate: number) => void;
  onChangeReadMode: (mode: 'both' | 'verses_only' | 'commentary_only') => void;
  onToggleContinuous: () => void;
  onMarkChapterRead: () => void;
}

export const LectorControlPanel: React.FC<LectorControlPanelProps> = ({
  audioState,
  checkpoint,
  currentBookName,
  currentSegmentLabel,
  isCurrentChapterRead,
  onPlayPause,
  onStop,
  onPrevSegment,
  onNextSegment,
  onResumeCheckpoint,
  onChangeEngine,
  onChangeVoice,
  onChangeRate,
  onChangeReadMode,
  onToggleContinuous,
  onMarkChapterRead,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
      {/* Top Row: Active Lector Status & Checkpoint Resume */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <Volume2 className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Lektor AI TTS (Rozdział po rozdziale i komentarz po komentarzu)
            </span>
            <span>·</span>
            <span>
              {audioState.engine === 'gemini_tts'
                ? `Gemini AI (${audioState.voiceName})`
                : 'Syntezator PL'}
            </span>
          </div>
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1 truncate">
            {audioState.isLoadingAudio
              ? 'Synteza głosu AI TTS...'
              : `${currentBookName} ${audioState.chapterNumber} · ${currentSegmentLabel}`}
          </p>
        </div>

        {/* Cross-Device Saved Checkpoint Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResumeCheckpoint}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-amber-950 dark:text-amber-200 hover:bg-amber-900/20 dark:hover:bg-amber-500/25 text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            title="Wróć dokładnie do miejsca, w którym zakończono czytanie na dowolnym urządzeniu"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>
              Wznów: {checkpoint.bookName} {checkpoint.chapterNumber} ({checkpoint.segmentLabel})
            </span>
          </button>

          <button
            type="button"
            onClick={onMarkChapterRead}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isCurrentChapterRead
                ? 'bg-emerald-900/10 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-700/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isCurrentChapterRead ? 'Rozdział przeczytany' : 'Oznacz rozdział'}</span>
          </button>
        </div>
      </div>

      {/* Transport Controls Row (Ergonomic 44px+ Mobile Touch Targets) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevSegment}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Poprzednia sekcja (rozdział / komentarz)"
            aria-label="Poprzednia sekcja"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-900 dark:bg-amber-600 text-white hover:bg-amber-800 dark:hover:bg-amber-500 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {audioState.isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pauza</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{audioState.isPaused ? 'Wznów lektora' : 'Czytaj całość (Lektor AI)'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNextSegment}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Następna sekcja (rozdział / komentarz)"
            aria-label="Następna sekcja"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {(audioState.isPlaying || audioState.isPaused) && (
            <button
              type="button"
              onClick={onStop}
              className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Zatrzymaj
            </button>
          )}
        </div>

        {/* Mode & Settings Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              type="button"
              onClick={() => onChangeReadMode('both')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                audioState.readMode === 'both'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Rozdział + Komentarz
            </button>
            <button
              type="button"
              onClick={() => onChangeReadMode('verses_only')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                audioState.readMode === 'verses_only'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Tylko Rozdział
            </button>
            <button
              type="button"
              onClick={() => onChangeReadMode('commentary_only')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                audioState.readMode === 'commentary_only'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Tylko Komentarz
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Opcje głosu</span>
          </button>
        </div>
      </div>

      {/* Expandable Voice, Speed & Auto-Advance Settings */}
      {showSettings && (
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Silnik Lektora AI
            </label>
            <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeEngine('gemini_tts')}
                className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors cursor-pointer ${
                  audioState.engine === 'gemini_tts'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Gemini AI TTS
              </button>
              <button
                type="button"
                onClick={() => onChangeEngine('browser_tts')}
                className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-colors cursor-pointer ${
                  audioState.engine === 'browser_tts'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Szybki Systemowy
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Barwa głosu Gemini TTS
            </label>
            <select
              value={audioState.voiceName}
              onChange={(e) => onChangeVoice(e.target.value)}
              className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700"
            >
              <option value="Kore">Kore (Spokojny, klasyczny)</option>
              <option value="Charon">Charon (Głęboki baryton)</option>
              <option value="Fenrir">Fenrir (Wyrazisty, narracyjny)</option>
              <option value="Puck">Puck (Jasny, dynamiczny)</option>
              <option value="Zephyr">Zephyr (Łagodny, kontemplacyjny)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Tempo czytania ({audioState.playbackRate}x)
            </label>
            <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {[0.85, 1, 1.15, 1.3].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChangeRate(rate)}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium tabular-nums transition-colors cursor-pointer ${
                    audioState.playbackRate === rate
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Ciągłość lektury
            </label>
            <button
              type="button"
              onClick={onToggleContinuous}
              className={`w-full min-h-[38px] px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${
                audioState.continuousMode
                  ? 'bg-emerald-950/10 dark:bg-emerald-500/15 border-emerald-700/30 text-emerald-900 dark:text-emerald-300'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {audioState.continuousMode
                ? 'Auto-przejście do kolejnego rozdziału: WŁ.'
                : 'Zatrzymaj po końcu rozdziału'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
