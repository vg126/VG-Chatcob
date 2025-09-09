(() => {
  const POE_BASE = 'https://api.poe.com/v1';

  async function poeChatCompletion({ apiKey, model, messages, options = {} }) {
    const url = `${POE_BASE}/chat/completions`;

    const body = {
      model,
      messages,
      stream: false,
      n: 1,
      ...options
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : {}; } catch (e) { throw new Error(`Non‑JSON response (${res.status}): ${text.slice(0,200)}`); }

    if (!res.ok) {
      const msg = json?.error?.message || res.statusText || 'Unknown error';
      const code = json?.error?.type || res.status;
      const err = new Error(`${code}: ${msg}`);
      err.status = res.status;
      err.payload = json;
      throw err;
    }

    return json;
  }

  function fetchModelNames() {
    return fetch('data/model-names.json').then(r => r.json());
  }

  window.VGAPI = {
    poeChatCompletion,
    fetchModelNames
  };
})();

