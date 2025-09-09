(function() {
    /**
     * android-enhancements.js - Mobile optimization module for VGChat
     * Solves: small interface, no session persistence, no zoom capability
     * @version 1.0.0
     */
    'use strict';

    // Mobile detection
    const isMobile = {
        check: function() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            const isSmallScreen = window.innerWidth <= 768;
            return isMobileUA || (isTouchDevice && isSmallScreen);
        }
    };

    // Only activate on mobile
    if (!isMobile.check()) {
        console.log('[VGChat Mobile] Desktop detected, enhancements disabled');
        return;
    }

    console.log('[VGChat Mobile] Mobile device detected, applying enhancements');

    /**
     * 1. INTERFACE SCALING - Inject mobile-optimized CSS
     */
    const MobileStyles = {
        init: function() {
            const style = document.createElement('style');
            style.id = 'vgchat-mobile-styles';
            style.textContent = `
                /* Base scaling for mobile */
                @media (max-width: 768px) {
                    :root {
                        --mobile-scale: 1;
                        --mobile-font-base: 18px;
                        --mobile-touch-min: 44px;
                    }
                    
                    body {
                        font-size: var(--mobile-font-base) !important;
                        -webkit-text-size-adjust: 100%;
                        touch-action: manipulation;
                    }
                    
                    /* Larger touch targets */
                    button, .accordion-selected-display {
                        min-height: var(--mobile-touch-min) !important;
                        min-width: var(--mobile-touch-min) !important;
                        padding: 12px 16px !important;
                        font-size: 16px !important;
                    }
                    
                    input[type="password"], input[type="text"], textarea, select {
                        font-size: 16px !important; /* Prevents zoom on iOS */
                        padding: 12px !important;
                        min-height: var(--mobile-touch-min) !important;
                    }
                    
                    /* Header improvements */
                    .vgchat-header {
                        padding: 12px !important;
                        gap: 12px !important;
                        grid-template-columns: 1fr !important;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                    }
                    
                    .key-input-group {
                        flex-wrap: wrap;
                        gap: 10px !important;
                    }
                    
                    .key-input-group input[type="password"] {
                        width: 100% !important;
                        flex: 1 1 100%;
                    }
                    
                    .key-input-group button {
                        flex: 0 1 auto;
                    }
                    
                    /* Model selector mobile */
                    .model-selector-container {
                        width: 100%;
                    }
                    
                    .accordion-container {
                        width: 100% !important;
                        min-width: unset !important;
                    }
                    
                    .accordion-wrapper {
                        max-height: 40vh !important;
                    }
                    
                    .accordion-item {
                        padding: 10px 14px !important;
                        font-size: 15px !important;
                        min-height: 40px !important;
                        display: flex;
                        align-items: center;
                    }
                    
                    /* Messages area */
                    .vgchat-main {
                        padding: 16px 12px !important;
                    }
                    
                    .message {
                        padding: 14px !important;
                        font-size: 16px !important;
                        line-height: 1.5 !important;
                        max-width: 85% !important;
                    }
                    
                    .message.user {
                        align-self: flex-end;
                    }
                    
                    .message.assistant {
                        align-self: flex-start;
                    }
                    
                    .meta {
                        font-size: 14px !important;
                        margin-bottom: 8px !important;
                    }
                    
                    /* Input area - FIXED BOTTOM */
                    .vgchat-input {
                        padding: 12px !important;
                        gap: 10px !important;
                        background: var(--vg-bg-primary);
                        border-top: 2px solid var(--vg-border);
                        position: fixed !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        z-index: 1000 !important;
                        max-width: 960px !important;
                        margin: 0 auto !important;
                    }
                    
                    /* Adjust main content to avoid overlap with fixed input */
                    .vgchat-main {
                        padding-bottom: 80px !important;
                    }
                    
                    .vgchat-input textarea {
                        min-height: 50px !important;
                        max-height: 200px !important;
                        line-height: 1.4 !important;
                    }
                    
                    .vgchat-input button {
                        padding: 14px 20px !important;
                        font-weight: 600;
                    }
                    
                    /* Flags panel mobile */
                    .flags-panel {
                        padding: 12px !important;
                        margin: 12px 0 !important;
                    }
                    
                    .flag-row {
                        grid-template-columns: 1fr !important;
                        gap: 6px !important;
                    }
                    
                    .flag-label {
                        font-size: 14px !important;
                        font-weight: 600;
                    }
                    
                    /* Status text */
                    .status {
                        font-size: 14px !important;
                        gap: 10px !important;
                    }
                    
                    /* Zoom-aware scaling */
                    body.zoomed * {
                        transform-origin: top left;
                    }
                }
                
                /* Improved scrolling */
                .vgchat-main {
                    -webkit-overflow-scrolling: touch;
                    scroll-behavior: smooth;
                }
                
                /* Better focus states */
                input:focus, textarea:focus, button:focus {
                    outline: 2px solid var(--vg-primary);
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    };

    /**
     * 2. SESSION PERSISTENCE - Save and restore conversation
     */
    const SessionManager = {
        STORAGE_KEY: 'vgchat_session',
        BACKUP_INTERVAL: 5000, // Auto-save every 5 seconds
        
        init: function() {
            this.restoreSession();
            this.startAutoBackup();
            this.attachEventListeners();
        },
        
        saveSession: function() {
            try {
                const session = {
                    timestamp: Date.now(),
                    messages: this.captureMessages(),
                    model: document.getElementById('selected-model-label')?.textContent || '',
                    apiKey: this.getStoredApiKey(),
                    flags: this.captureFlags()
                };
                
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
                console.log('[Session] Saved', session.messages.length, 'messages');
            } catch (e) {
                console.error('[Session] Save failed:', e);
            }
        },
        
        restoreSession: function() {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (!stored) return;
                
                const session = JSON.parse(stored);
                const hoursSinceLastSave = (Date.now() - session.timestamp) / (1000 * 60 * 60);
                
                // Only restore if less than 24 hours old
                if (hoursSinceLastSave > 24) {
                    console.log('[Session] Data too old, clearing');
                    localStorage.removeItem(this.STORAGE_KEY);
                    return;
                }
                
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.applySession(session));
                } else {
                    setTimeout(() => this.applySession(session), 100);
                }
            } catch (e) {
                console.error('[Session] Restore failed:', e);
            }
        },
        
        applySession: function(session) {
            // Restore API key if remembered
            if (session.apiKey) {
                const apiKeyInput = document.getElementById('api-key');
                const rememberCheckbox = document.getElementById('remember-tab');
                if (apiKeyInput && session.apiKey) {
                    apiKeyInput.value = session.apiKey;
                    if (rememberCheckbox) rememberCheckbox.checked = true;
                }
            }
            
            // Restore messages
            if (session.messages && session.messages.length > 0) {
                const messagesContainer = document.getElementById('messages');
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                    session.messages.forEach(msg => {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = `message ${msg.role}`;
                        messageDiv.innerHTML = `
                            <div class="meta">
                                <span class="role">${msg.role}</span>
                                <span class="time">${msg.time || ''}</span>
                            </div>
                            <div class="content">${this.escapeHtml(msg.content)}</div>
                        `;
                        messagesContainer.appendChild(messageDiv);
                    });
                    
                    // Scroll to bottom
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    console.log('[Session] Restored', session.messages.length, 'messages');
                }
            }
            
            // Restore model selection (wait for accordion to load)
            if (session.model) {
                setTimeout(() => {
                    const modelLabel = document.getElementById('selected-model-label');
                    if (modelLabel && session.model !== 'Loading models…') {
                        modelLabel.textContent = session.model;
                        // Trigger model change event if app.js is loaded
                        if (window.vgchatApp && window.vgchatApp.setModel) {
                            window.vgchatApp.setModel(session.model);
                        }
                    }
                }, 500);
            }
        },
        
        captureMessages: function() {
            const messages = [];
            const messageElements = document.querySelectorAll('.message');
            
            messageElements.forEach(el => {
                const role = el.classList.contains('user') ? 'user' : 'assistant';
                const content = el.querySelector('.content')?.textContent || el.textContent || '';
                const time = el.querySelector('.time')?.textContent || '';
                
                messages.push({ role, content, time });
            });
            
            return messages;
        },
        
        captureFlags: function() {
            // Capture current flag settings if panel exists
            const flags = {};
            const flagInputs = document.querySelectorAll('.flag-control input, .flag-control select');
            flagInputs.forEach(input => {
                if (input.id) {
                    flags[input.id] = input.value;
                }
            });
            return flags;
        },
        
        getStoredApiKey: function() {
            const rememberCheckbox = document.getElementById('remember-tab');
            const apiKeyInput = document.getElementById('api-key');
            
            if (rememberCheckbox?.checked && apiKeyInput?.value) {
                return apiKeyInput.value;
            }
            return null;
        },
        
        startAutoBackup: function() {
            setInterval(() => {
                const messages = document.querySelectorAll('.message');
                if (messages.length > 0) {
                    this.saveSession();
                }
            }, this.BACKUP_INTERVAL);
        },
        
        attachEventListeners: function() {
            // Save on message send
            const sendButton = document.getElementById('send');
            if (sendButton) {
                const originalClick = sendButton.onclick;
                sendButton.onclick = (e) => {
                    if (originalClick) originalClick(e);
                    setTimeout(() => this.saveSession(), 1000);
                };
            }
            
            // Save on page unload
            window.addEventListener('beforeunload', () => this.saveSession());
            
            // Save on visibility change (tab switch)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) this.saveSession();
            });
        },
        
        escapeHtml: function(text) {
            if (!text) return '';
            // Clean text to prevent Unicode/ByteString errors
            const cleanText = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            const div = document.createElement('div');
            div.textContent = cleanText;
            return div.innerHTML;
        }
    };

    /**
     * 3. ZOOM HANDLER - Enable pinch-to-zoom with proper scaling
     */
    const ZoomHandler = {
        currentScale: 1,
        MIN_SCALE: 0.5,
        MAX_SCALE: 3,
        
        init: function() {
            this.setupViewport();
            this.attachGestureHandlers();
            this.attachButtonControls();
        },
        
        setupViewport: function() {
            // Update viewport to allow zooming
            let viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                viewport = document.createElement('meta');
                viewport.name = 'viewport';
                document.head.appendChild(viewport);
            }
            viewport.content = 'width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=3.0, user-scalable=yes';
        },
        
        attachGestureHandlers: function() {
            let initialDistance = 0;
            let initialScale = 1;
            
            // Pinch zoom handling
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                    initialScale = this.currentScale;
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                    const scale = (currentDistance / initialDistance) * initialScale;
                    this.setScale(scale);
                }
            }, { passive: false });
        },
        
        attachButtonControls: function() {
            // Add zoom controls to header
            const zoomControls = document.createElement('div');
            zoomControls.className = 'zoom-controls';
            zoomControls.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 10px;
                display: flex;
                gap: 8px;
                z-index: 1000;
                background: rgba(255,255,255,0.95);
                padding: 4px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            
            zoomControls.innerHTML = `
                <button id="zoom-out" style="width: 40px; height: 40px; font-size: 20px; border: 1px solid #ccc; background: white; border-radius: 4px;">−</button>
                <button id="zoom-reset" style="width: 40px; height: 40px; font-size: 14px; border: 1px solid #ccc; background: white; border-radius: 4px;">1×</button>
                <button id="zoom-in" style="width: 40px; height: 40px; font-size: 20px; border: 1px solid #ccc; background: white; border-radius: 4px;">+</button>
            `;
            
            document.body.appendChild(zoomControls);
            
            // Attach click handlers
            document.getElementById('zoom-in').addEventListener('click', () => {
                this.setScale(this.currentScale + 0.25);
            });
            
            document.getElementById('zoom-out').addEventListener('click', () => {
                this.setScale(this.currentScale - 0.25);
            });
            
            document.getElementById('zoom-reset').addEventListener('click', () => {
                this.setScale(1);
            });
        },
        
        setScale: function(scale) {
            // Clamp scale
            scale = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, scale));
            this.currentScale = scale;
            
            // Apply scale to root font size
            document.documentElement.style.setProperty('--mobile-scale', scale);
            document.documentElement.style.fontSize = (16 * scale) + 'px';
            
            // Update zoom indicator
            const resetBtn = document.getElementById('zoom-reset');
            if (resetBtn) {
                resetBtn.textContent = scale.toFixed(1) + '×';
            }
            
            // Add class for zoom-aware styling
            if (scale !== 1) {
                document.body.classList.add('zoomed');
            } else {
                document.body.classList.remove('zoomed');
            }
        },
        
        getDistance: function(touch1, touch2) {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
    };

    /**
     * Additional mobile improvements
     */
    const MobileImprovements = {
        init: function() {
            this.improveTextarea();
            this.addSwipeGestures();
            this.preventAccidentalRefresh();
            this.addHapticFeedback();
        },
        
        improveTextarea: function() {
            const textarea = document.getElementById('user-input');
            if (!textarea) return;
            
            // Auto-resize textarea
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(200, this.scrollHeight) + 'px';
            });
            
            // Better keyboard handling
            textarea.addEventListener('focus', () => {
                // Scroll input into view with padding
                setTimeout(() => {
                    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        },
        
        addSwipeGestures: function() {
            let touchStartX = 0;
            let touchStartY = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                
                // Detect horizontal swipe on header to toggle theme
                if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50) {
                    const header = document.querySelector('.vgchat-header');
                    if (header && header.contains(e.target)) {
                        const themeBtn = document.getElementById('theme-btn');
                        if (themeBtn) themeBtn.click();
                    }
                }
            });
        },
        
        preventAccidentalRefresh: function() {
            // Prevent pull-to-refresh when not at top
            let lastY = 0;
            
            document.addEventListener('touchstart', (e) => {
                lastY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchmove', (e) => {
                const y = e.touches[0].clientY;
                const scrollTop = document.querySelector('.vgchat-main')?.scrollTop || 0;
                
                // Prevent refresh if scrolled down or swiping up
                if (scrollTop > 0 || y < lastY) {
                    e.preventDefault();
                }
                lastY = y;
            }, { passive: false });
        },
        
        addHapticFeedback: function() {
            // Add haptic feedback to buttons if supported
            if ('vibrate' in navigator) {
                document.addEventListener('click', (e) => {
                    if (e.target.matches('button, .accordion-item, .accordion-selected-display')) {
                        navigator.vibrate(10);
                    }
                });
            }
        }
    };

    /**
     * Initialize all mobile enhancements
     */
    function initialize() {
        try {
            MobileStyles.init();
            SessionManager.init();
            ZoomHandler.init();
            MobileImprovements.init();
            
            console.log('[VGChat Mobile] All enhancements loaded successfully');
            
            // Expose session manager for debugging
            window.vgchatSession = SessionManager;
            
        } catch (error) {
            console.error('[VGChat Mobile] Initialization failed:', error);
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
