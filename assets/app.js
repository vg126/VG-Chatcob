(() => {
  const el = (sel) => document.querySelector(sel);
  const messages = [];
  let apiKey = '';
  let selectedModel = '';
  let flagsMgr = null;

  function setStatus(text) { el('#status-text').textContent = text; }

  function addMessage(role, content, model = '') {
    const container = el('#messages');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${role}${model ? ' · ' + model : ''}`;
    const body = document.createElement('div');
    body.className = 'content';
    body.textContent = content;
    div.appendChild(meta);
    div.appendChild(body);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  async function initModels() {
    setStatus('Loading models…');
    try {
      const curated = await loadCuratedDatabase();
      const names = await window.VGAPI.fetchModelNames().catch(() => []);
      const merged = buildMergedCategories(curated, names);
      setupAccordion(merged);
      // Choose default
      const defaultPref = ['GPT-4.1-mini', 'Gemini-2.0-Flash'];
      selectedModel = pickDefault(merged, defaultPref);
      updateSelectedLabel(selectedModel);
      // Load flags DB and render panel for selected model
      flagsMgr = new window.VGFlags.FlagsManager();
      await flagsMgr.load();
      renderFlags();
      setStatus('Models loaded');
    } catch (e) {
      const merged = { 'All Models': ['GPT-4.1-mini','Claude-Haiku-3','Gemini-2.0-Flash'] };
      setupAccordion(merged);
      selectedModel = 'GPT-4.1-mini';
      updateSelectedLabel(selectedModel);
      flagsMgr = new window.VGFlags.FlagsManager();
      try { await flagsMgr.load(); } catch {}
      renderFlags();
      setStatus('Models fallback');
    }
  }

  function updateSelectedLabel(name) {
    const label = el('#selected-model-label');
    if (label) label.textContent = name;
  }

  function pickDefault(db, prefs) {
    for (const p of prefs) {
      if (hasModel(db, p)) return p;
    }
    const firstCat = Object.values(db)[0];
    if (Array.isArray(firstCat)) return firstCat[0];
    // if nested, pick first nested value
    const sub = Object.values(firstCat || {})[0] || [];
    return sub[0] || 'GPT-4.1-mini';
  }

  function hasModel(db, name) {
    for (const val of Object.values(db)) {
      if (Array.isArray(val)) {
        if (val.includes(name)) return true;
      } else if (val && typeof val === 'object') {
        for (const arr of Object.values(val)) {
          if ((arr || []).includes(name)) return true;
        }
      }
    }
    return false;
  }

  async function loadCuratedDatabase() {
    const db = await fetch('data/model-database.json').then(r => r.json());
    const normalized = normalizeAtSigns(db);
    return normalized;
  }

  function normalizeAtSigns(db) {
    const out = {};
    for (const [cat, val] of Object.entries(db)) {
      if (Array.isArray(val)) {
        out[cat] = val.map(s => s.replace(/^@/, ''));
      } else if (val && typeof val === 'object') {
        const sub = {};
        for (const [k, arr] of Object.entries(val)) {
          sub[k] = (arr || []).map(s => s.replace(/^@/, ''));
        }
        out[cat] = sub;
      }
    }
    return out;
  }

  function buildMergedCategories(curated, flatList) {
    const curatedSet = new Set(flattenNames(curated));
    const flatSet = new Set((flatList || []).map(s => s.trim()).filter(Boolean));
    const symDiff = new Set([...curatedSet].filter(x => !flatSet.has(x)).concat([...flatSet].filter(x => !curatedSet.has(x))));
    const merged = { ...curated };
    const all = Array.from(new Set([...curatedSet, ...flatSet])).sort((a,b)=>a.localeCompare(b));
    merged['All Models'] = all;
    if (symDiff.size) merged['Wildcards'] = Array.from(symDiff).sort((a,b)=>a.localeCompare(b));
    return merged;
  }

  function flattenNames(db) {
    const out = [];
    for (const val of Object.values(db)) {
      if (Array.isArray(val)) out.push(...val);
      else if (val && typeof val === 'object') {
        for (const arr of Object.values(val)) out.push(...(arr || []));
      }
    }
    return out;
  }

  function setupAccordion(data) {
    const mgr = new window.VGAccordion.AccordionManager({});
    mgr.create('accordion-models', data, {
      onSelect: (model) => {
        selectedModel = model;
        updateSelectedLabel(model);
        renderFlags();
      }
    });
    // Expand first few sections by default
    const container = el('#accordion-models');
    const firstHeader = container.querySelector('.accordion-header');
    if (firstHeader) firstHeader.click();
  }

  function getKeyFromUI() {
    return el('#api-key').value.trim();
  }

  function restoreKey() {
    const saved = sessionStorage.getItem('vgchat_poe_key');
    if (saved) {
      apiKey = saved;
      el('#api-key').value = '••••••••';
      setStatus('Key loaded (session)');
    }
  }

  async function sendMessage() {
    const input = el('#user-input');
    const content = input.value.trim();
    if (!content) return;
    if (!apiKey) {
      setStatus('Enter API key first');
      el('#api-key').focus();
      return;
    }
    const model = selectedModel || 'GPT-4.1-mini';
    // Append flags at tail if present
    let finalContent = content;
    try {
      if (flagsMgr) {
        const tail = flagsMgr.generateFlagString(model);
        if (tail) finalContent = content + tail;
      }
    } catch {}

    // Update local conversation
    const userMsg = { role: 'user', content: finalContent };
    messages.push(userMsg);
    addMessage('user', content);
    input.value = '';
    setStatus('Calling Poe…');

    try {
      const json = await window.VGAPI.poeChatCompletion({
        apiKey,
        model,
        messages
      });
      const assistant = json?.choices?.[0]?.message?.content || '';
      const assistantMsg = { role: 'assistant', content: assistant };
      messages.push(assistantMsg);
      addMessage('assistant', assistant, model);
      setStatus('Done');
    } catch (err) {
      const msg = (err && (err.message || err.toString())) || 'Error';
      addMessage('assistant', `Error: ${msg}`);
      setStatus('Error');
    }
  }

  function renderFlags() {
    const panel = el('#flags-panel');
    if (!panel || !flagsMgr) return;
    flagsMgr.render('flags-panel', selectedModel || '');
  }

  function bindUI() {
    el('#set-key').addEventListener('click', () => {
      const entered = getKeyFromUI();
      if (!entered) { setStatus('Please paste your Poe API key'); return; }
      apiKey = entered;
      if (el('#remember-tab').checked) {
        sessionStorage.setItem('vgchat_poe_key', apiKey);
      }
      // Hide raw key from the field
      el('#api-key').value = '••••••••';
      setStatus('Key set');
    });

    el('#send').addEventListener('click', sendMessage);
    el('#user-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Boot
  bindUI();
  restoreKey();
  // Theme
  const theme = new window.VGTheme.ThemeManager();
  theme.load();
  const themeBtn = el('#theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', () => theme.cycle());
  const flagsBtn = el('#flags-btn');
  if (flagsBtn) flagsBtn.addEventListener('click', () => {
    const p = el('#flags-panel');
    if (p) p.classList.toggle('hidden');
  });
  // Models
  initModels();
})();
