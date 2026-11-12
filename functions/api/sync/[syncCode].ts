interface Env {
  SYNC_KV?: KVNamespace;
  GEMINI_API_KEY?: string;
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

const memoryStore = new Map<string, SyncRecord>();

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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const code = (String(context.params.syncCode || 'WNR365-DOMYSLNY')).toUpperCase().trim();

  let record: SyncRecord | null = null;
  if (context.env.SYNC_KV) {
    record = await context.env.SYNC_KV.get<SyncRecord>(`sync:${code}`, 'json');
  } else {
    record = memoryStore.get(code) || null;
  }

  if (!record || (record.currentBookId === 'GEN' && record.readChapters.length === 0)) {
    record = createDefaultSyncRecord(code);
    if (context.env.SYNC_KV) {
      await context.env.SYNC_KV.put(`sync:${code}`, JSON.stringify(record));
    } else {
      memoryStore.set(code, record);
    }
  }

  return new Response(JSON.stringify(record), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const code = (String(context.params.syncCode || 'WNR365-DOMYSLNY')).toUpperCase().trim();
  let existing: SyncRecord | null = null;

  if (context.env.SYNC_KV) {
    existing = await context.env.SYNC_KV.get<SyncRecord>(`sync:${code}`, 'json');
  } else {
    existing = memoryStore.get(code) || null;
  }

  if (!existing) {
    existing = createDefaultSyncRecord(code);
  }

  const incoming = (await context.request.json().catch(() => ({}))) as any;

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

  if (context.env.SYNC_KV) {
    await context.env.SYNC_KV.put(`sync:${code}`, JSON.stringify(updated));
  } else {
    memoryStore.set(code, updated);
  }

  return new Response(JSON.stringify({ success: true, record: updated }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
