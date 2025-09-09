# VGChat — A Universal AI Studio Client

VGChat is a lightweight, HTML-first chat client that talks to the Poe OpenAI-compatible API. It prioritizes a zero-install setup, fast iteration, and a modular, "latch-on" component architecture. This repository serves as the unified source of truth for the project, ensuring cross-platform consistency between desktop and Android (Termux) environments.

## ✨ Key Features

* **Unified Interface**: A single, clean UI for interacting with numerous AI models.
* **Advanced Model Selector**: A searchable, categorized accordion for quick model access.
* **Dynamic Theming**: Six preset themes with local persistence.
* **Per-Model Flags**: A dedicated UI for appending model-specific flags to your prompts.
* **Conversation Branching**: A powerful, in-chat interface for creating, navigating, and visualizing branching conversation paths and rewrites. Currently a work in progress.
* **Android Enhancements**: Platform-specific tweaks intended to improve the mobile experience on Android devices.

## 📁 File Structure

The project is organized to separate structure (HTML), logic (JS), styling (CSS), and data (MD).

## 📝 Development Notes

* `branching.js` is included for experimental conversation branching and will likely evolve further.
* `android-enhancements.js` provides Android-specific overrides and may be dynamically loaded when an Android environment is detected.
