(() => {
  const THEME_DEFINITIONS = {
    default: {
      name: 'Default',
      colors: {
        primary: '#2563EB',
        primaryHover: '#1D4ED8',
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F8FAFC',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        border: '#CBD5E1',
        accent: '#7C3AED',
        selectedBg: '#EEF4FF'
      },
      font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    },
    dark: {
      name: 'Dark',
      colors: {
        primary: '#5D5CDE',
        primaryHover: '#4A49CC',
        bgPrimary: '#0F172A',
        bgSecondary: '#1E293B',
        textPrimary: '#E2E8F0',
        textSecondary: '#94A3B8',
        border: '#334155',
        accent: '#8180FF',
        selectedBg: 'rgba(129, 128, 255, 0.16)'
      },
      font: "Inter, system-ui, -apple-system, 'Segoe UI', 'Roboto', sans-serif"
    },
    terminal: {
      name: 'Terminal',
      colors: {
        primary: '#34D399',
        primaryHover: '#10B981',
        bgPrimary: '#000000',
        bgSecondary: '#0A0A0A',
        textPrimary: '#34D399',
        textSecondary: '#6EE7B7',
        border: '#065F46',
        accent: '#A7F3D0',
        selectedBg: 'rgba(52, 211, 153, 0.12)'
      },
      font: "'Roboto Mono', monospace"
    },
    paper: {
      name: 'Paper',
      colors: {
        primary: '#268BD2',
        primaryHover: '#1E6BA8',
        bgPrimary: '#FDF6E3',
        bgSecondary: '#F9F2DF',
        textPrimary: '#586E75',
        textSecondary: '#839496',
        border: '#EEE8D5',
        accent: '#268BD2',
        selectedBg: 'rgba(38, 139, 210, 0.12)'
      },
      font: "Lora, serif"
    },
    sakura: {
      name: 'Sakura',
      colors: {
        primary: '#EC4899',
        primaryHover: '#DB2777',
        bgPrimary: '#FFF5F7',
        bgSecondary: '#FFFFFF',
        textPrimary: '#5C223A',
        textSecondary: '#9D5371',
        border: '#FECDD3',
        accent: '#EC4899',
        selectedBg: 'rgba(236, 72, 153, 0.12)'
      },
      font: "Inter, system-ui, -apple-system, 'Segoe UI', 'Roboto', sans-serif"
    },
    ayu: {
      name: 'Ayu',
      colors: {
        primary: '#FF9940',
        primaryHover: '#E6873A',
        bgPrimary: '#0A0E14',
        bgSecondary: '#0F131A',
        textPrimary: '#CBCCC6',
        textSecondary: '#5C6773',
        border: '#3D444F',
        accent: '#FF9940',
        selectedBg: 'rgba(255, 153, 64, 0.14)'
      },
      font: "'Roboto Mono', monospace"
    }
  };

  class ThemeManager {
    constructor() {
      this.current = 'default';
      this.order = ['default', 'dark', 'terminal', 'paper', 'sakura', 'ayu'];
    }

    setTheme(name) {
      if (!THEME_DEFINITIONS[name]) name = 'default';
      this.current = name;
      const t = THEME_DEFINITIONS[name];
      this.applyTheme(t);
      try { localStorage.setItem('vgchat_theme', name); } catch {}
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { name, theme: t } }));
    }

    applyTheme(t) {
      const root = document.documentElement;
      const m = new Map([
        ['--vg-primary', t.colors.primary],
        ['--vg-secondary', t.colors.accent || t.colors.primary],
        ['--vg-bg-primary', t.colors.bgPrimary],
        ['--vg-bg-secondary', t.colors.bgSecondary],
        ['--vg-text-primary', t.colors.textPrimary],
        ['--vg-text-secondary', t.colors.textSecondary],
        ['--vg-border', t.colors.border],
        ['--vg-selected-bg', t.colors.selectedBg],
        ['--font-main', t.font]
      ]);
      for (const [k, v] of m.entries()) root.style.setProperty(k, v);
    }

    cycle() {
      const idx = this.order.indexOf(this.current);
      const next = (idx + 1) % this.order.length;
      this.setTheme(this.order[next]);
    }

    load() {
      let name = 'default';
      try { name = localStorage.getItem('vgchat_theme') || 'default'; } catch {}
      this.setTheme(name);
    }
  }

  window.VGTheme = { ThemeManager, THEME_DEFINITIONS };
})();

