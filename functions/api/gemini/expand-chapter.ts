interface Env {
  GEMINI_API_KEY?: string;
  CHAPTERS_KV?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY nie jest skonfigurowany w środowisku Cloudflare Pages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await context.request.json().catch(() => ({}))) as any;
    const { bookId, bookName, shortcut, chapterNumber, period, geopoliticsSummary } = body;

    if (!bookId || !bookName || !chapterNumber) {
      return new Response(
        JSON.stringify({ error: 'Brak wymaganych parametrów księgi i rozdziału' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cacheKey = `${bookId}-${chapterNumber}`;
    if (context.env.CHAPTERS_KV) {
      const cached = await context.env.CHAPTERS_KV.get(cacheKey, 'json');
      if (cached && !body.forceRefresh) {
        return new Response(JSON.stringify({ data: cached, fromCache: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const prompt = `Jesteś wybitnym polskim biblistą, filologiem języków starożytnych (hebrajski, aramejski, greka koine, łacina), historykiem starożytnego Bliskiego Wschodu i archeologiem biblijnym.
Opracuj pogłębiony 8-częściowy komentarz egzegetyczno-filologiczny dla:
Księga / Dzieło: ${bookName} (${shortcut || ''}), Rozdział: ${chapterNumber}
Okres historyczny: ${period || ''}
Kontekst: ${geopoliticsSummary || ''}

Wygeneruj WYŁĄCZNIE poprawny obiekt JSON:
{
  "title": "Tytuł przewodni rozdziału",
  "summary": "Szczegółowe wprowadzenie do treści i przesłania rozdziału (3-4 zdania)",
  "exegesis": "Pogłębiona egzegeza teologiczna, struktura literacka i sens duchowy (5-7 zdań)",
  "linguistics": [
    {
      "original": "tekst w alfabecie hebr/aram/greckim/łac",
      "transliteration": "transliteracja",
      "language": "hebrajski",
      "meaning": "znaczenie",
      "theologicalContext": "wyjaśnienie teologiczne"
    }
  ],
  "geopolitics": {
    "powers": "mocarstwa epoki",
    "historicalBackground": "tło geopolityczne"
  },
  "history": {
    "chronology": "datowanie",
    "eventsAndArcheology": "fakty historyczne i archeologiczne"
  },
  "geography": {
    "locations": ["Nazwa1", "Nazwa2"],
    "description": "opis topograficzny"
  },
  "faunaFlora": {
    "species": ["gatunek1", "gatunek2"],
    "significance": "znaczenie symboliczne i przyrodnicze"
  },
  "cultureAndCustoms": {
    "topics": ["temat1", "temat2"],
    "description": "kultura, prawo i obyczaje"
  },
  "apocryphaLinks": "powiązania z apokryfami i pismami Ojców Kościoła"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const apiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return new Response(JSON.stringify({ error: `Gemini API error: ${errText}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resJson: any = await apiRes.json();
    const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(rawText.trim());

    if (context.env.CHAPTERS_KV) {
      await context.env.CHAPTERS_KV.put(cacheKey, JSON.stringify(parsed));
    }

    return new Response(JSON.stringify({ data: parsed, fromCache: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Błąd serwera' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
