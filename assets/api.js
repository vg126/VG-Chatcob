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

  async function fetchModelNames() {
    const path = 'Current Lab/model names list (names only).md';
    const res = await fetch(encodeURI(path));
    if (!res.ok) throw new Error(`Failed to load model list: ${res.status}`);
    const content = await res.text();
    const lines = content.split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l && !/^model_handle$/i.test(l));
    // Deduplicate while preserving order
    const seen = new Set();
    const names = [];
    for (const l of lines) {
      if (!seen.has(l)) { seen.add(l); names.push(l); }
    }
    return names;
  }

  window.VGAPI = {
    poeChatCompletion,
    fetchModelNames
  };
})();

