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

  function logError(message, error) {
    console.error(`[VGChat Error] ${message}:`, error);
    setStatus(`ERROR: ${message}`);
  }

  async function initModels() {
    setStatus('Loading models…');
    console.log('[VGChat] Starting model initialization');
    
    const curated = loadCuratedDatabase();
    console.log(`[VGChat] Database loaded with ${Object.keys(curated).length} categories`);
    
    setupAccordion(curated);
    console.log('[VGChat] Accordion setup complete');
    
    // Choose default
    const defaultPref = ['GPT-4.1-mini', 'Gemini-2.0-Flash'];
    selectedModel = pickDefault(curated, defaultPref);
    console.log(`[VGChat] Selected default model: ${selectedModel}`);
    updateSelectedLabel(selectedModel);
    
    // Load flags DB and render panel for selected model
    flagsMgr = new window.VGFlags.FlagsManager();
    flagsMgr.load();
    renderFlags();
    console.log('[VGChat] Model initialization completed successfully');
    setStatus('Models loaded');
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

  function loadCuratedDatabase() {
    return window.VGModels;
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
    if (!panel || !flagsMgr) {
      console.log('[VGChat] renderFlags: panel or flagsMgr missing', { panel: !!panel, flagsMgr: !!flagsMgr });
      return;
    }
    console.log(`[VGChat] Rendering flags for model: ${selectedModel}`);
    flagsMgr.render('flags-panel', selectedModel || '');
    const hasContent = panel.innerHTML.trim().length > 0;
    console.log(`[VGChat] Flags panel has content: ${hasContent}`);
    
    // Auto-show/hide panel based on content
    if (hasContent) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
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
  // Models
  initModels();
})();
