interface Env {
  GEMINI_API_KEY?: string;
}

function pcm24kToWavBase64(pcmBase64: string): string {
  const binaryString = atob(pcmBase64);
  const len = binaryString.length;
  const pcmBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pcmBytes[i] = binaryString.charCodeAt(i);
  }

  // If already a WAV file (starts with "RIFF")
  if (len >= 4 && binaryString.slice(0, 4) === 'RIFF') {
    return pcmBase64;
  }

  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  const buffer = new ArrayBuffer(44 + len);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + len, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, len, true);

  const outBytes = new Uint8Array(buffer);
  outBytes.set(pcmBytes, 44);

  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < outBytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, outBytes.subarray(i, i + chunk) as unknown as number[]);
  }
  return btoa(binary);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY nie jest skonfigurowany w Cloudflare Pages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await context.request.json().catch(() => ({}))) as any;
    const { text, voice = 'Kore' } = body;
    if (!text) {
      return new Response(JSON.stringify({ error: 'Brak tekstu do syntezy mowy' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const readingText = String(text).slice(0, 4800);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const apiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Przeczytaj spokojnym, wyraźnym głosem lektora biblijnego po polsku: ${readingText}` }],
          },
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return new Response(JSON.stringify({ error: `Błąd Gemini TTS API: ${errText}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resJson: any = await apiRes.json();
    const base64Audio = resJson.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return new Response(JSON.stringify({ error: 'Brak strumienia audio w odpowiedzi' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const wavBase64 = pcm24kToWavBase64(base64Audio);
    return new Response(
      JSON.stringify({
        audioUrl: `data:audio/wav;base64,${wavBase64}`,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Błąd serwera TTS' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
