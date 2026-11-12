import React from 'react';
import {
  BookOpen,
  Compass,
  Globe,
  Landmark,
  Languages,
  Leaf,
  ScrollText,
  Sparkles,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { ChapterCommentary } from '../types';

interface CommentarySectionProps {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  commentary: ChapterCommentary;
  activeSegmentType: 'verse' | 'commentary' | null;
  activeSegmentIndex: number;
  readSegments: string[];
  isExpandingAI: boolean;
  onExpandWithAI: () => void;
  onPlayCommentaryBlock: (blockIndex: number) => void;
  onToggleSegmentRead: (segmentKey: string) => void;
}

export const CommentarySection: React.FC<CommentarySectionProps> = ({
  bookId,
  bookName,
  chapterNumber,
  commentary,
  activeSegmentType,
  activeSegmentIndex,
  readSegments,
  isExpandingAI,
  onExpandWithAI,
  onPlayCommentaryBlock,
  onToggleSegmentRead,
}) => {
  const getBlockIcon = (id: string) => {
    switch (id) {
      case 'exegesis':
        return <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      case 'linguistics':
        return <Languages className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      case 'geopolitics':
        return <Globe className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      case 'history':
        return <Landmark className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      case 'geography':
        return <Compass className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      case 'faunaFlora':
        return <Leaf className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      case 'culture':
        return <ScrollText className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
      default:
        return <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />;
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-stone-200 dark:border-stone-800">
      {/* Header & AI Deep Exegesis Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
            Hermeneutyka · Filologia · Kontekst Historyczno-Kulturowy
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Komentarz Egzegetyczny: {bookName} {chapterNumber}
          </h2>
        </div>

        <button
          type="button"
          onClick={onExpandWithAI}
          disabled={isExpandingAI}
          className="min-h-[44px] px-4 py-2.5 rounded-xl border border-amber-800/30 dark:border-amber-500/30 bg-amber-900/5 dark:bg-amber-500/10 text-amber-950 dark:text-amber-200 hover:bg-amber-900/10 dark:hover:bg-amber-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            {isExpandingAI
              ? 'Generowanie pogłębionej egzegezy...'
              : 'Pogłęb opracowanie rozdziału (AI)'}
          </span>
        </button>
      </div>

      {/* 1. Original Vocabulary Grid: Hebrew, Aramaic, Greek, Latin */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Languages className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span>Słownictwo Źródłowe: Hebrajski · Aramejski · Grecki · Łaciński</span>
          </h3>
          <button
            type="button"
            onClick={() => onPlayCommentaryBlock(1)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium text-amber-900 dark:text-amber-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Czytaj słownictwo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commentary.linguistics.map((term, idx) => (
            <div
              key={`${term.transliteration}-${idx}`}
              className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="font-biblical text-xl sm:text-2xl font-semibold text-amber-950 dark:text-amber-300">
                  {term.original}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0">
                  Język {term.language}
                </span>
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-300 font-medium mb-2">
                Transliteracja: <span className="italic">{term.transliteration}</span> · Znaczenie:{' '}
                <span className="text-stone-900 dark:text-stone-100 font-semibold">
                  „{term.meaning}”
                </span>
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {term.theologicalContext}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sequential Commentary Blocks (Read one by one by AI TTS Lector) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
            Sekcje Komentarza (czytane kolejno przez Lektora AI TTS)
          </p>
        </div>

        {commentary.blocks.map((block, index) => {
          const segmentKey = `${bookId}-${chapterNumber}:c:${block.id}`;
          const isRead = readSegments.includes(segmentKey);
          const isCurrentlySpoken =
            activeSegmentType === 'commentary' && activeSegmentIndex === index;

          return (
            <article
              key={block.id}
              id={`commentary-block-${index}`}
              className={`p-5 sm:p-6 rounded-xl border transition-colors ${
                isCurrentlySpoken
                  ? 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-700 dark:border-amber-500'
                  : isRead
                  ? 'bg-stone-100/70 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800/80'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {getBlockIcon(block.id)}
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                    0{index + 1}. {block.label}
                  </span>
                  {isCurrentlySpoken && (
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      · Teraz czytane przez lektora
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPlayCommentaryBlock(index)}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-amber-900 hover:text-white dark:hover:bg-amber-600 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    title="Czytaj ten komentarz lektorem AI TTS"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Lektor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSegmentRead(segmentKey)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      isRead
                        ? 'text-emerald-800 dark:text-emerald-400 bg-emerald-950/5 dark:bg-emerald-500/10'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                    title="Oznacz sekcję komentarza jako przeczytaną"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRead ? 'Przeczytano' : 'Oznacz'}</span>
                  </button>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {block.title}
              </h4>

              <p className="font-biblical text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-relaxed">
                {block.content}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
