import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI server-side client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DATA_DIR = path.join(__dirname, '.data');
const SYNC_FILE = path.join(DATA_DIR, 'sync-store.json');
const CHAPTER_CACHE_FILE = path.join(DATA_DIR, 'chapters-cache.json');
const CHAPTERS_1TO1_FILE = path.join(DATA_DIR, 'chapters-1to1-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface LastReadCheckpoint {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  segmentType: 'verse' | 'commentary';
  segmentIndex: number;
  segmentLabel: string;
  updatedAt: string;
}

interface SyncRecord {
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

interface VerbatimChapterEntry {
  title: string;
  text: string;
  s2: string;
  s3: string;
  s4: string;
  s5: string;
  s6: string;
  s7: string;
}

const syncStore: Record<string, SyncRecord> = {};
const chapterCache: Record<string, any> = {};
const chapters1to1Db: Record<string, VerbatimChapterEntry> = {};

try {
  if (fs.existsSync(CHAPTERS_1TO1_FILE)) {
    const raw1to1 = fs.readFileSync(CHAPTERS_1TO1_FILE, 'utf-8');
    Object.assign(chapters1to1Db, JSON.parse(raw1to1));
    console.log(`Loaded ${Object.keys(chapters1to1Db).length} 1:1 verbatim chapters from chapters-1to1-db.json`);
  }
} catch (e) {
  console.error('Failed to load chapters-1to1-db.json:', e);
}

try {
  if (fs.existsSync(SYNC_FILE)) {
    const raw = fs.readFileSync(SYNC_FILE, 'utf-8');
    Object.assign(syncStore, JSON.parse(raw));
  }
} catch (e) {
  console.error('Failed to load sync store:', e);
}

try {
  if (fs.existsSync(CHAPTER_CACHE_FILE)) {
    const raw = fs.readFileSync(CHAPTER_CACHE_FILE, 'utf-8');
    const parsedCache = JSON.parse(raw);
    // Ensure any cached entries preserve 1:1 verbatim text from chapters1to1Db
    for (const [k, val] of Object.entries(parsedCache)) {
      if (chapters1to1Db[k] && val && typeof val === 'object') {
        (val as any).verses = [{ number: 1, text: chapters1to1Db[k].text }];
      }
      chapterCache[k] = val;
    }
  }
} catch (e) {
  console.error('Failed to load chapter cache:', e);
}

function saveSyncStore() {
  try {
    fs.writeFileSync(SYNC_FILE, JSON.stringify(syncStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save sync store:', e);
  }
}

function saveChapterCache() {
  try {
    fs.writeFileSync(CHAPTER_CACHE_FILE, JSON.stringify(chapterCache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save chapter cache:', e);
  }
}

function build1to1ChapterPayload(key: string) {
  const entry = chapters1to1Db[key];
  if (!entry) return null;

  const cachedAi = chapterCache[key] || {};
  const exegesisCombined = [entry.s3, entry.s5].filter(Boolean).join(' ');
  const apocryphaAndChrist = [entry.s6, entry.s7].filter(Boolean).join(' Powiązania biblijne i patrystyczne: ');

  return {
    title: cachedAi.title || entry.title,
    // Always enforce 1:1 verbatim chapter text (zero hallucinations, zero verse numbers)
    verses: [
      {
        number: 1,
        text: entry.text,
      },
    ],
    summary: cachedAi.summary || entry.s2 || entry.title,
    exegesis: cachedAi.exegesis || exegesisCombined || entry.s2,
    linguistics: Array.isArray(cachedAi.linguistics) && cachedAi.linguistics.length > 0 ? cachedAi.linguistics : undefined,
    geopolitics: cachedAi.geopolitics?.powers
      ? cachedAi.geopolitics
      : entry.s4
      ? {
          powers: 'Kontekst historyczno-geopolityczny epoki biblijnej',
          historicalBackground: entry.s4,
        }
      : undefined,
    history: cachedAi.history?.chronology
      ? cachedAi.history
      : entry.s4
      ? {
          chronology: 'Przekaz historyczny i tradycja rękopiśmienna',
          eventsAndArcheology: `${entry.s4} ${entry.s3 ? entry.s3.slice(0, 360) : ''}`.trim(),
        }
      : undefined,
    geography: cachedAi.geography,
    faunaFlora: cachedAi.faunaFlora,
    cultureAndCustoms: cachedAi.cultureAndCustoms?.topics
      ? cachedAi.cultureAndCustoms
      : entry.s4
      ? {
          topics: ['Prawo Przymierza, liturgia i obyczaje epoki', 'Kontekst społeczny i religijny'],
          description: entry.s4,
        }
      : undefined,
    apocryphaLinks: cachedAi.apocryphaLinks || apocryphaAndChrist || undefined,
  };
}

function createDefaultSyncRecord(code: string): SyncRecord {
  const now = new Date().toISOString();
  return {
    syncCode: code,
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
}

// Cross-browser, cross-OS, cross-device automatic synchronization endpoints
app.get('/api/sync/:syncCode', (req, res) => {
  const code = (req.params.syncCode || 'WNR365-DOMYSLNY').toUpperCase().trim();
  if (!syncStore[code]) {
    syncStore[code] = createDefaultSyncRecord(code);
    saveSyncStore();
  } else if (
    syncStore[code].currentBookId === 'GEN' &&
    syncStore[code].readChapters.length === 0
  ) {
    syncStore[code] = createDefaultSyncRecord(code);
    saveSyncStore();
  }
  return res.json(syncStore[code]);
});

app.post('/api/sync/:syncCode', (req, res) => {
  const code = (req.params.syncCode || 'WNR365-DOMYSLNY').toUpperCase().trim();
  const existing = syncStore[code] || createDefaultSyncRecord(code);
  const incoming = req.body || {};

  // Merge arrays cleanly so no device overwrites read progress from another device
  const mergeUnique = (a: any[] = [], b: any[] = []) => Array.from(new Set([...(a || []), ...(b || [])]));

  const replaceArrays = Boolean(incoming._replaceArrays);

  const updated: SyncRecord = {
    ...existing,
    ...incoming,
    syncCode: code,
    readChapters: replaceArrays
      ? incoming.readChapters || []
      : mergeUnique(existing.readChapters, incoming.readChapters),
    readCommentaries: replaceArrays
      ? incoming.readCommentaries || []
      : mergeUnique(existing.readCommentaries, incoming.readCommentaries),
    readSegments: replaceArrays
      ? incoming.readSegments || []
      : mergeUnique(existing.readSegments, incoming.readSegments),
    completedDays: replaceArrays
      ? incoming.completedDays || []
      : mergeUnique(existing.completedDays, incoming.completedDays),
    bookmarks: replaceArrays
      ? incoming.bookmarks || []
      : mergeUnique(existing.bookmarks, incoming.bookmarks),
    notes: {
      ...(existing.notes || {}),
      ...(incoming.notes || {}),
    },
    lastReadTimestamp: new Date().toISOString(),
  };

  delete (updated as any)._replaceArrays;

  syncStore[code] = updated;
  saveSyncStore();

  return res.json({ success: true, record: updated });
});

// Get 1:1 verbatim chapter & commentary immediately
app.get('/api/chapter-cache/:bookId/:chapter', (req, res) => {
  const key = `${req.params.bookId}-${req.params.chapter}`;
  const payload = build1to1ChapterPayload(key);
  if (payload) {
    return res.json({ cached: true, data: payload });
  }
  if (chapterCache[key]) {
    return res.json({ cached: true, data: chapterCache[key] });
  }
  return res.json({ cached: false });
});

// Expand 8-dimension commentary via Gemini while keeping 1:1 verbatim Biblical text intact
app.post('/api/gemini/expand-chapter', async (req, res) => {
  try {
    const { bookId, bookName, shortcut, chapterNumber, period, geopoliticsSummary } = req.body;
    if (!bookId || !bookName || !chapterNumber) {
      return res.status(400).json({ error: 'Brak wymaganych parametrów księgi i rozdziału' });
    }

    const cacheKey = `${bookId}-${chapterNumber}`;
    const verbatimEntry = chapters1to1Db[cacheKey];

    if (!req.body.forceRefresh && verbatimEntry) {
      return res.json({ data: build1to1ChapterPayload(cacheKey), fromCache: true });
    }

    const chapterSnippet = verbatimEntry ? verbatimEntry.text.slice(0, 1800) : '';

    const prompt = `Jesteś wybitnym polskim biblistą, filologiem języków starożytnych (hebrajski, aramejski, greka koine, łacina), historykiem starożytnego Bliskiego Wschodu i archeologiem biblijnym.
Opracuj pogłębiony 8-częściowy komentarz egzegetyczno-filologiczny dla:
Księga / Dzieło: ${bookName} (${shortcut}), Rozdział: ${chapterNumber}
Okres historyczny: ${period || ''}
Kontekst: ${geopoliticsSummary || ''}
Początek tekstu źródłowego rozdziału: ${chapterSnippet}

Wygeneruj w formacie JSON:
1. "title": Tytuł przewodni tego konkretnego rozdziału (${bookName}, rozdział ${chapterNumber}).
2. "summary": Szczegółowe wprowadzenie do treści i przesłania rozdziału ${bookName} ${chapterNumber} (3-4 zdania).
3. "exegesis": Pogłębiona egzegeza teologiczna, struktura literacka i sens duchowy całego rozdziału ${bookName} ${chapterNumber} (5-7 zdań).
4. "linguistics": Tablica 4 kluczowych pojęć filologicznych bezpośrednio z rozdziału ${bookName} ${chapterNumber} (uwzględnij hebrajski, aramejski, grecki i łaciński), każdy obiekt z polami:
   - "original" (zapis w oryginalnym alfabecie hebrajskim/aramejskim/greckim lub łacińskim)
   - "transliteration" (transliteracja fonetyczna)
   - "language" (jedna z wartości: "hebrajski", "aramejski", "grecki", "łaciński")
   - "meaning" (dosłowne znaczenie)
   - "theologicalContext" (głębokie wyjaśnienie egzegetyczne tego słowa w tym rozdziale)
5. "geopolitics": Obiekt z polami "powers" (mocarstwa, władcy i siły polityczne epoki) oraz "historicalBackground" (szczegółowa analiza geopolityczna tego rozdziału).
6. "history": Obiekt z polami "chronology" (datowanie wydarzeń) oraz "eventsAndArcheology" (odkrycia archeologiczne, inskrypcje, stele, papirusy, rękopisy i fakty historyczne potwierdzające realia rozdziału).
7. "geography": Obiekt z polami "locations" (tablica nazw miejsc, gór, rzek, miast i krain z tego rozdziału) oraz "description" (opis geograficzno-topograficzny i szlaki handlowe/militarne).
8. "faunaFlora": Obiekt z polami "species" (tablica roślin, drzew, zbóż, zwierząt, ptaków, minerałów obecnych lub związanych z rozdziałem) oraz "significance" (ich znaczenie przyrodnicze, gospodarcze i symboliczne).
9. "cultureAndCustoms": Obiekt z polami "topics" (tablica zwyczajów, praw, instytucji i rytuałów z rozdziału) oraz "description" (wyjaśnienie kultury, prawa starożytnego i obyczajów semickich/grecko-rzymskich).
10. "apocryphaLinks": Powiązania tego rozdziału z apokryfami (np. 1 Księga Henocha, Księga Jubileuszy, 4 Ezdrasza, Psalmy Salomona, Testamenty Dwunastu Patriarchów), rękopisami z Qumran oraz starożytnymi dziełami wczesnochrześcijańskimi (Didache, Klemens, Ignacy, Pasterz Hermasa).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            exegesis: { type: Type.STRING },
            linguistics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  transliteration: { type: Type.STRING },
                  language: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  theologicalContext: { type: Type.STRING },
                },
              },
            },
            geopolitics: {
              type: Type.OBJECT,
              properties: {
                powers: { type: Type.STRING },
                historicalBackground: { type: Type.STRING },
              },
            },
            history: {
              type: Type.OBJECT,
              properties: {
                chronology: { type: Type.STRING },
                eventsAndArcheology: { type: Type.STRING },
              },
            },
            geography: {
              type: Type.OBJECT,
              properties: {
                locations: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING },
              },
            },
            faunaFlora: {
              type: Type.OBJECT,
              properties: {
                species: { type: Type.ARRAY, items: { type: Type.STRING } },
                significance: { type: Type.STRING },
              },
            },
            cultureAndCustoms: {
              type: Type.OBJECT,
              properties: {
                topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING },
              },
            },
            apocryphaLinks: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    // Lock 1:1 verbatim chapter verses so AI never modifies or hallucinates the Biblical text
    if (verbatimEntry) {
      parsed.verses = [{ number: 1, text: verbatimEntry.text }];
    }
    chapterCache[cacheKey] = parsed;
    saveChapterCache();

    return res.json({ data: build1to1ChapterPayload(cacheKey) || parsed, fromCache: false });
  } catch (error: any) {
    console.error('Błąd expand-chapter Gemini:', error);
    const fallbackKey = `${req.body?.bookId}-${req.body?.chapterNumber}`;
    if (chapters1to1Db[fallbackKey]) {
      return res.json({ data: build1to1ChapterPayload(fallbackKey), fromCache: true });
    }
    return res.status(500).json({
      error: 'Nie udało się wygenerować rozszerzonego opracowania AI: ' + (error?.message || 'Błąd serwera'),
    });
  }
});

function pcm24kToWavBase64(pcmBase64: string): string {
  const pcmBuf = Buffer.from(pcmBase64, 'base64');
  // If already a WAV file (starts with "RIFF"), return as-is
  if (pcmBuf.length >= 4 && pcmBuf.toString('ascii', 0, 4) === 'RIFF') {
    return pcmBase64;
  }
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const wavHeader = Buffer.alloc(44);

  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + pcmBuf.length, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  wavHeader.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(pcmBuf.length, 40);

  return Buffer.concat([wavHeader, pcmBuf]).toString('base64');
}

// Gemini AI TTS Lector Endpoint (gemini-2.5-flash-preview-tts)
app.post('/api/gemini/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Brak tekstu do syntezy mowy' });
    }

    const readingText = String(text).slice(0, 4800);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Przeczytaj spokojnym, wyraźnym głosem lektora biblijnego po polsku: ${readingText}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Brak strumienia audio w odpowiedzi modelu' });
    }

    const wavBase64 = pcm24kToWavBase64(base64Audio);

    return res.json({
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
    });
  } catch (error: any) {
    console.error('Błąd Gemini TTS:', error);
    return res.status(500).json({
      error: 'Błąd syntezy TTS: ' + (error?.message || 'Nieznany błąd'),
    });
  }
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Biblia 365 Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
