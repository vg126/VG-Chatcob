(() => {
  async function loadFlagsObject() {
    const flags = await fetch('data/model-flags.json').then(r => r.json());
    return flags || {};
  }

  class FlagsManager {
    constructor() {
      this.flagsDb = {};
      this.state = {}; // {'@Model': { flagName: value }}
      try {
        const saved = localStorage.getItem('vgchat_flags_state');
        if (saved) this.state = JSON.parse(saved);
      } catch {}
    }

    async load() {
      this.flagsDb = await loadFlagsObject();
    }

    persist() {
      try { localStorage.setItem('vgchat_flags_state', JSON.stringify(this.state)); } catch {}
    }

    getModelKey(model) {
      // Flags DB uses '@Model' keys; UI uses plain names.
      return model.startsWith('@') ? model : `@${model}`;
    }

    getConfigForModel(model) {
      const key = this.getModelKey(model);
      return this.flagsDb[key] || null;
    }

    getStateForModel(model) {
      const key = this.getModelKey(model);
      return this.state[key] || {};
    }

    setStateForModel(model, flagName, value) {
      const key = this.getModelKey(model);
      if (!this.state[key]) this.state[key] = {};
      this.state[key][flagName] = value;
      this.persist();
    }

    // Build UI in container for given model
    render(containerId, model) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';
      const config = this.getConfigForModel(model);
      if (!config) {
        container.innerHTML = '<div class="flags-empty">No flags for this model.</div>';
        return;
      }
      const title = document.createElement('div');
      title.className = 'flags-title';
      title.textContent = `Flags: ${model}`;
      container.appendChild(title);

      const state = this.getStateForModel(model);
      const group = document.createElement('div');
      group.className = 'flags-group';

      for (const [flagName, def] of Object.entries(config)) {
        const row = this.createControlRow(model, flagName, def, state);
        if (row) group.appendChild(row);
      }
      container.appendChild(group);
    }

    createControlRow(model, flagName, def, state) {
      const row = document.createElement('div');
      row.className = 'flag-row';
      const label = document.createElement('label');
      label.className = 'flag-label';
      label.textContent = flagName.replace(/_/g, ' ');
      row.appendChild(label);

      const current = state[flagName] ?? 'default';

      if (def.type === 'slider') {
        const wrap = document.createElement('div');
        wrap.className = 'flag-control';
        const input = document.createElement('input');
        input.type = 'range';
        input.min = def.min ?? 0;
        input.max = def.max ?? 100;
        input.value = (current === 'default') ? (def.min ?? 0) : current;
        const val = document.createElement('span');
        val.className = 'flag-value';
        val.textContent = (current === 'default') ? 'default' : String(current);
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.title = 'Enable';
        chk.checked = current !== 'default';
        const update = () => {
          if (!chk.checked) {
            this.setStateForModel(model, flagName, 'default');
            val.textContent = 'default';
          } else {
            const v = Number(input.value);
            this.setStateForModel(model, flagName, v);
            val.textContent = String(v);
          }
        };
        input.addEventListener('input', update);
        chk.addEventListener('change', update);
        wrap.appendChild(chk);
        wrap.appendChild(input);
        wrap.appendChild(val);
        row.appendChild(wrap);
        return row;
      }

      if (def.type === 'stepped') {
        const wrap = document.createElement('div');
        wrap.className = 'flag-control';
        const select = document.createElement('select');
        const steps = ['default', ...(def.steps || [])];
        for (const s of steps) {
          const opt = document.createElement('option');
          opt.value = s;
          opt.textContent = String(s);
          if (s === current) opt.selected = true;
          select.appendChild(opt);
        }
        select.addEventListener('change', () => {
          this.setStateForModel(model, flagName, select.value);
        });
        wrap.appendChild(select);
        row.appendChild(wrap);
        return row;
      }

      if (def.type === 'advanced') {
        const wrap = document.createElement('div');
        wrap.className = 'flag-advanced';
        const advState = (current && current !== 'default') ? current : {};
        const controls = {};

        for (const [field, cfg] of Object.entries(def.fields || {})) {
          const frow = document.createElement('div');
          frow.className = 'flag-adv-row';
          const flabel = document.createElement('label');
          flabel.textContent = (cfg.label || field).replace(/_/g, ' ');
          const dependsOn = cfg.depends_on;
          const dependsVal = cfg.depends_value;

          let input;
          if (cfg.type === 'select') {
            input = document.createElement('select');
            for (const o of cfg.options || []) {
              const opt = document.createElement('option');
              opt.value = o;
              opt.textContent = String(o);
              input.appendChild(opt);
            }
            input.value = advState[field] ?? (cfg.default ?? 'none');
          } else if (cfg.type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = !!advState[field];
          } else { // text
            input = document.createElement('input');
            input.type = 'text';
            input.placeholder = cfg.placeholder || '';
            input.value = advState[field] ?? '';
          }

          controls[field] = input;
          input.addEventListener('change', () => {
            this.updateAdvancedState(model, flagName, def, controls);
            // re-evaluate visibility on dependency change
            this.applyDependencies(controls, def);
          });

          frow.appendChild(flabel);
          frow.appendChild(input);
          wrap.appendChild(frow);
        }

        // initial dependency visibility
        this.applyDependencies(controls, def);
        row.appendChild(wrap);

        // store initial
        this.updateAdvancedState(model, flagName, def, controls);
        return row;
      }

      return null;
    }

    applyDependencies(controls, def) {
      for (const [field, cfg] of Object.entries(def.fields || {})) {
        if (cfg.depends_on) {
          const depInput = controls[cfg.depends_on];
          const val = (depInput && depInput.type === 'checkbox') ? (depInput.checked ? 'true' : 'false') : depInput?.value;
          const show = val == cfg.depends_value; // loose compare on purpose
          const row = depInput ? controls[field].parentElement : null;
          if (row) row.style.display = show ? '' : 'none';
        }
      }
    }

    updateAdvancedState(model, flagName, def, controls) {
      const advObj = {};
      for (const [field, cfg] of Object.entries(def.fields || {})) {
        const input = controls[field];
        let v;
        if (cfg.type === 'checkbox') v = !!input.checked;
        else v = input.value.trim();
        // Skip empties to keep payload minimal
        if (cfg.type === 'checkbox') {
          if (v) advObj[field] = true;
        } else if (v) {
          advObj[field] = v;
        }
      }
      // If empty, store 'default'
      const finalVal = Object.keys(advObj).length ? advObj : 'default';
      this.setStateForModel(model, flagName, finalVal);
    }

    // Generate tail string like: --flag value --another "quoted value"
    generateFlagString(model) {
      const key = this.getModelKey(model);
      const modelFlags = this.state[key];
      if (!modelFlags) return '';

      const parts = [];
      for (const [fname, value] of Object.entries(modelFlags)) {
        if (value === 'default' || value === undefined || value === null) continue;
        if (fname === 'advanced_settings' && typeof value === 'object') {
          for (const [sf, sv] of Object.entries(value)) {
            if (sv === undefined || sv === null || sv === '' || sv === false || sv === 'none') continue;
            if (typeof sv === 'boolean') {
              if (sv) parts.push(`--${sf} true`);
            } else {
              // Some Canvas bots (Linkup*) expect no quotes; we mimic minimal quoting: quotes only if contains spaces
              const needsQuotes = /\s/.test(String(sv));
              parts.push(`--${sf} ${needsQuotes ? '"' + String(sv) + '"' : String(sv)}`);
            }
          }
        } else {
          parts.push(`--${fname} ${String(value)}`);
        }
      }
      return parts.length ? (' ' + parts.join(' ')) : '';
    }
  }

  window.VGFlags = { FlagsManager };
})();

