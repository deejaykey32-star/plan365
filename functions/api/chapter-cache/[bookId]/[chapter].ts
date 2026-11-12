interface Env {
  CHAPTERS_KV?: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const bookId = String(context.params.bookId || '');
  const chapter = String(context.params.chapter || '');
  const key = `${bookId}-${chapter}`;

  if (context.env.CHAPTERS_KV) {
    const cachedData = await context.env.CHAPTERS_KV.get(key, 'json');
    if (cachedData) {
      return new Response(JSON.stringify({ cached: true, data: cachedData }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  return new Response(JSON.stringify({ cached: false }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
