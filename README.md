# VGChat — A Universal AI Studio Client

VGChat is a lightweight, HTML-first chat client that talks to the Poe OpenAI-compatible API. It prioritizes a **zero-install setup**, fast iteration, and a modular, "latch-on" component architecture. This repository serves as the unified source of truth for the project, ensuring cross-platform consistency between desktop and Android (Termux) environments.

## 🚀 Quick Start

**No installation required!** Simply:

1. **Download or clone** this repository
2. **Open `index.html`** directly in your web browser
3. **Enter your Poe API key** and start chatting

That's it! No server setup, no build process, no dependencies.

## ✨ Key Features

* **216 AI Models**: Comprehensive model selector with favorites, search models, GPT series, Claude, Grok, Llama, Qwen, DeepSeek, Mistral, and more
* **Zero-Install Architecture**: Pure HTML/CSS/JS - runs directly from the filesystem
* **Advanced Model Selector**: Searchable, categorized accordion with Chinese models, reasoning models, and specialty tools
* **Dynamic Theming**: Six preset themes with local persistence
* **Per-Model Flags**: A dedicated UI for appending model-specific flags to your prompts
* **Conversation Branching**: A powerful, in-chat interface for creating, navigating, and visualizing branching conversation paths and rewrites

## 📁 File Structure

The project uses a modular, component-based architecture:

```
├── index.html              # Main entry point (just loads components)
├── assets/
│   ├── accordion.js         # Model selector UI component
│   ├── api.js              # Poe API communication  
│   ├── app.js              # Main application logic
│   ├── flags.js            # Per-model flags system
│   ├── model-database.js    # All 216 AI models (auto-generated)
│   ├── model-flags.js      # Model flag configurations (auto-generated)
│   ├── styles.css          # Application styling
│   └── theme.js            # Theme management system
└── README.md
```

### Component Philosophy

* **index.html** remains lightweight - just an index, not the book
* **No fetch() calls** - everything loads as script components
* **Modular design** - each .js file exports to `window.VG*` namespace
* **Zero dependencies** - runs directly in browser without server

## 🔄 Recent Architectural Changes (September 2025)

### Script Component Architecture
**Problem Solved**: CORS errors when using `fetch()` with `file://` URLs prevented zero-install usage.

**Solution**: Converted all local data files to JavaScript script components:
- `data/model-database.json` → `assets/model-database.js` (exports `window.VGModels`)
- `data/model-flags.json` → `assets/model-flags.js` (exports `window.VGModelFlags`)

**Benefits**:
- ✅ True zero-install - no server setup required
- ✅ Consistent with existing component architecture 
- ✅ Better error handling (no hidden fetch failures)
- ✅ Faster loading (no network requests for local data)

### Model Database Expansion
- **Expanded**: 186 → 216 AI models from comprehensive Poe model survey
- **Added**: Chinese Models, Reasoning Models, Specialty Tools categories
- **Preserved**: User's curated Favorites list unchanged
- **Organized**: Hierarchical categories for better navigation

### Flags System Redesign  
- **Removed**: Toggle button complexity
- **Auto-behavior**: Flags auto-show when model supports them, auto-hide when none
- **Stepped sliders**: Discrete increments instead of continuous ranges
  - Gemini models: 4096-token increments
  - Claude models: 4000-token increments  
  - GPT reasoning: Minimal/Low/Medium/High steps
- **Default state**: Always starts at "Default" (no flag sent)

### Development Philosophy
> "index.html should remain an index, not the book" - keeps entry point lightweight while components handle complexity

This architecture ensures the app remains truly portable and installation-free while supporting advanced functionality.
