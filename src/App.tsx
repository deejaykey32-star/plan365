import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Library,
  Moon,
  Play,
  RefreshCw,
  Search,
  Sun,
  Volume2,
  Bookmark,
  FileText,
} from 'lucide-react';
import {
  AudioPlayState,
  BibleBook,
  ChapterData,
  LastReadCheckpoint,
  PlanStageId,
  UserProgress,
} from './types';
import { BIBLE_BOOKS, BOOK_MAP, PLAN_STAGES, TOTAL_PLAN_CHAPTERS } from './data/bibleBooks';
import { READING_PLAN_365 } from './data/readingPlan365';
import { buildCommentaryBlocks, getChapterData, isCuratedChapter } from './data/chapterRepository';
import { LectorControlPanel } from './components/LectorControlPanel';
import { CommentarySection } from './components/CommentarySection';

const DEFAULT_SYNC_CODE = 'WNR365-DOMYSLNY';
const LOCAL_STORAGE_KEY = 'biblia365_user_progress_v4';

type ActiveTab = 'plan' | 'reader' | 'books' | 'sync';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');

  // User Progress & Cross-Device Sync State (Starts with Stage 1: Ewangelia Mateusza, continuous chapter text)
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage error
    }
    const now = new Date().toISOString();
    return {
      syncCode: DEFAULT_SYNC_CODE,
      readChapters: [],
      readCommentaries: [],
      readSegments: [],
      completedDays: [],
      currentBookId: 'MAT',
      currentChapter: 1,
      currentVerse: 1,
      planDay: 1,
      checkpoint: {
        bookId: 'MAT',
        bookName: 'Ewangelia według św. Mateusza',
        chapterNumber: 1,
        segmentType: 'verse',
        segmentIndex: 0,
        segmentLabel: 'Tekst rozdziału',
        updatedAt: now,
      },
      bookmarks: [],
      notes: {},
      lastReadTimestamp: now,
    };
  });

  const [syncInputCode, setSyncInputCode] = useState<string>(
    progress.syncCode || DEFAULT_SYNC_CODE
  );
  const [syncStatusText, setSyncStatusText] = useState<string>('Zsynchronizowano automatycznie');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Reader & AI Expanded Chapter State
  const [aiExpandedCache, setAiExpandedCache] = useState<Record<string, Partial<ChapterData>>>({});
  const [isExpandingAI, setIsExpandingAI] = useState<boolean>(false);
  const [chapterNoteDraft, setChapterNoteDraft] = useState<string>('');

  // Books Catalog Filter State (by 13 Plan Stages)
  const [stageFilter, setStageFilter] = useState<'ALL' | PlanStageId>('ALL');
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');
  const [expandedBookId, setExpandedBookId] = useState<string>('MAT');

  // 365 Plan Filter State
  const [planFilter, setPlanFilter] = useState<'all' | 'unread' | 'completed'>('all');
  const [planStageFilter, setPlanStageFilter] = useState<number | 'ALL'>('ALL');
  const [planSearch, setPlanSearch] = useState<string>('');

  // AI TTS Lector State
  const [audioState, setAudioState] = useState<AudioPlayState>({
    isPlaying: false,
    isPaused: false,
    isLoadingAudio: false,
    bookId: progress.currentBookId || 'MAT',
    chapterNumber: progress.currentChapter || 1,
    segmentType: 'verse',
    segmentIndex: 0,
    playbackRate: 1,
    continuousMode: true,
    readMode: 'both',
    engine: 'browser_tts',
    voiceName: 'Kore',
  });

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const activePlaybackIdRef = useRef<number>(0);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunkWatchdogTimerRef = useRef<number | null>(null);
  const audioStateRef = useRef<AudioPlayState>(audioState);
  audioStateRef.current = audioState;
  const aiExpandedCacheRef = useRef<Record<string, Partial<ChapterData>>>(aiExpandedCache);
  aiExpandedCacheRef.current = aiExpandedCache;
  const playSegmentAtRef = useRef<any>(null);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save to localStorage whenever progress updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Push progress to server for automatic cross-browser / cross-OS / cross-device continuity
  const pushSyncToServer = useCallback(
    async (updatedProgress: UserProgress, replaceArrays = false) => {
      try {
        setIsSyncing(true);
        const code = (updatedProgress.syncCode || DEFAULT_SYNC_CODE).toUpperCase().trim();
        const res = await fetch(`/api/sync/${encodeURIComponent(code)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...updatedProgress,
            _replaceArrays: replaceArrays,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.record) {
            setSyncStatusText(
              `Zapisano w chmurze (${new Date(data.record.lastReadTimestamp).toLocaleTimeString(
                'pl-PL',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )})`
            );
          }
        }
      } catch {
        setSyncStatusText('Tryb lokalny (auto-zapis w pamięci urządzenia)');
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  // Pull latest state from server on mount
  const pullSyncFromServer = useCallback(
    async (codeToLoad: string, switchActiveChapter = false) => {
      try {
        setIsSyncing(true);
        const cleanCode = (codeToLoad || DEFAULT_SYNC_CODE).toUpperCase().trim();
        const res = await fetch(`/api/sync/${encodeURIComponent(cleanCode)}`);
        if (!res.ok) return;
        const remote: UserProgress = await res.json();

        setProgress((prev) => {
          const mergeUnique = (a: any[] = [], b: any[] = []) =>
            Array.from(new Set([...(a || []), ...(b || [])]));

          const remoteHasMoreProgress =
            (remote.readChapters?.length || 0) > 0 ||
            (remote.readSegments?.length || 0) > 0 ||
            switchActiveChapter;

          const rawCheckpoint = remote.checkpoint || prev.checkpoint;
          const normalizedCheckpoint: LastReadCheckpoint = {
            ...rawCheckpoint,
            segmentLabel:
              rawCheckpoint.segmentType === 'verse'
                ? 'Tekst rozdziału'
                : rawCheckpoint.segmentLabel,
          };

          const merged: UserProgress = {
            ...prev,
            ...remote,
            syncCode: cleanCode,
            readChapters: mergeUnique(prev.readChapters, remote.readChapters),
            readCommentaries: mergeUnique(prev.readCommentaries, remote.readCommentaries),
            readSegments: mergeUnique(prev.readSegments, remote.readSegments),
            completedDays: mergeUnique(prev.completedDays, remote.completedDays),
            bookmarks: mergeUnique(prev.bookmarks, remote.bookmarks),
            notes: { ...(prev.notes || {}), ...(remote.notes || {}) },
            currentBookId: remoteHasMoreProgress
              ? remote.currentBookId || prev.currentBookId
              : prev.currentBookId,
            currentChapter: remoteHasMoreProgress
              ? remote.currentChapter || prev.currentChapter
              : prev.currentChapter,
            checkpoint: normalizedCheckpoint,
          };
          return merged;
        });

        setSyncStatusText('Zsynchronizowano na wszystkich urządzeniach');
      } catch {
        setSyncStatusText('Dostępny zapis lokalny');
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  useEffect(() => {
    pullSyncFromServer(progress.syncCode || DEFAULT_SYNC_CODE, true);
  }, []);

  // Load cached AI expansion or automatically generate full chapter text & commentary when switching book/chapter
  useEffect(() => {
    let cancelled = false;
    const bookId = progress.currentBookId;
    const chapterNum = progress.currentChapter;
    const key = `${bookId}-${chapterNum}`;
    const note = progress.notes?.[key] || '';
    setChapterNoteDraft(note);

    fetch(`/api/chapter-cache/${bookId}/${chapterNum}`)
      .then((r) => r.json())
      .then(async (res) => {
        if (cancelled) return;
        if (res.cached && res.data) {
          setAiExpandedCache((prev) => ({
            ...prev,
            [key]: res.data,
          }));
          return;
        }
        // If not in built-in curated chapters and not cached yet, automatically load full chapter text & commentary
        if (!isCuratedChapter(bookId, chapterNum)) {
          const bookObj = BOOK_MAP[bookId] || BOOK_MAP['MAT'];
          try {
            setIsExpandingAI(true);
            const genRes = await fetch('/api/gemini/expand-chapter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookId: bookObj.id,
                bookName: bookObj.name,
                shortcut: bookObj.shortcut,
                chapterNumber: chapterNum,
                period: bookObj.period,
                geopoliticsSummary: bookObj.geopoliticsSummary,
                forceRefresh: false,
              }),
            });
            if (!cancelled && genRes.ok) {
              const genData = await genRes.json();
              if (genData.data) {
                setAiExpandedCache((prev) => ({
                  ...prev,
                  [key]: genData.data,
                }));
              }
            }
          } catch {
            // fallback to repository summary if offline
          } finally {
            if (!cancelled) {
              setIsExpandingAI(false);
            }
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [progress.currentBookId, progress.currentChapter]);

  const currentBook: BibleBook = useMemo(
    () => BOOK_MAP[progress.currentBookId] || BOOK_MAP['MAT'],
    [progress.currentBookId]
  );

  const currentChapterData: ChapterData = useMemo(() => {
    const base = getChapterData(progress.currentBookId, progress.currentChapter);
    const key = `${progress.currentBookId}-${progress.currentChapter}`;
    const expanded = aiExpandedCache[key] as any;
    if (!expanded) return base;

    const mergedCommentaryBase = {
      summary: expanded.summary || base.commentary.summary,
      exegesis: expanded.exegesis || base.commentary.exegesis,
      linguistics:
        Array.isArray(expanded.linguistics) && expanded.linguistics.length > 0
          ? expanded.linguistics
          : base.commentary.linguistics,
      geopolitics: expanded.geopolitics?.powers
        ? expanded.geopolitics
        : base.commentary.geopolitics,
      history: expanded.history?.chronology ? expanded.history : base.commentary.history,
      geography:
        Array.isArray(expanded.geography?.locations) && expanded.geography.locations.length > 0
          ? expanded.geography
          : base.commentary.geography,
      faunaFlora:
        Array.isArray(expanded.faunaFlora?.species) && expanded.faunaFlora.species.length > 0
          ? expanded.faunaFlora
          : base.commentary.faunaFlora,
      cultureAndCustoms:
        Array.isArray(expanded.cultureAndCustoms?.topics) &&
        expanded.cultureAndCustoms.topics.length > 0
          ? expanded.cultureAndCustoms
          : base.commentary.cultureAndCustoms,
      apocryphaLinks: expanded.apocryphaLinks || base.commentary.apocryphaLinks,
    };

    return {
      ...base,
      title: expanded.title || base.title,
      verses:
        Array.isArray(expanded.verses) && expanded.verses.length > 0
          ? expanded.verses
          : base.verses,
      commentary: {
        ...mergedCommentaryBase,
        blocks: buildCommentaryBlocks(
          base.bookName,
          base.chapterNumber,
          mergedCommentaryBase
        ),
      },
    };
  }, [progress.currentBookId, progress.currentChapter, aiExpandedCache]);

  // Continuous, unified chapter prose without verse divisions
  const unifiedChapterProse = useMemo(
    () => currentChapterData.verses.map((v) => v.text.trim()).join(' '),
    [currentChapterData]
  );

  const chapterKeyTerms = useMemo(() => {
    const base = getChapterData(progress.currentBookId, progress.currentChapter);
    return Array.from(
      new Set(
        [...currentChapterData.verses, ...base.verses]
          .map((v) => v.keyTerm)
          .filter((t): t is string => Boolean(t))
      )
    );
  }, [currentChapterData, progress.currentBookId, progress.currentChapter]);

  const computeCompletedDays = useCallback((readChaptersList: string[]): number[] => {
    const readSet = new Set(readChaptersList);
    const completed: number[] = [];
    for (const day of READING_PLAN_365) {
      let allRead = true;
      for (const r of day.readings) {
        for (let ch = r.fromChapter; ch <= r.toChapter; ch++) {
          if (!readSet.has(`${r.bookId}-${ch}`)) {
            allRead = false;
            break;
          }
        }
        if (!allRead) break;
      }
      if (allRead && day.readings.length > 0) {
        completed.push(day.dayNumber);
      }
    }
    return completed;
  }, []);

  const markChapterReadStatus = useCallback(
    (bookId: string, chapterNum: number, forceRead?: boolean) => {
      const chapterKey = `${bookId}-${chapterNum}`;
      setProgress((prev) => {
        const exists = prev.readChapters.includes(chapterKey);
        const shouldBeRead = forceRead !== undefined ? forceRead : !exists;
        const nextReadChapters = shouldBeRead
          ? Array.from(new Set([...prev.readChapters, chapterKey]))
          : prev.readChapters.filter((k) => k !== chapterKey);

        const nextCompletedDays = computeCompletedDays(nextReadChapters);
        const updated: UserProgress = {
          ...prev,
          readChapters: nextReadChapters,
          completedDays: nextCompletedDays,
          lastReadTimestamp: new Date().toISOString(),
        };
        pushSyncToServer(updated, true);
        return updated;
      });
    },
    [computeCompletedDays, pushSyncToServer]
  );

  const markSegmentAndCheckpoint = useCallback(
    (
      bookId: string,
      bookName: string,
      chapterNum: number,
      segmentType: 'verse' | 'commentary',
      segmentIndex: number,
      segmentKey: string,
      segmentLabel: string,
      toggleOnly = false
    ) => {
      setProgress((prev) => {
        const exists = prev.readSegments.includes(segmentKey);
        const nextSegments =
          toggleOnly && exists
            ? prev.readSegments.filter((s) => s !== segmentKey)
            : Array.from(new Set([...prev.readSegments, segmentKey]));

        const nextCheckpoint: LastReadCheckpoint = {
          bookId,
          bookName,
          chapterNumber: chapterNum,
          segmentType,
          segmentIndex,
          segmentLabel,
          updatedAt: new Date().toISOString(),
        };

        const updated: UserProgress = {
          ...prev,
          readSegments: nextSegments,
          checkpoint: nextCheckpoint,
          lastReadTimestamp: new Date().toISOString(),
        };
        pushSyncToServer(updated, toggleOnly);
        return updated;
      });
    },
    [pushSyncToServer]
  );

  const navigateToChapter = useCallback(
    (
      bookId: string,
      chapterNum: number,
      segmentType: 'verse' | 'commentary' = 'verse',
      segmentIndex = 0
    ) => {
      const book = BOOK_MAP[bookId] || BOOK_MAP['MAT'];
      const validChapter = Math.max(1, Math.min(book.totalChapters, chapterNum));
      const chData = getChapterData(book.id, validChapter);

      const label =
        segmentType === 'verse'
          ? 'Tekst rozdziału'
          : `Komentarz: ${chData.commentary.blocks[segmentIndex]?.label || 'Egzegeza'}`;

      setProgress((prev) => {
        const updated: UserProgress = {
          ...prev,
          currentBookId: book.id,
          currentChapter: validChapter,
          checkpoint: {
            bookId: book.id,
            bookName: book.name,
            chapterNumber: validChapter,
            segmentType,
            segmentIndex: segmentType === 'verse' ? 0 : segmentIndex,
            segmentLabel: label,
            updatedAt: new Date().toISOString(),
          },
          lastReadTimestamp: new Date().toISOString(),
        };
        pushSyncToServer(updated);
        return updated;
      });

      setAudioState((prev) => ({
        ...prev,
        bookId: book.id,
        chapterNumber: validChapter,
        segmentType,
        segmentIndex: segmentType === 'verse' ? 0 : segmentIndex,
      }));
    },
    [pushSyncToServer]
  );

  // Advances strictly according to our 13-stage BIBLE_BOOKS sequence
  const getNextBookAndChapter = useCallback(
    (bookId: string, chapterNum: number): { bookId: string; chapterNumber: number } | null => {
      const currentBookObj = BOOK_MAP[bookId];
      if (!currentBookObj) return null;
      if (chapterNum < currentBookObj.totalChapters) {
        return { bookId, chapterNumber: chapterNum + 1 };
      }
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
      if (idx >= 0 && idx + 1 < BIBLE_BOOKS.length) {
        return { bookId: BIBLE_BOOKS[idx + 1].id, chapterNumber: 1 };
      }
      return null;
    },
    []
  );

  const getPrevBookAndChapter = useCallback(
    (bookId: string, chapterNum: number): { bookId: string; chapterNumber: number } | null => {
      if (chapterNum > 1) {
        return { bookId, chapterNumber: chapterNum - 1 };
      }
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
      if (idx > 0) {
        const prevBook = BIBLE_BOOKS[idx - 1];
        return { bookId: prevBook.id, chapterNumber: prevBook.totalChapters };
      }
      return null;
    },
    []
  );

  const clearChunkWatchdog = useCallback(() => {
    if (chunkWatchdogTimerRef.current !== null) {
      window.clearTimeout(chunkWatchdogTimerRef.current);
      chunkWatchdogTimerRef.current = null;
    }
  }, []);

  const stopAudioPlayback = useCallback(() => {
    activePlaybackIdRef.current += 1;
    clearChunkWatchdog();
    activeUtteranceRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    setAudioState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoadingAudio: false,
    }));
  }, [clearChunkWatchdog]);

  // Splits chapter/commentary text into natural single-sentence chunks (<= 135 chars)
  // so browser SpeechSynthesis never hits the 14-second network TTS buffer cutoff or skips clauses.
  const splitIntoSpeechChunks = useCallback((rawText: string, maxLen = 135): string[] => {
    const cleaned = (rawText || '')
      .replace(/[«»„”"]/g, ' ')
      .replace(/\s+-\s+/g, ', ')
      .replace(/\s+([.,!?;:])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return [];

    const rawSentences = cleaned.split(/(?<=[.!?…])\s+/);
    const chunks: string[] = [];

    const pushLongClause = (clause: string) => {
      const words = clause.split(/\s+/);
      let buf = '';
      for (const w of words) {
        if (!buf) {
          buf = w;
        } else if (buf.length + 1 + w.length <= maxLen) {
          buf += ' ' + w;
        } else {
          chunks.push(buf);
          buf = w;
        }
      }
      if (buf) chunks.push(buf);
    };

    for (const sentence of rawSentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;
      if (trimmed.length <= maxLen) {
        chunks.push(trimmed);
      } else {
        const subClauses = trimmed.split(/(?<=[,:;–—])\s+/);
        let subCurrent = '';
        for (const sub of subClauses) {
          if (sub.length > maxLen) {
            if (subCurrent) {
              chunks.push(subCurrent);
              subCurrent = '';
            }
            pushLongClause(sub);
          } else if (!subCurrent) {
            subCurrent = sub;
          } else if (subCurrent.length + 1 + sub.length <= maxLen) {
            subCurrent += ' ' + sub;
          } else {
            chunks.push(subCurrent);
            subCurrent = sub;
          }
        }
        if (subCurrent) {
          chunks.push(subCurrent);
        }
      }
    }

    return chunks;
  }, []);

  // Core Sequential AI TTS Lector Engine:
  // Reads the entire chapter sentence-by-sentence without skipping any verses,
  // then reads commentary-by-commentary, automatically marking read status and advancing to the next chapter!
  const playSegmentAt = useCallback(
    async (
      bookId: string,
      chapterNum: number,
      segmentType: 'verse' | 'commentary',
      segmentIndex: number,
      engineOverride?: 'gemini_tts' | 'browser_tts',
      voiceOverride?: string,
      rateOverride?: number,
      readModeOverride?: 'both' | 'verses_only' | 'commentary_only'
    ) => {
      const playbackId = ++activePlaybackIdRef.current;
      clearChunkWatchdog();
      activeUtteranceRef.current = null;

      let didCancelSpeech = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending ||
          window.speechSynthesis.paused
        ) {
          window.speechSynthesis.cancel();
          didCancelSpeech = true;
        }
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }

      const currentAudio = audioStateRef.current;
      const activeEngine = engineOverride || currentAudio.engine;
      const activeVoice = voiceOverride || currentAudio.voiceName;
      const activeRate = rateOverride || currentAudio.playbackRate;
      const activeReadMode = readModeOverride || currentAudio.readMode;

      const baseData = getChapterData(bookId, chapterNum);
      const cacheKey = `${bookId}-${chapterNum}`;
      let expanded = aiExpandedCacheRef.current[cacheKey] as any;
      if (!expanded) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const r = await fetch(`/api/chapter-cache/${bookId}/${chapterNum}`);
            if (r.ok) {
              const resJson = await r.json();
              if (resJson.cached && resJson.data) {
                expanded = resJson.data;
                setAiExpandedCache((prev) => ({
                  ...prev,
                  [cacheKey]: resJson.data,
                }));
                break;
              }
            }
          } catch {
            // retry once if needed
          }
        }
      }
      if (activePlaybackIdRef.current !== playbackId) return;

      const verses =
        expanded && Array.isArray(expanded.verses) && expanded.verses.length > 0
          ? expanded.verses
          : baseData.verses;

      const mergedCommentaryBase = expanded
        ? {
            summary: expanded.summary || baseData.commentary.summary,
            exegesis: expanded.exegesis || baseData.commentary.exegesis,
            linguistics:
              Array.isArray(expanded.linguistics) && expanded.linguistics.length > 0
                ? expanded.linguistics
                : baseData.commentary.linguistics,
            geopolitics: expanded.geopolitics?.powers
              ? expanded.geopolitics
              : baseData.commentary.geopolitics,
            history: expanded.history?.chronology ? expanded.history : baseData.commentary.history,
            geography:
              Array.isArray(expanded.geography?.locations) &&
              expanded.geography.locations.length > 0
                ? expanded.geography
                : baseData.commentary.geography,
            faunaFlora:
              Array.isArray(expanded.faunaFlora?.species) && expanded.faunaFlora.species.length > 0
                ? expanded.faunaFlora
                : baseData.commentary.faunaFlora,
            cultureAndCustoms:
              Array.isArray(expanded.cultureAndCustoms?.topics) &&
              expanded.cultureAndCustoms.topics.length > 0
                ? expanded.cultureAndCustoms
                : baseData.commentary.cultureAndCustoms,
            apocryphaLinks: expanded.apocryphaLinks || baseData.commentary.apocryphaLinks,
          }
        : baseData.commentary;

      const blocks = buildCommentaryBlocks(baseData.bookName, chapterNum, mergedCommentaryBase);

      let textToRead = '';
      let segmentKey = '';
      let segmentLabel = '';

      if (segmentType === 'verse') {
        const chapterProse = verses.map((v: any) => v.text.trim()).join(' ');
        textToRead = `${baseData.bookName}, rozdział ${chapterNum}. ${chapterProse}`;
        segmentKey = `${bookId}-${chapterNum}:chapter-text`;
        segmentLabel = 'Tekst rozdziału';
      } else {
        const block = blocks[segmentIndex];
        if (!block) return;
        textToRead = `Komentarz egzegetyczny, sekcja ${segmentIndex + 1}: ${block.label}. ${block.title}. ${block.content}`;
        segmentKey = `${bookId}-${chapterNum}:c:${block.id}`;
        segmentLabel = `Komentarz: ${block.label}`;
      }

      const domId =
        segmentType === 'verse' ? 'chapter-prose-block' : `commentary-block-${segmentIndex}`;
      const el = document.getElementById(domId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      setAudioState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isLoadingAudio: activeEngine === 'gemini_tts',
        bookId,
        chapterNumber: chapterNum,
        segmentType,
        segmentIndex: segmentType === 'verse' ? 0 : segmentIndex,
      }));

      markSegmentAndCheckpoint(
        bookId,
        baseData.bookName,
        chapterNum,
        segmentType,
        segmentType === 'verse' ? 0 : segmentIndex,
        segmentKey,
        segmentLabel,
        false
      );

      const onFinishSegment = () => {
        if (activePlaybackIdRef.current !== playbackId) return;
        clearChunkWatchdog();
        activeUtteranceRef.current = null;

        const latestPlay = playSegmentAtRef.current || playSegmentAt;
        const latestContinuous = audioStateRef.current.continuousMode;

        if (segmentType === 'verse') {
          // Entire unified chapter text finished! Mark chapter read automatically
          markChapterReadStatus(bookId, chapterNum, true);

          if (activeReadMode !== 'verses_only' && blocks.length > 0) {
            setTimeout(() => {
              if (activePlaybackIdRef.current === playbackId) {
                latestPlay(
                  bookId,
                  chapterNum,
                  'commentary',
                  0,
                  activeEngine,
                  activeVoice,
                  activeRate,
                  activeReadMode
                );
              }
            }, 150);
            return;
          }
        } else {
          if (segmentIndex + 1 < blocks.length) {
            setTimeout(() => {
              if (activePlaybackIdRef.current === playbackId) {
                latestPlay(
                  bookId,
                  chapterNum,
                  'commentary',
                  segmentIndex + 1,
                  activeEngine,
                  activeVoice,
                  activeRate,
                  activeReadMode
                );
              }
            }, 150);
            return;
          } else {
            markChapterReadStatus(bookId, chapterNum, true);
          }
        }

        if (latestContinuous) {
          const nextTarget = getNextBookAndChapter(bookId, chapterNum);
          if (nextTarget) {
            navigateToChapter(
              nextTarget.bookId,
              nextTarget.chapterNumber,
              activeReadMode === 'commentary_only' ? 'commentary' : 'verse',
              0
            );
            setTimeout(() => {
              if (activePlaybackIdRef.current === playbackId) {
                latestPlay(
                  nextTarget.bookId,
                  nextTarget.chapterNumber,
                  activeReadMode === 'commentary_only' ? 'commentary' : 'verse',
                  0,
                  activeEngine,
                  activeVoice,
                  activeRate,
                  activeReadMode
                );
              }
            }, 250);
            return;
          }
        }

        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          isLoadingAudio: false,
        }));
      };

      const speakWithBrowser = () => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          setAudioState((prev) => ({ ...prev, isPlaying: false, isLoadingAudio: false }));
          return;
        }
        setAudioState((prev) => ({ ...prev, isLoadingAudio: false }));

        const chunks = splitIntoSpeechChunks(textToRead, 135);
        if (chunks.length === 0) {
          onFinishSegment();
          return;
        }

        const voices = window.speechSynthesis.getVoices();
        const plVoice = voices.find((v) => v.lang.toLowerCase().includes('pl'));

        const speakChunkAt = (chunkIdx: number, retryCount = 0) => {
          if (activePlaybackIdRef.current !== playbackId) return;
          clearChunkWatchdog();

          if (chunkIdx >= chunks.length) {
            onFinishSegment();
            return;
          }

          const chunkText = chunks[chunkIdx];
          const utterance = new SpeechSynthesisUtterance(chunkText);
          activeUtteranceRef.current = utterance;
          utterance.lang = 'pl-PL';
          utterance.rate = activeRate;
          if (plVoice) utterance.voice = plVoice;

          let settled = false;

          const scheduleWatchdog = (idleTicks: number) => {
            clearChunkWatchdog();
            chunkWatchdogTimerRef.current = window.setTimeout(() => {
              if (activePlaybackIdRef.current !== playbackId || settled) return;
              // Never cut off or skip an utterance while the browser TTS is actively speaking!
              if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                if (window.speechSynthesis.paused) {
                  try {
                    window.speechSynthesis.resume();
                  } catch {
                    // ignore
                  }
                }
                scheduleWatchdog(0);
                return;
              }
              if (idleTicks < 2) {
                scheduleWatchdog(idleTicks + 1);
                return;
              }
              settled = true;
              speakChunkAt(chunkIdx + 1, 0);
            }, 4000);
          };

          scheduleWatchdog(0);

          utterance.onend = () => {
            if (settled) return;
            settled = true;
            clearChunkWatchdog();
            if (activePlaybackIdRef.current !== playbackId) return;
            window.setTimeout(() => {
              if (activePlaybackIdRef.current === playbackId) {
                speakChunkAt(chunkIdx + 1, 0);
              }
            }, 70);
          };

          utterance.onerror = () => {
            if (settled) return;
            settled = true;
            clearChunkWatchdog();
            if (activePlaybackIdRef.current !== playbackId) return;

            // Never skip the sentence on error: retry the same chunkIdx up to 3 times!
            if (retryCount < 3) {
              window.setTimeout(() => {
                if (activePlaybackIdRef.current === playbackId) {
                  try {
                    if (window.speechSynthesis.paused) {
                      window.speechSynthesis.resume();
                    }
                  } catch {
                    // ignore
                  }
                  speakChunkAt(chunkIdx, retryCount + 1);
                }
              }, 180);
            } else {
              window.setTimeout(() => {
                if (activePlaybackIdRef.current === playbackId) {
                  speakChunkAt(chunkIdx + 1, 0);
                }
              }, 100);
            }
          };

          try {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
            window.speechSynthesis.speak(utterance);
          } catch {
            if (retryCount < 3) {
              window.setTimeout(() => {
                if (activePlaybackIdRef.current === playbackId) {
                  speakChunkAt(chunkIdx, retryCount + 1);
                }
              }, 180);
            } else {
              speakChunkAt(chunkIdx + 1, 0);
            }
          }
        };

        // If window.speechSynthesis.cancel() was just called, wait 160ms so the async cancel IPC
        // finishes in the browser speech daemon and never cancels chunk 0!
        if (didCancelSpeech) {
          window.setTimeout(() => {
            if (activePlaybackIdRef.current === playbackId) {
              speakChunkAt(0, 0);
            }
          }, 160);
        } else {
          speakChunkAt(0, 0);
        }
      };

      if (activeEngine === 'gemini_tts') {
        try {
          const geminiChunks = splitIntoSpeechChunks(textToRead, 700);
          const playGeminiChunkAt = async (gIdx: number) => {
            if (activePlaybackIdRef.current !== playbackId) return;
            if (gIdx >= geminiChunks.length) {
              onFinishSegment();
              return;
            }
            const res = await fetch('/api/gemini/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: geminiChunks[gIdx],
                voice: activeVoice,
              }),
            });
            if (activePlaybackIdRef.current !== playbackId) return;

            if (res.ok) {
              const data = await res.json();
              if (data.audioUrl) {
                setAudioState((prev) => ({ ...prev, isLoadingAudio: false }));
                const audio = new Audio(data.audioUrl);
                audio.playbackRate = activeRate;
                audioElementRef.current = audio;
                audio.onended = () => {
                  playGeminiChunkAt(gIdx + 1);
                };
                audio.onerror = () => speakWithBrowser();
                await audio.play();
                return;
              }
            }
            speakWithBrowser();
          };

          await playGeminiChunkAt(0);
          return;
        } catch {
          if (activePlaybackIdRef.current === playbackId) {
            speakWithBrowser();
          }
        }
      } else {
        speakWithBrowser();
      }
    },
    [
      clearChunkWatchdog,
      splitIntoSpeechChunks,
      markSegmentAndCheckpoint,
      markChapterReadStatus,
      getNextBookAndChapter,
      navigateToChapter,
    ]
  );

  playSegmentAtRef.current = playSegmentAt;

  const handleResumeCheckpoint = useCallback(
    (startLector = false) => {
      const cp = progress.checkpoint;
      setActiveTab('reader');
      navigateToChapter(cp.bookId, cp.chapterNumber, cp.segmentType, cp.segmentIndex);
      if (startLector) {
        setTimeout(() => {
          playSegmentAt(cp.bookId, cp.chapterNumber, cp.segmentType, cp.segmentIndex);
        }, 150);
      } else {
        setTimeout(() => {
          const domId =
            cp.segmentType === 'verse'
              ? 'chapter-prose-block'
              : `commentary-block-${cp.segmentIndex}`;
          document.getElementById(domId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    },
    [progress.checkpoint, navigateToChapter, playSegmentAt]
  );

  const handleExpandChapterWithAI = useCallback(async () => {
    try {
      setIsExpandingAI(true);
      const res = await fetch('/api/gemini/expand-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: currentBook.id,
          bookName: currentBook.name,
          shortcut: currentBook.shortcut,
          chapterNumber: progress.currentChapter,
          period: currentBook.period,
          geopoliticsSummary: currentBook.geopoliticsSummary,
          forceRefresh: true,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          const key = `${currentBook.id}-${progress.currentChapter}`;
          setAiExpandedCache((prev) => ({
            ...prev,
            [key]: result.data,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to expand chapter with AI:', e);
    } finally {
      setIsExpandingAI(false);
    }
  }, [currentBook, progress.currentChapter]);

  const handleSaveChapterNote = useCallback(() => {
    const key = `${progress.currentBookId}-${progress.currentChapter}`;
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        notes: {
          ...prev.notes,
          [key]: chapterNoteDraft,
        },
        lastReadTimestamp: new Date().toISOString(),
      };
      pushSyncToServer(updated);
      return updated;
    });
  }, [progress.currentBookId, progress.currentChapter, chapterNoteDraft, pushSyncToServer]);

  const handleToggleChapterBookmark = useCallback(() => {
    const bmKey = `${progress.currentBookId}-${progress.currentChapter}`;
    setProgress((prev) => {
      const exists = prev.bookmarks.includes(bmKey);
      const nextBookmarks = exists
        ? prev.bookmarks.filter((b) => b !== bmKey)
        : [...prev.bookmarks, bmKey];
      const updated: UserProgress = {
        ...prev,
        bookmarks: nextBookmarks,
        lastReadTimestamp: new Date().toISOString(),
      };
      pushSyncToServer(updated, true);
      return updated;
    });
  }, [progress.currentBookId, progress.currentChapter, pushSyncToServer]);

  const handleTogglePlanDayRead = useCallback(
    (dayNumber: number) => {
      const dayObj = READING_PLAN_365.find((d) => d.dayNumber === dayNumber);
      if (!dayObj) return;

      const dayChapterKeys: string[] = [];
      dayObj.readings.forEach((r) => {
        for (let c = r.fromChapter; c <= r.toChapter; c++) {
          dayChapterKeys.push(`${r.bookId}-${c}`);
        }
      });

      setProgress((prev) => {
        const isDayDone = prev.completedDays.includes(dayNumber);
        const nextReadChapters = isDayDone
          ? prev.readChapters.filter((k) => !dayChapterKeys.includes(k))
          : Array.from(new Set([...prev.readChapters, ...dayChapterKeys]));

        const nextCompletedDays = computeCompletedDays(nextReadChapters);
        const updated: UserProgress = {
          ...prev,
          readChapters: nextReadChapters,
          completedDays: nextCompletedDays,
          planDay: isDayDone ? prev.planDay : Math.min(365, dayNumber + 1),
          lastReadTimestamp: new Date().toISOString(),
        };
        pushSyncToServer(updated, true);
        return updated;
      });
    },
    [computeCompletedDays, pushSyncToServer]
  );

  // Filtered Books for Katalog Ksiąg (in the 13-stage sequence)
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((b) => {
      if (stageFilter !== 'ALL' && b.stageId !== stageFilter) return false;
      if (bookSearchQuery.trim()) {
        const q = bookSearchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.shortcut.toLowerCase().includes(q) ||
          b.latinName.toLowerCase().includes(q) ||
          b.stageName.toLowerCase().includes(q) ||
          b.geopoliticsSummary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [stageFilter, bookSearchQuery]);

  // Filtered 365-Day Plan
  const filteredPlanDays = useMemo(() => {
    return READING_PLAN_365.filter((d) => {
      const isDone = progress.completedDays.includes(d.dayNumber);
      if (planFilter === 'unread' && isDone) return false;
      if (planFilter === 'completed' && !isDone) return false;
      if (planStageFilter !== 'ALL' && d.stageNumber !== planStageFilter) return false;
      if (planSearch.trim()) {
        const q = planSearch.toLowerCase();
        const matchTitle =
          d.title.toLowerCase().includes(q) ||
          d.theme.toLowerCase().includes(q) ||
          d.stageName.toLowerCase().includes(q);
        const matchDay = String(d.dayNumber) === q;
        const matchBooks = d.readings.some(
          (r) =>
            r.bookName.toLowerCase().includes(q) || r.bookShortcut.toLowerCase().includes(q)
        );
        return matchTitle || matchDay || matchBooks;
      }
      return true;
    });
  }, [READING_PLAN_365, progress.completedDays, planFilter, planStageFilter, planSearch]);

  const totalReadCount = progress.readChapters.length;
  const progressPercentage = Math.min(
    100,
    Math.round((totalReadCount / TOTAL_PLAN_CHAPTERS) * 100)
  );

  const isCurrentChapterRead = progress.readChapters.includes(
    `${progress.currentBookId}-${progress.currentChapter}`
  );

  const isCurrentChapterBookmarked = progress.bookmarks.includes(
    `${progress.currentBookId}-${progress.currentChapter}`
  );

  const isChapterProseCurrentlySpoken =
    audioState.isPlaying &&
    audioState.bookId === progress.currentBookId &&
    audioState.chapterNumber === progress.currentChapter &&
    audioState.segmentType === 'verse';

  const currentSegmentLabel = useMemo(() => {
    if (audioState.segmentType === 'verse') {
      return 'Tekst rozdziału';
    } else {
      const b = currentChapterData.commentary.blocks[audioState.segmentIndex];
      return `Komentarz: ${b ? b.label : 'Egzegeza'}`;
    }
  }, [audioState.segmentType, audioState.segmentIndex, currentChapterData]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-20 md:pb-12 transition-colors">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-30 h-12 md:h-16 flex items-center justify-between gap-8 px-4 sm:px-8 bg-[#FBF9F5]/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#reader"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('reader');
          }}
          className="font-heading text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0"
        >
          Biblia 365
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-400">
          <a
            href="#reader"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('reader');
            }}
            className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'reader'
                ? 'text-amber-900 dark:text-amber-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Czytnik i Egzegeza
          </a>
          <a
            href="#plan"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('plan');
            }}
            className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'plan'
                ? 'text-amber-900 dark:text-amber-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Plan 365 Dni
          </a>
          <a
            href="#books"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('books');
            }}
            className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'books'
                ? 'text-amber-900 dark:text-amber-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Katalog Ksiąg
          </a>
          <a
            href="#sync"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('sync');
            }}
            className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'sync'
                ? 'text-amber-900 dark:text-amber-400 underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Synchronizacja
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleResumeCheckpoint(true)}
            className="min-h-[38px] md:min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-amber-900 dark:bg-amber-600 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Kontynuuj czytanie
          </button>
        </div>
      </header>

      {/* Operational Progress & 13-Stage Sequence Strip (Below Header) */}
      <div className="bg-stone-100/80 dark:bg-stone-900/80 border-b border-stone-200/80 dark:border-stone-800 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex flex-wrap items-center gap-2 tabular-nums">
            <span className="font-semibold text-stone-900 dark:text-stone-200">
              {currentBook.stageName}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Przeczytano: {totalReadCount} / {TOTAL_PLAN_CHAPTERS} rozdz. ({progressPercentage}%)
            </span>
            <span aria-hidden="true">·</span>
            <span>Dni planu: {progress.completedDays.length} / 365</span>
            <span aria-hidden="true">·</span>
            <span className="hidden sm:inline">{syncStatusText}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setFontSize((prev) => (prev === 'base' ? 'lg' : prev === 'lg' ? 'xl' : 'base'))
              }
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-medium whitespace-nowrap shrink-0 cursor-pointer"
              title="Zmień rozmiar czcionki biblijnej"
            >
              Tekst:{' '}
              {fontSize === 'base' ? 'Standardowy' : fontSize === 'lg' ? 'Duży' : 'Bardzo duży'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors font-medium flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'Tryb jasny' : 'Tryb nocny'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* ===================================================================
            VIEW 1: CZYTNIK BIBLIJNY (BEZ PODZIAŁU NA WERSETY), KOMENTARZ I LEKTOR AI
           =================================================================== */}
        {activeTab === 'reader' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar on Desktop: Today's Plan + 13-Stage Book & Chapter Navigator */}
            <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              {/* Today's Plan Reading Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                    Plan 365 · Dzień {progress.planDay} z 365
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plan')}
                    className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer"
                  >
                    Wszystkie 13 etapów
                  </button>
                </div>

                {(() => {
                  const activeDayPlan =
                    READING_PLAN_365.find((d) => d.dayNumber === progress.planDay) ||
                    READING_PLAN_365[0];
                  return (
                    <>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                        {activeDayPlan.stageName}
                      </p>
                      <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                        {activeDayPlan.title}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                        {activeDayPlan.theme}
                      </p>

                      <div className="space-y-1.5 mb-4">
                        {activeDayPlan.readings.map((r, idx) => {
                          const chaptersInRange: number[] = [];
                          for (let c = r.fromChapter; c <= r.toChapter; c++) {
                            chaptersInRange.push(c);
                          }
                          return (
                            <div key={`${r.bookId}-${idx}`} className="space-y-1">
                              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                                {r.bookName} ({r.bookShortcut} {r.fromChapter}
                                {r.toChapter !== r.fromChapter ? `–${r.toChapter}` : ''})
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {chaptersInRange.map((chNum) => {
                                  const chKey = `${r.bookId}-${chNum}`;
                                  const isChRead = progress.readChapters.includes(chKey);
                                  const isCurrent =
                                    progress.currentBookId === r.bookId &&
                                    progress.currentChapter === chNum;
                                  return (
                                    <button
                                      key={chKey}
                                      type="button"
                                      onClick={() => navigateToChapter(r.bookId, chNum)}
                                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                                        isCurrent
                                          ? 'bg-amber-900 dark:bg-amber-600 text-white font-semibold'
                                          : isChRead
                                          ? 'bg-emerald-950/10 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-700/20'
                                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                                      }`}
                                    >
                                      {r.bookShortcut} {chNum} {isChRead ? '✓' : ''}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                        <button
                          type="button"
                          onClick={() =>
                            setProgress((prev) => ({
                              ...prev,
                              planDay: Math.max(1, prev.planDay - 1),
                            }))
                          }
                          className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                        >
                          Poprzedni dzień
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePlanDayRead(activeDayPlan.dayNumber)}
                          className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-900/10 dark:bg-amber-500/15 text-amber-950 dark:text-amber-200 hover:bg-amber-900/20 cursor-pointer"
                        >
                          {progress.completedDays.includes(activeDayPlan.dayNumber)
                            ? 'Dzień ukończony ✓'
                            : 'Zakończ dzień'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setProgress((prev) => ({
                              ...prev,
                              planDay: Math.min(365, prev.planDay + 1),
                            }))
                          }
                          className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                        >
                          Kolejny dzień
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Book & Chapter Selector Ordered by the 13 Reading Plan Stages */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Kolejność Czytań (13 Etapów Planu)
                </label>
                <select
                  value={progress.currentBookId}
                  onChange={(e) => navigateToChapter(e.target.value, 1)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 text-sm font-medium mb-4"
                >
                  {PLAN_STAGES.map((stage) => (
                    <optgroup key={stage.id} label={stage.name}>
                      {BIBLE_BOOKS.filter((b) => b.stageId === stage.id).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.shortcut} — {b.name} ({b.totalChapters} rozdz.)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span>Rozdziały księgi ({currentBook.totalChapters})</span>
                  <span>Zielony = Przeczytany</span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {Array.from({ length: currentBook.totalChapters }, (_, i) => i + 1).map(
                    (chNum) => {
                      const isRead = progress.readChapters.includes(`${currentBook.id}-${chNum}`);
                      const isActive = progress.currentChapter === chNum;
                      return (
                        <button
                          key={chNum}
                          type="button"
                          onClick={() => navigateToChapter(currentBook.id, chNum)}
                          className={`min-h-[40px] rounded-lg text-xs font-semibold tabular-nums transition-colors flex items-center justify-center cursor-pointer ${
                            isActive
                              ? 'bg-amber-900 dark:bg-amber-600 text-white'
                              : isRead
                              ? 'bg-emerald-950/15 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-700/25'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                          }`}
                        >
                          {chNum}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Personal Exegetical Notes */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Twoje notatki ({currentBook.shortcut} {progress.currentChapter})</span>
                  </label>
                </div>
                <textarea
                  value={chapterNoteDraft}
                  onChange={(e) => setChapterNoteDraft(e.target.value)}
                  placeholder="Zapisz własne refleksje egzegetyczne, słowa kluczowe lub myśli z lektury (synchronizowane automatycznie)..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800/70 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 text-xs leading-relaxed mb-2.5"
                />
                <button
                  type="button"
                  onClick={handleSaveChapterNote}
                  className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Zapisz notatkę w chmurze
                </button>
              </div>
            </aside>

            {/* Right Main Column: Chapter Reader (Unified Continuous Prose) + Lector AI + 8-Part Commentary */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <LectorControlPanel
                audioState={audioState}
                checkpoint={progress.checkpoint}
                currentBookName={currentBook.name}
                currentSegmentLabel={currentSegmentLabel}
                isCurrentChapterRead={isCurrentChapterRead}
                onPlayPause={() => {
                  if (audioState.isPlaying) {
                    stopAudioPlayback();
                    setAudioState((prev) => ({ ...prev, isPaused: true }));
                  } else {
                    playSegmentAt(
                      progress.currentBookId,
                      progress.currentChapter,
                      audioState.segmentType,
                      audioState.segmentIndex
                    );
                  }
                }}
                onStop={stopAudioPlayback}
                onPrevSegment={() => {
                  if (audioState.segmentType === 'commentary' && audioState.segmentIndex > 0) {
                    playSegmentAt(
                      progress.currentBookId,
                      progress.currentChapter,
                      'commentary',
                      audioState.segmentIndex - 1
                    );
                  } else if (audioState.segmentType === 'commentary') {
                    playSegmentAt(progress.currentBookId, progress.currentChapter, 'verse', 0);
                  } else {
                    const prev = getPrevBookAndChapter(
                      progress.currentBookId,
                      progress.currentChapter
                    );
                    if (prev) {
                      navigateToChapter(prev.bookId, prev.chapterNumber, 'verse', 0);
                    }
                  }
                }}
                onNextSegment={() => {
                  if (audioState.segmentType === 'verse') {
                    playSegmentAt(progress.currentBookId, progress.currentChapter, 'commentary', 0);
                  } else if (
                    audioState.segmentType === 'commentary' &&
                    audioState.segmentIndex + 1 < currentChapterData.commentary.blocks.length
                  ) {
                    playSegmentAt(
                      progress.currentBookId,
                      progress.currentChapter,
                      'commentary',
                      audioState.segmentIndex + 1
                    );
                  } else {
                    const next = getNextBookAndChapter(
                      progress.currentBookId,
                      progress.currentChapter
                    );
                    if (next) {
                      navigateToChapter(next.bookId, next.chapterNumber, 'verse', 0);
                    }
                  }
                }}
                onResumeCheckpoint={() => handleResumeCheckpoint(true)}
                onChangeEngine={(engine) => setAudioState((prev) => ({ ...prev, engine }))}
                onChangeVoice={(voiceName) => setAudioState((prev) => ({ ...prev, voiceName }))}
                onChangeRate={(playbackRate) => setAudioState((prev) => ({ ...prev, playbackRate }))}
                onChangeReadMode={(readMode) => setAudioState((prev) => ({ ...prev, readMode }))}
                onToggleContinuous={() =>
                  setAudioState((prev) => ({ ...prev, continuousMode: !prev.continuousMode }))
                }
                onMarkChapterRead={() =>
                  markChapterReadStatus(progress.currentBookId, progress.currentChapter)
                }
              />

              {/* Editorial Chapter Sheet */}
              <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
                {/* Unboxed Curatorial Book Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3">
                  <span className="font-semibold text-amber-900 dark:text-amber-400">
                    {currentBook.stageName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Łac. {currentBook.latinName}</span>
                  <span aria-hidden="true">·</span>
                  <span>Gr. {currentBook.greekName}</span>
                  {currentBook.hebrewName && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Hebr. {currentBook.hebrewName}</span>
                    </>
                  )}
                  {currentBook.aramaicName && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Aram. {currentBook.aramaicName}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{currentBook.period}</span>
                </div>

                {/* Chapter Title & Prev/Next Chapter Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <h1
                      className="font-heading text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight"
                      style={{ textWrap: 'balance' }}
                    >
                      {currentBook.name} · Rozdział {progress.currentChapter}
                    </h1>
                    <p className="font-biblical italic text-lg sm:text-xl text-stone-600 dark:text-stone-300 mt-1">
                      {currentChapterData.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const prev = getPrevBookAndChapter(
                          progress.currentBookId,
                          progress.currentChapter
                        );
                        if (prev) navigateToChapter(prev.bookId, prev.chapterNumber);
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Poprzedni</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        markChapterReadStatus(
                          progress.currentBookId,
                          progress.currentChapter,
                          true
                        );
                        const next = getNextBookAndChapter(
                          progress.currentBookId,
                          progress.currentChapter
                        );
                        if (next) navigateToChapter(next.bookId, next.chapterNumber);
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-900 dark:bg-amber-600 text-white hover:bg-amber-800 dark:hover:bg-amber-500 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Przeczytano i dalej</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Unified Continuous Chapter Text (Zero Verse Divisions) */}
                <article
                  id="chapter-prose-block"
                  className={`p-5 sm:p-7 rounded-2xl border transition-colors ${
                    isChapterProseCurrentlySpoken
                      ? 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-700 dark:border-amber-500'
                      : isCurrentChapterRead
                      ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-200/70 dark:border-stone-800/70'
                      : 'bg-stone-50/40 dark:bg-stone-900/20 border-stone-200/60 dark:border-stone-800/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-200/70 dark:border-stone-800">
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                        Tekst Ciągły Rozdziału (Układ Kodeksowy bez podziału na wersety)
                      </span>
                      {isExpandingAI && (
                        <span className="font-semibold text-amber-800 dark:text-amber-300">
                          {' '}
                          · Trwa wczytywanie pełnego przekładu i egzegezy rozdziału...
                        </span>
                      )}
                      {isChapterProseCurrentlySpoken && (
                        <span className="font-semibold text-amber-800 dark:text-amber-300">
                          {' '}
                          · Teraz czytane przez Lektora AI
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          playSegmentAt(
                            progress.currentBookId,
                            progress.currentChapter,
                            'verse',
                            0
                          )
                        }
                        className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-amber-900 hover:text-white dark:hover:bg-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Czytaj rozdział</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          markChapterReadStatus(progress.currentBookId, progress.currentChapter)
                        }
                        className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isCurrentChapterRead
                            ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-950/10 dark:bg-emerald-500/15'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isCurrentChapterRead ? 'Przeczytano' : 'Oznacz rozdział'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleChapterBookmark}
                        className={`min-h-[38px] min-w-[38px] rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          isCurrentChapterBookmarked
                            ? 'text-amber-800 dark:text-amber-400 bg-amber-900/10'
                            : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                        }`}
                        title="Dodaj zakładkę do rozdziału"
                        aria-label="Dodaj zakładkę do rozdziału"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`font-biblical text-stone-900 dark:text-stone-100 max-w-prose first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-amber-900 dark:first-letter:text-amber-400 ${
                      fontSize === 'base'
                        ? 'text-lg leading-relaxed'
                        : fontSize === 'lg'
                        ? 'text-xl leading-relaxed'
                        : 'text-2xl leading-relaxed'
                    }`}
                  >
                    {unifiedChapterProse}
                  </p>

                  {chapterKeyTerms.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-stone-200/70 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        Kluczowe zwroty źródłowe rozdziału:{' '}
                      </span>
                      <span className="italic">{chapterKeyTerms.join(' · ')}</span>
                    </div>
                  )}
                </article>

                {/* 8-Part Multi-Dimensional Exegetical & Historical Commentary */}
                <CommentarySection
                  bookId={progress.currentBookId}
                  bookName={currentBook.name}
                  chapterNumber={progress.currentChapter}
                  commentary={currentChapterData.commentary}
                  activeSegmentType={
                    audioState.isPlaying &&
                    audioState.bookId === progress.currentBookId &&
                    audioState.chapterNumber === progress.currentChapter
                      ? audioState.segmentType
                      : null
                  }
                  activeSegmentIndex={audioState.segmentIndex}
                  readSegments={progress.readSegments}
                  isExpandingAI={isExpandingAI}
                  onExpandWithAI={handleExpandChapterWithAI}
                  onPlayCommentaryBlock={(blockIndex) =>
                    playSegmentAt(
                      progress.currentBookId,
                      progress.currentChapter,
                      'commentary',
                      blockIndex
                    )
                  }
                  onToggleSegmentRead={(segmentKey) => {
                    const idx = currentChapterData.commentary.blocks.findIndex(
                      (b) =>
                        `${progress.currentBookId}-${progress.currentChapter}:c:${b.id}` ===
                        segmentKey
                    );
                    const block = currentChapterData.commentary.blocks[Math.max(0, idx)];
                    markSegmentAndCheckpoint(
                      progress.currentBookId,
                      currentBook.name,
                      progress.currentChapter,
                      'commentary',
                      Math.max(0, idx),
                      segmentKey,
                      `Komentarz: ${block?.label || 'Egzegeza'}`,
                      true
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: PLAN CZYTANIA BIBLII 365 DNI (13 ETAPÓW KOLEJNOŚCI)
           =================================================================== */}
        {activeTab === 'plan' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  13 Etapów Planu Czytania · Od Ewangelii Mateusza do Starożytnych Dzieł
                </p>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  Plan Czytania Biblii 365
                </h1>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-3xl">
                  Kolejność czytań: 1. Ewangelia Mateusza · 2. Dzieje Apostolskie · 3. Tora · 4.
                  Ewangelia Marka · 5. Listy Apostolskie · 6. Księgi Historyczne · 7. Ewangelia
                  Łukasza · 8. Apokalipsa · 9. Księgi Mądrościowe · 10. Ewangelia Jana · 11.
                  Apokryfy · 12. Księgi Prorockie · 13. Inne starożytne dzieła.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-stone-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPlanFilter('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      planFilter === 'all'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Wszystkie (365)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanFilter('unread')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      planFilter === 'unread'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Do przeczytania ({365 - progress.completedDays.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanFilter('completed')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      planFilter === 'completed'
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Ukończone ({progress.completedDays.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={planSearch}
                    onChange={(e) => setPlanSearch(e.target.value)}
                    placeholder="Szukaj dnia, etapu lub księgi..."
                    className="min-h-[40px] pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Interactive 13-Stage Filter Bar */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPlanStageFilter('ALL')}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  planStageFilter === 'ALL'
                    ? 'bg-amber-900 dark:bg-amber-600 text-white'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                Wszystkie 13 etapów
              </button>
              {PLAN_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setPlanStageFilter(stage.number)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    planStageFilter === stage.number
                      ? 'bg-amber-900 dark:bg-amber-600 text-white font-semibold'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {stage.shortLabel}
                </button>
              ))}
            </div>

            {/* 365 Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlanDays.map((day) => {
                const isCompleted = progress.completedDays.includes(day.dayNumber);
                const firstReading = day.readings[0];

                return (
                  <div
                    key={day.dayNumber}
                    className={`p-5 rounded-2xl border transition-colors flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-emerald-950/5 dark:bg-emerald-950/20 border-emerald-700/30'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1 tabular-nums">
                        <span className="font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">
                          Dzień {day.dayNumber} z 365
                        </span>
                        <span>
                          ok. {day.estimatedMinutes} min · {isCompleted ? 'Przeczytano' : 'W toku'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-1">
                        {day.stageName}
                      </div>

                      <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                        {day.title}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                        {day.theme}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {day.readings.map((r, rIdx) => {
                          const chapters: number[] = [];
                          for (let c = r.fromChapter; c <= r.toChapter; c++) {
                            chapters.push(c);
                          }
                          return chapters.map((cNum) => {
                            const cKey = `${r.bookId}-${cNum}`;
                            const isChDone = progress.readChapters.includes(cKey);
                            return (
                              <button
                                key={`${rIdx}-${cKey}`}
                                type="button"
                                onClick={() => {
                                  setProgress((prev) => ({ ...prev, planDay: day.dayNumber }));
                                  navigateToChapter(r.bookId, cNum);
                                  setActiveTab('reader');
                                }}
                                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                                  isChDone
                                    ? 'bg-emerald-900/15 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-amber-900 hover:text-white'
                                }`}
                              >
                                {r.bookShortcut} {cNum} {isChDone ? '✓' : ''}
                              </button>
                            );
                          });
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          if (firstReading) {
                            setProgress((prev) => ({ ...prev, planDay: day.dayNumber }));
                            navigateToChapter(firstReading.bookId, firstReading.fromChapter);
                            setActiveTab('reader');
                          }
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-900 dark:bg-amber-600 text-white text-xs font-semibold hover:bg-amber-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Czytaj i słuchaj</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTogglePlanDayRead(day.dayNumber)}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isCompleted
                            ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-900/10 dark:bg-emerald-500/15'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isCompleted ? 'Ukończono' : 'Oznacz dzień'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 3: KATALOG KSIĄG, APOKRYFÓW I STAROŻYTNYCH DZIEŁ (13 ETAPÓW)
           =================================================================== */}
        {activeTab === 'books' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  Pełny Katalog w Kolejności 13 Etapów Planu Czytania ({BIBLE_BOOKS.length} Ksiąg i
                  Dzieł)
                </p>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  Księga po Księdze i Rozdział po Rozdziale
                </h1>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  placeholder="Szukaj księgi, apokryfu, łaciny..."
                  className="min-h-[40px] pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs"
                />
              </div>
            </div>

            {/* Completeness Verification Summary across all 13 Stages */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  Weryfikacja Kompletności Planu: 13 Etapów · {BIBLE_BOOKS.length} Ksiąg i Dzieł ·{' '}
                  {TOTAL_PLAN_CHAPTERS} Rozdziałów
                </h2>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  Wszystkie księgi i rozdziały zweryfikowane i kompletne ✓
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {PLAN_STAGES.map((stage) => {
                  const stageBooks = BIBLE_BOOKS.filter((b) => b.stageId === stage.id);
                  const stageChapters = stageBooks.reduce((acc, b) => acc + b.totalChapters, 0);
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() =>
                        setStageFilter((prev) => (prev === stage.id ? 'ALL' : stage.id))
                      }
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        stageFilter === stage.id
                          ? 'bg-amber-900/10 dark:bg-amber-500/15 border-amber-800 dark:border-amber-500'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200/80 dark:border-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {stage.shortLabel}
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 mt-0.5 tabular-nums">
                        Ksiąg: {stageBooks.length} · Rozdziałów: {stageChapters}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 13 Stage Filter Buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  stageFilter === 'ALL'
                    ? 'bg-amber-900 dark:bg-amber-600 text-white'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                Wszystkie ({BIBLE_BOOKS.length})
              </button>
              {PLAN_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setStageFilter(stage.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    stageFilter === stage.id
                      ? 'bg-amber-900 dark:bg-amber-600 text-white font-semibold'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {stage.shortLabel}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBooks.map((book) => {
                const readInBook = Array.from(
                  { length: book.totalChapters },
                  (_, i) => i + 1
                ).filter((c) => progress.readChapters.includes(`${book.id}-${c}`)).length;
                const isExpanded = expandedBookId === book.id;

                return (
                  <div
                    key={book.id}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 tabular-nums">
                        <span className="font-semibold text-amber-900 dark:text-amber-400">
                          {book.stageName} · {book.period}
                        </span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          Przeczytano: {readInBook} / {book.totalChapters} rozdz.
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
                        {book.name} ({book.shortcut})
                      </h3>

                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-3">
                        Łac. <span className="italic">{book.latinName}</span> · Gr.{' '}
                        <span>{book.greekName}</span>
                        {book.hebrewName ? ` · Hebr. ${book.hebrewName}` : ''}
                        {book.aramaicName ? ` · Aram. ${book.aramaicName}` : ''}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                        <strong className="font-semibold">Kontekst i geopolityka:</strong>{' '}
                        {book.geopoliticsSummary}
                      </p>

                      {isExpanded && (
                        <div className="mb-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                          <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                            Kliknij rozdział, aby otworzyć tekst i komentarz:
                          </p>
                          <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto pr-1">
                            {Array.from({ length: book.totalChapters }, (_, i) => i + 1).map(
                              (chNum) => {
                                const isChRead = progress.readChapters.includes(
                                  `${book.id}-${chNum}`
                                );
                                return (
                                  <button
                                    key={chNum}
                                    type="button"
                                    onClick={() => {
                                      navigateToChapter(book.id, chNum);
                                      setActiveTab('reader');
                                    }}
                                    className={`min-h-[36px] rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                                      isChRead
                                        ? 'bg-emerald-950/15 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-700/20'
                                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-900 hover:text-white'
                                    }`}
                                  >
                                    {chNum}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          navigateToChapter(book.id, 1);
                          setActiveTab('reader');
                        }}
                        className="min-h-[40px] px-4 py-2 rounded-xl bg-amber-900 dark:bg-amber-600 text-white text-xs font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
                      >
                        Otwórz księgę
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedBookId(isExpanded ? '' : book.id)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200 transition-colors cursor-pointer"
                      >
                        {isExpanded
                          ? 'Ukryj listę rozdziałów'
                          : `Wybierz rozdział (1–${book.totalChapters})`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 4: SYNCHRONIZACJA MIĘDZYURZĄDZENIOWA I ZAPAMIĘTYWANIE MIEJSCA
           =================================================================== */}
        {activeTab === 'sync' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold mb-2">
                <Cloud className="w-4 h-4" />
                <span>Automatyczna Synchronizacja Międzyurządzeniowa</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Kontynuuj czytanie na dowolnym smartfonie, komputerze i przeglądarce
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                Wszystkie przeczytane rozdziały, sekcje komentarza, notatki oraz dokładne miejsce
                zatrzymania Lektora AI TTS są zapisywane automatycznie na serwerze pod Twoim
                identyfikatorem synchronizacji.
              </p>

              {/* Current Saved Checkpoint Card */}
              <div className="p-5 rounded-xl bg-stone-100/80 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 mb-6">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  Ostatnio zapamiętane miejsce czytania / lektora AI TTS:
                </div>
                <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {progress.checkpoint.bookName} · Rozdział {progress.checkpoint.chapterNumber} —{' '}
                  {progress.checkpoint.segmentLabel}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 tabular-nums">
                  Ostatnia aktualizacja:{' '}
                  {new Date(progress.checkpoint.updatedAt).toLocaleString('pl-PL')}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleResumeCheckpoint(false)}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer"
                  >
                    Przejdź do tego rozdziału
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResumeCheckpoint(true)}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-900 dark:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Wznów czytanie Lektorem AI</span>
                  </button>
                </div>
              </div>

              {/* Sync Code Configuration */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Identyfikator profilu synchronizacji (domyślny działa automatycznie wszędzie)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={syncInputCode}
                    onChange={(e) => setSyncInputCode(e.target.value.toUpperCase())}
                    placeholder="np. WNR365-DOMYSLNY"
                    className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const code = (syncInputCode || DEFAULT_SYNC_CODE).toUpperCase().trim();
                      setProgress((prev) => ({ ...prev, syncCode: code }));
                      pullSyncFromServer(code, true);
                    }}
                    disabled={isSyncing}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-900 dark:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Synchronizuj teraz</span>
                  </button>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Status: {syncStatusText} · Przeczytane rozdziały: {progress.readChapters.length} ·
                  Przeczytane sekcje: {progress.readSegments.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SMARTPHONE BOTTOM NAVIGATION BAR (< md) */}
      <nav
        aria-label="Nawigacja mobilna"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#FBF9F5]/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 grid grid-cols-4 items-center"
      >
        <button
          type="button"
          onClick={() => setActiveTab('reader')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'reader'
              ? 'text-amber-900 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Czytnik & AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'plan'
              ? 'text-amber-900 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Plan 365</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'books'
              ? 'text-amber-900 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Księgi (13 et.)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sync')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'sync'
              ? 'text-amber-900 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Cloud className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Postęp</span>
        </button>
      </nav>
    </div>
  );
}
