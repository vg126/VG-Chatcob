       COMPLETE MODEL DATABASE
           ============================================ */
        
        const MODEL_DATABASE = {
            "Favorites": [
                "@GPT-5", "@GPT-4.1", "@o3-pro", "@o1", "@Gemini-2.5-Pro",
                "@Claude-Opus-4-Reasoning", "@Claude-Opus-4.1", "@Claude-Opus-4-Search",
                "@Claude-Sonnet-4-Search", "@Grok-4", "@Mistral-Large-2"
            ],
            "Web Search": [
                "@Claude-Opus-4-Search", "@Claude-Sonnet-4-Search", "@Claude-Sonnet-3.7-Search",
                "@Gemini-2.5-Flash", "@Gemini-2.5-Pro", "@Grok-4",
                "@Perplexity-Sonar", "@Perplexity-Sonar-Rsn-Pro",
                "@GPT-4o-Search", "@Linkup-Deep-Search", "@Linkup-Standard",
                "@Bagoodex-Web-Search"
            ],
            "GPT": {
                "GPT-5 Series": ["@GPT-5-Chat", "@GPT-5", "@GPT-5-mini", "@GPT-5-nano"],
                "GPT-4 Series": [
                    "@GPT-4.1", "@GPT-4o-Search", "@GPT-4-Classic", "@GPT-4-Classic-0314",
                    "@GPT-4-Turbo", "@GPT-4.1-mini", "@GPT-4.1-nano", "@GPT-4o",
                    "@GPT-4o-mini", "@GPT-4o-mini-Search", "@GPT-4o-Aug", "@ChatGPT-4o-Latest"
                ],
                "GPT-3.5 Series": ["@GPT-3.5-Turbo", "@GPT-3.5-Turbo-Instruct", "@GPT-3.5-Turbo-Raw"],
                "o-Series": ["@o1", "@o3", "@o3-pro", "@o1-mini", "@o3-mini", "@o3-mini-high", "@o4-mini", "@o3-Pro"]
            },
            "GPT - Open Weight": {
                "120B Models": ["@GPT-OSS-120B-T", "@GPT-OSS-120B", "@GPT-OSS-120B-CS", "@OpenAI-GPT-OSS-120B"],
                "20B Models": ["@GPT-OSS-20B-T", "@GPT-OSS-20B", "@OpenAI-GPT-OSS-20B"]
            },
            "Google": {
                "Gemini 2.5": [
                    "@Gemini-2.5-Pro", "@Gemini-2.5-Flash", "@Gemini-2.5-Flash-Lite",
                    "@Gemini-2.5-Flash-Lite-Preview", "@Gemini-2.5-Flash-Image"
                ],
                "Gemini 2.0": ["@Gemini-2.0-Flash", "@Gemini-2.0-Flash-Lite", "@Gemini-2.0-Flash-Preview"],
                "Gemini 1.5": ["@Gemini-1.5-Pro", "@Gemini-1.5-Pro-Search", "@Gemini-1.5-Flash", "@Gemini-1.5-Flash-Search"],
                "Gemma": ["@Gemma-3-27B", "@Gemma-2-27b-T"]
            },
            "Claude": {
                "Opus": [
                    "@Claude-Opus-4.1", "@Claude-Opus-4", "@Claude-Opus-4-Reasoning",
                    "@Claude-Opus-4-Search", "@Claude-Opus-3"
                ],
                "Sonnet": [
                    "@Claude-Sonnet-4", "@Claude-Sonnet-4-Reasoning", "@Claude-Sonnet-4-Search",
                    "@Claude-Sonnet-3.5", "@Claude-Sonnet-3.5-June", "@Claude-Sonnet-3.5-Search",
                    "@Claude-Sonnet-3.7", "@Claude-Sonnet-3.7-Reasoning", "@Claude-Sonnet-3.7-Search"
                ],
                "Haiku": ["@Claude-Haiku-3.5", "@Claude-Haiku-3", "@Claude-Haiku-3.5-Search"]
            },
            "Grok": ["@Grok-4", "@Grok-3", "@Grok-3-Mini", "@Grok-Code-Fast-1", "@Grok-2"],
            "Llama 4": [
                "@Llama-4-Scout-B10", "@Llama-4-Maverick", "@Llama-4-Scout-T",
                "@Llama-4-Scout-CS", "@Llama-4-Scout", "@Llama-4-Maverick-T", "@Llama-4-Maverick-B10"
            ],
            "Llama 3.X": {
                "405B Models": ["@Llama-3.1-405B", "@Llama-3.1-405B-T", "@Llama-3.1-405B-FW", "@Llama-3.1-405B-FP16"],
                "70B Models": [
                    "@Llama-3-70b-Groq", "@Llama-3.3-70B", "@Llama-3.1-Nemotron",
                    "@Llama-3.3-70B-DI", "@Llama-3.3-70B-CS", "@Llama-3.3-70B-Vers",
                    "@Llama-3-70B-FP16", "@Llama-3-70B-T", "@Llama-3.1-70B",
                    "@Llama-3.1-70B-FP16", "@Llama-3.1-70B-FW", "@Llama-3.1-70B-T",
                    "@Llama-3.3-70B-FW", "@Llama-3.3-70B-N"
                ],
                "8B Models": [
                    "@Llama-3-8B-T", "@Llama-3-8b-Groq", "@Llama-3.1-8B",
                    "@Llama-3.1-8B-CS", "@Llama-3.1-8B-DI", "@Llama-3.1-8B-FP16",
                    "@Llama-3.1-8B-FW", "@Llama-3.1-8B-T-128k"
                ]
            },
            "Qwen": {
                "480B": ["@Qwen3-480B-Coder-CS", "@Qwen3-Coder-480B-T", "@Qwen3-Coder-480B-N"],
                "235B": [
                    "@Qwen-3-235B-2507-T", "@Qwen3-235B-2507-FW", "@Qwen3-235B-2507-CS",
                    "@Qwen3-235B-A22B", "@Qwen3-235B-A22B-DI", "@Qwen3-235B-A22B-N", "@Qwen3-235B-Think-CS"
                ],
                "72B": ["@Qwen-72B-T", "@Qwen2-72B-Instruct-T", "@Qwen2.5-VL-72B-T", "@Qwen-2.5-72B-T"],
                "32B": [
                    "@Qwen3-30B-A3B-Instruct", "@Qwen2.5-Coder-32B", "@Qwen2.5-Coder-32B-T",
                    "@Qwen3-32B-CS", "@Qwen3-Coder-30B-A3B"
                ],
                "Others": ["@Qwen-2.5-7B-T", "@Qwen-2.5-VL-32b", "@Qwen3-Coder"]
            },
            "DeepSeek": {
                "R1 Series": [
                    "@DeepSeek-R1", "@DeepSeek-R1-FW", "@DeepSeek-R1-DI", "@DeepSeek-R1-N",
                    "@DeepSeek-R1-Distill", "@DeepSeek-R1-Turbo-DI"
                ],
                "V3 Series": [
                    "@DeepSeek-V3.1", "@DeepSeek-V3.1-Chat", "@DeepSeek-V3.1-N",
                    "@Deepseek-V3-FW", "@DeepSeek-V3", "@DeepSeek-V3-DI", "@DeepSeek-V3-Turbo-DI"
                ],
                "Specialized": ["@DeepSeek-Prover-V2", "@DeepClaude"]
            },
            "Mistral": {
                "Large": ["@Mistral-Large-2"],
                "Medium": ["@Mistral-Medium-3", "@Mistral-Medium", "@Magistral-Medium-2506-Thinking"],
                "Small": [
                    "@Mistral-Small-3.2", "@Mistral-Small-3.1", "@Mistral-Small-3",
                    "@Mistral-7B-v0.3-DI", "@Mistral-7B-v0.3-T"
                ],
                "Specialized": ["@Mistral-NeMo", "@Mixtral8x22b-Inst-FW"]
            },
            "Perplexity": [
                "@Perplexity-R1-1776", "@Perplexity-Sonar", "@Perplexity-Sonar-Pro",
                "@Perplexity-Sonar-Rsn", "@Perplexity-Sonar-Rsn-Pro"
            ],
            "Others": [
                "@Aya-Expanse-32B", "@Aya-Vision", "@Command-R", "@Command-R-Plus",
                "@GLM-4.5", "@GLM-4.5-Air", "@GLM-4.5-Air-T", "@GLM-4.5-FW", "@GLM-4.5-Versatile",
                "@GPT-Researcher", "@Inception-Mercury", "@Inception-Mercury-Coder",
                "@Hermes-3-70B", "@Kimi-K2", "@Kimi-K2-0905-T", "@Kimi-K2-Instruct", "@Kimi-K2-T",
                "@MiniMax-M1", "@Phi-4-DI", "@QwQ-32B-B10", "@QwQ-32B-Preview-T", "@QwQ-32B-T",
                "@Reka-Core", "@Reka-Flash", "@Reka-Research", "@Tako", "@Solar-Pro-2"
            ]
        };

        // Complete flags database
        const MODEL_FLAGS = {
            "@Claude-Opus-4": { thinking_budget: { type: "slider", min: 0, max: 30768, default: "default" }},
            "@Claude-Opus-4-Reasoning": { thinking_budget: { type: "slider", min: 0, max: 30768, default: "default" }},
            "@Claude-Opus-4-Search": { thinking_budget: { type: "slider", min: 0, max: 126000, default: "default" }},
            "@Claude-Opus-4.1": { thinking_budget: { type: "slider", min: 0, max: 31999, default: "default" }},
            "@Claude-Sonnet-3.7": { thinking_budget: { type: "slider", min: 0, max: 16384, default: "default" }},
            "@Claude-Sonnet-3.7-Reasoning": { thinking_budget: { type: "slider", min: 0, max: 126000, default: "default" }},
            "@Claude-Sonnet-3.7-Search": { thinking_budget: { type: "slider", min: 0, max: 126000, default: "default" }},
            "@Claude-Sonnet-4": { thinking_budget: { type: "slider", min: 0, max: 30768, default: "default" }},
            "@Claude-Sonnet-4-Reasoning": { thinking_budget: { type: "slider", min: 0, max: 61440, default: "default" }},
            "@Claude-Sonnet-4-Search": { thinking_budget: { type: "slider", min: 0, max: 126000, default: "default" }},
            "@Gemini-2.5-Flash": { 
                thinking_budget: { type: "stepped", steps: [0, 4096, 8192, 12288, 16384, 20480, 24576], default: "default" }
            },
            "@Gemini-2.5-Flash-Lite": { 
                thinking_budget: { type: "stepped", steps: [0, 4096, 8192, 12288, 16384, 20480, 24576], default: "default" }
            },
            "@Gemini-2.5-Pro": { 
                thinking_budget: { type: "stepped", steps: [0, 4096, 8192, 12288, 16384, 20480, 24576, 28672, 32768], default: "default" }
            },
            "@GPT-5": { reasoning_effort: { type: "stepped", steps: ["minimal", "low", "medium", "high"], default: "default" }},
            "@GPT-5-mini": { reasoning_effort: { type: "stepped", steps: ["minimal", "low", "medium", "high"], default: "default" }},
            "@GPT-5-nano": { reasoning_effort: { type: "stepped", steps: ["minimal", "low", "medium", "high"], default: "default" }},
            "@o1": { reasoning_effort: { type: "stepped", steps: ["low", "medium", "high"], default: "default" }},
            "@o3": { reasoning_effort: { type: "stepped", steps: ["low", "medium", "high"], default: "default" }},
            "@o3-mini": { reasoning_effort: { type: "stepped", steps: ["low", "medium", "high"], default: "default" }},
            "@o3-pro": { reasoning_effort: { type: "stepped", steps: ["low", "medium", "high"], default: "default" }},
            "@o4-mini": { reasoning_effort: { type: "stepped", steps: ["low", "medium", "high"], default: "default" }},
            "@Grok-3-Mini": { reasoning_effort: { type: "stepped", steps: ["low", "high"], default: "default" }},
            "@Tako": { specificity: { type: "slider", min: 0, max: 100, default: "default" }},
            "@Linkup-Deep-Search": {
                advanced_settings: {
                    type: "advanced",
                    fields: {
                        domain_filter_mode: { type: "select", options: ["none", "Include", "Exclude"], default: "none" },
                        include_domains: { type: "text", placeholder: "e.g. github.com", depends_on: "domain_filter_mode", depends_value: "Include" },
                        exclude_domains: { type: "text", placeholder: "e.g. reddit.com", depends_on: "domain_filter_mode", depends_value: "Exclude" },
                        prioritize_domains: { type: "text", placeholder: "e.g. stackoverflow.com" },
                        from_date: { type: "text", placeholder: "YYYY-MM-DD" },
                        to_date: { type: "text", placeholder: "YYYY-MM-DD" },
                        include_images: { type: "checkbox", default: false },
                        image_count: { type: "text", placeholder: "Number (e.g. 5)" }
                    }
                }
            },
            "@Linkup-Standard": {
                thinking_budget: { type: "slider", min: 0, max: 32768, default: "default" },
                advanced_settings: {
                    type: "advanced",
                    fields: {
                        domain_filter_mode: { type: "select", options: ["none", "Include", "Exclude"], default: "none" },
                        include_domains: { type: "text", placeholder: "e.g. github.com", depends_on: "domain_filter_mode", depends_value: "Include" },
                        exclude_domains: { type: "text", placeholder: "e.g. reddit.com", depends_on: "domain_filter_mode", depends_value: "Exclude" },
                        prioritize_domains: { type: "text", placeholder: "e.g. stackoverflow.com" },
                        from_date: { type: "text", placeholder: "YYYY-MM-DD" },
                        to_date: { type: "text", placeholder: "YYYY-MM-DD" },
                        include_images: { type: "checkbox", default: false },
                        image_count: { type: "text", placeholder: "Number (e.g. 5)" }
                    }
                }
            },
            "@Bagoodex-Web-Search": {
                advanced_settings: {
                    type: "advanced",
                    fields: {
                        domain_filter: { type: "text", placeholder: "e.g. legal-tools.org" },
                        exclude_words: { type: "text", placeholder: "e.g. bemba" },
                        search_images: { type: "checkbox", default: false },
                        search_knowledge: { type: "checkbox", default: false },
                        search_location: { type: "checkbox", default: false },
                        search_videos: { type: "checkbox", default: false },
                        search_weather: { type: "checkbox", default: false }
                    }
                }
            }
        };

        /* ============================================
           ENHANCED UTILITY FUNCTIONS
           ============================================ */

        function showToast(message, type = 'info', duration = 2000) {
            const toast = document.createElement('div');
            toast.className = 'toast fade-in';
            toast.textContent = message;
            toast.setAttribute('role', 'alert');
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => document.body.removeChild(toast), 300);
            }, duration);
        }

        function getTimestamp() {
            const now = new Date();
            return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        }

        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                showToast('Copied to clipboard!');
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showToast('Copied to clipboard!');
                } catch (e) {
                    showToast('Failed to copy', 'error');
                }
                document.body.removeChild(textarea);
            }
        }

        function downloadJSON(data, filename) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        function downloadText(text, filename) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        /* ============================================
           THEME SYSTEM WITH TRANSITIONS
           ============================================ */

        const THEMES = ['default', 'dark', 'terminal', 'paper', 'sakura', 'ayu'];
        
        function applyTheme(themeName) {
            document.body.style.transition = 'none';
            
            if (themeName === 'default') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', themeName);
            }
            
            const label = document.getElementById('themeLabel');
            if (label) {
                const displayName = themeName.charAt(0).toUpperCase() + themeName.slice(1);
                label.textContent = window.innerWidth > 640 ? displayName : '';
            }
            
            // Update meta theme-color for mobile browsers
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                metaTheme.content = themeColor;
            }
            
            requestAnimationFrame(() => {
                document.body.style.transition = '';
            });
        }

        function cycleTheme() {
            const currentIndex = THEMES.indexOf(AppState.ui.theme);
            const nextIndex = (currentIndex + 1) % THEMES.length;
            updateState('ui.theme', THEMES[nextIndex]);
            
            
            
            
    <style>
        /* ============================================
           OPTIMIZED CSS ARCHITECTURE
           ============================================ */
        
        /* CSS Custom Properties with Fallbacks */
        :root {
            --primary: #5D5CDE;
            --primary-hover: #4A49CC;
            --bg-primary: #ffffff;
            --bg-secondary: #f7f7f7;
            --text-primary: #1a1a1a;
            --text-secondary: #666666;
            --border: #e0e0e0;
            --selected: #5D5CDE;
            --selected-bg: rgba(93, 92, 222, 0.1);
            --accent: #5D5CDE;
            --font-main: 'Inter', system-ui, -apple-system, sans-serif;
            --transition-speed: 0.2s;
            --border-radius: 8px;
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        /* Theme Definitions */
        [data-theme="dark"] {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --border: #334155;
            --accent: #8180ff;
            --selected-bg: rgba(129, 128, 255, 0.16);
        }

        [data-theme="terminal"] {
            --bg-primary: #000000;
            --bg-secondary: #0a0a0a;
            --text-primary: #34d399;
            --text-secondary: #6ee7b7;
            --border: #065f46;
            --accent: #a7f3d0;
            --selected-bg: rgba(52, 211, 153, 0.12);
            --font-main: 'Roboto Mono', monospace;
        }

        [data-theme="paper"] {
            --bg-primary: #fdf6e3;
            --bg-secondary: #f9f2df;
            --text-primary: #586e75;
            --text-secondary: #839496;
            --border: #eee8d5;
            --accent: #268bd2;
            --selected-bg: rgba(38, 139, 210, 0.12);
            --font-main: 'Lora', serif;
        }

        [data-theme="sakura"] {
            --bg-primary: #FFF5F7;
            --bg-secondary: #ffffff;
            --text-primary: #5c223a;
            --text-secondary: #9d5371;
            --border: #FECDD3;
            --accent: #EC4899;
            --selected-bg: rgba(236, 72, 153, 0.12);
        }

        [data-theme="ayu"] {
            --bg-primary: #0A0E14;
            --bg-secondary: #0F131A;
            --text-primary: #CBCCC6;
            --text-secondary: #5C6773;
            --border: #3d444f;
            --accent: #FF9940;
            --selected-bg: rgba(255, 153, 64, 0.14);
            --font-main: 'Roboto Mono', monospace;
        }
