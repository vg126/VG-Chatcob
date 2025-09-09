/* Accordion selector for nested model categories with search and keyboard nav */
(() => {
  class AccordionManager {
    constructor(options = {}) {
      this.options = {
        virtualScrollEnabled: true,
        virtualScrollItemHeight: 28,
        searchDebounceMs: 150,
        ...options
      };
      this.state = new Map(); // id -> { data, filteredData, isExpanded, selectedItem, searchTerm }
      this.expandedSections = new Set(); // keys: `${id}-${category}`
      this.highlightedItemEl = null;
    }

    create(id, data, { onSelect } = {}) {
      const container = document.getElementById(id);
      if (!container) return;
      const st = {
        id,
        data,
        filteredData: data,
        isExpanded: false,
        selectedItem: null,
        searchTerm: ''
      };
      this.state.set(id, { ...st, onSelect: onSelect || (() => {}) });
      this.bindUI(container);
      this.render(id);
    }

    bindUI(container) {
      const id = container.id;
      const selected = container.querySelector('.accordion-selected-display');
      selected.addEventListener('click', () => this.toggle(id));
      selected.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(id); }
        if (e.key === 'ArrowDown') { e.preventDefault(); this.focusFirstItem(container); }
      });

      const search = container.querySelector('.accordion-search');
      let t;
      search.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          this.setSearchTerm(id, search.value);
        }, this.options.searchDebounceMs);
      });

      container.addEventListener('keydown', (e) => {
        if (!this.state.get(id).isExpanded) return;
        if (e.key === 'Escape') { this.toggle(id, false); selected.focus(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); this.moveHighlight(container, 1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); this.moveHighlight(container, -1); }
        if (e.key === 'Enter') { e.preventDefault(); this.selectHighlighted(container); }
      });
    }

    toggle(id, force = null) {
      const st = this.state.get(id);
      if (!st) return;
      const newState = (force === null) ? !st.isExpanded : !!force;
      st.isExpanded = newState;
      const c = document.getElementById(id);
      c.classList.toggle('collapsed', !newState);
      this.render(id);
      if (newState) {
        const s = c.querySelector('.accordion-search');
        if (s) setTimeout(() => s.focus(), 0);
      }
    }

    setSearchTerm(id, term) {
      const st = this.state.get(id);
      if (!st) return;
      st.searchTerm = term.trim().toLowerCase();
      st.filteredData = this.filterData(st.data, st.searchTerm);
      // Expand all sections with results while searching
      if (st.searchTerm) this.autoExpandSections(id, st.filteredData);
      this.render(id);
    }

    filterData(data, term) {
      if (!term) return data;
      const out = {};
      for (const [cat, val] of Object.entries(data)) {
        if (Array.isArray(val)) {
          const arr = val.filter(x => x.toLowerCase().includes(term));
          if (arr.length) out[cat] = arr;
        } else if (val && typeof val === 'object') {
          const sub = {};
          for (const [subcat, arr] of Object.entries(val)) {
            const f = (arr || []).filter(x => x.toLowerCase().includes(term));
            if (f.length) sub[subcat] = f;
          }
          if (Object.keys(sub).length) out[cat] = sub;
        }
      }
      return out;
    }

    autoExpandSections(id, filteredData) {
      for (const cat of Object.keys(filteredData)) {
        this.expandedSections.add(`${id}-${cat}`);
      }
    }

    moveHighlight(container, dir) {
      const items = Array.from(container.querySelectorAll('.accordion-item'));
      if (!items.length) return;
      let idx = items.findIndex(el => el.classList.contains('highlighted'));
      items.forEach(el => el.classList.remove('highlighted'));
      idx = (idx + dir + items.length) % items.length;
      const el = items[idx];
      el.classList.add('highlighted');
      el.scrollIntoView({ block: 'nearest' });
      this.highlightedItemEl = el;
    }

    selectHighlighted(container) {
      if (this.highlightedItemEl) this.highlightedItemEl.click();
    }

    render(id) {
      const st = this.state.get(id);
      const container = document.getElementById(id);
      const wrap = container.querySelector('.accordion-wrapper');
      wrap.innerHTML = '';
      const data = st.filteredData;

      // Build sections
      for (const [cat, val] of Object.entries(data)) {
        const sec = document.createElement('div');
        sec.className = 'accordion-section';
        sec.dataset.category = cat;
        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.innerHTML = `<span class="accordion-header-text">${cat}</span>`;
        header.addEventListener('click', () => this.toggleSection(id, cat));
        sec.appendChild(header);

        const content = document.createElement('div');
        content.className = 'accordion-content';
        const key = `${id}-${cat}`;
        if (this.expandedSections.has(key)) content.classList.add('expanded');

        const addItems = (arr) => {
          arr.forEach(item => {
            const it = document.createElement('div');
            it.className = 'accordion-item';
            it.textContent = item;
            it.dataset.item = item;
            it.tabIndex = 0;
            it.addEventListener('click', () => this.selectItem(id, item));
            it.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.selectItem(id, item); });
            content.appendChild(it);
          });
        };

        if (Array.isArray(val)) {
          addItems(val);
        } else if (val && typeof val === 'object') {
          for (const [subcat, arr] of Object.entries(val)) {
            const sub = document.createElement('div');
            sub.className = 'accordion-subsection';
            const sh = document.createElement('div');
            sh.className = 'accordion-subheader';
            sh.textContent = subcat;
            sub.appendChild(sh);
            addItems(arr || []);
            content.appendChild(sub);
          }
        }

        sec.appendChild(content);
        wrap.appendChild(sec);
      }
    }

    toggleSection(id, cat) {
      const k = `${id}-${cat}`;
      if (this.expandedSections.has(k)) this.expandedSections.delete(k); else this.expandedSections.add(k);
      this.render(id);
    }

    selectItem(id, item) {
      const st = this.state.get(id);
      st.selectedItem = item;
      const container = document.getElementById(id);
      const label = container.querySelector('#selected-model-label');
      if (label) label.textContent = item;
      if (typeof st.onSelect === 'function') st.onSelect(item, id);
      this.toggle(id, false);
    }

    focusFirstItem(container) {
      const it = container.querySelector('.accordion-item');
      if (it) it.focus();
    }
  }

  window.VGAccordion = { AccordionManager };
})();

