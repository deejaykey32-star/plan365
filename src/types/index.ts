export type Testament = 'ST' | 'NT' | 'APOKRYFY' | 'DZIELA';

export type PlanStageId =
  | 'STAGE_1_MAT'
  | 'STAGE_2_ACT'
  | 'STAGE_3_TORA'
  | 'STAGE_4_MAR'
  | 'STAGE_5_LISTY'
  | 'STAGE_6_HIST'
  | 'STAGE_7_LUK'
  | 'STAGE_8_REV'
  | 'STAGE_9_MADR'
  | 'STAGE_10_JOH'
  | 'STAGE_11_APOKRYFY'
  | 'STAGE_12_PROROCY'
  | 'STAGE_13_DZIELA';

export interface BibleBook {
  id: string; // e.g. "MAT", "ACT", "GEN"
  shortcut: string; // e.g. "Mt", "Dz", "Rdz"
  name: string; // e.g. "Ewangelia według św. Mateusza"
  latinName: string;
  greekName: string;
  hebrewName?: string;
  aramaicName?: string;
  testament: Testament;
  stageId: PlanStageId;
  stageNumber: number; // 1 to 13
  stageName: string; // e.g. "1. Ewangelia Mateusza", "2. Dzieje Apostolskie", "3. Tora"...
  category:
    | 'Ewangelie'
    | 'Dzieje'
    | 'Tora'
    | 'Listy'
    | 'Historyczne'
    | 'Apokalipsa'
    | 'Mądrościowe'
    | 'Apokryfy'
    | 'Prorockie'
    | 'Starożytne Dzieła';
  totalChapters: number;
  period: string;
  geopoliticsSummary: string;
}

export interface VerseItem {
  number: number;
  text: string;
  keyTerm?: string;
}

export interface LinguisticTerm {
  original: string;
  transliteration: string;
  language: 'hebrajski' | 'aramejski' | 'grecki' | 'łaciński';
  meaning: string;
  theologicalContext: string;
}

export interface CommentaryBlock {
  id: string;
  label: string;
  title: string;
  content: string;
}

export interface ChapterCommentary {
  summary: string;
  exegesis: string;
  linguistics: LinguisticTerm[];
  geopolitics: {
    powers: string;
    historicalBackground: string;
  };
  history: {
    chronology: string;
    eventsAndArcheology: string;
  };
  geography: {
    locations: string[];
    description: string;
  };
  faunaFlora: {
    species: string[];
    significance: string;
  };
  cultureAndCustoms: {
    topics: string[];
    description: string;
  };
  apocryphaLinks: string;
  blocks: CommentaryBlock[];
}

export interface ChapterData {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  title: string;
  verses: VerseItem[];
  commentary: ChapterCommentary;
}

export interface ReadingDayPlan {
  dayNumber: number; // 1 to 365
  stageNumber: number; // 1 to 13
  stageName: string;
  title: string;
  readings: {
    bookId: string;
    bookShortcut: string;
    bookName: string;
    fromChapter: number;
    toChapter: number;
  }[];
  theme: string;
  estimatedMinutes: number;
}

export interface LastReadCheckpoint {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  segmentType: 'verse' | 'commentary';
  segmentIndex: number;
  segmentLabel: string;
  updatedAt: string;
}

export interface UserProgress {
  syncCode: string;
  readChapters: string[];
  readCommentaries: string[];
  readSegments: string[];
  completedDays: number[];
  currentBookId: string;
  currentChapter: number;
  currentVerse: number;
  planDay: number;
  checkpoint: LastReadCheckpoint;
  bookmarks: string[];
  notes: Record<string, string>;
  lastReadTimestamp: string;
}

export interface AudioPlayState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoadingAudio: boolean;
  bookId: string;
  chapterNumber: number;
  segmentType: 'verse' | 'commentary';
  segmentIndex: number;
  playbackRate: number;
  continuousMode: boolean;
  readMode: 'both' | 'verses_only' | 'commentary_only';
  engine: 'gemini_tts' | 'browser_tts';
  voiceName: string;
}
