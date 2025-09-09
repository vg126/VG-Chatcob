(() => {
  const MODEL_DATABASE = {
  "Favorites": [
    "GPT-5",
    "GPT-4.1",
    "o3-pro",
    "o1",
    "Gemini-2.5-Pro",
    "Claude-Opus-4-Reasoning",
    "Claude-Opus-4.1",
    "Claude-Opus-4-Search",
    "Claude-Sonnet-4-Search",
    "Grok-4",
    "Mistral-Large-2"
  ],
  "Web Search": [
    "Web-Search",
    "Claude-Opus-4-Search",
    "Claude-Sonnet-4-Search",
    "Claude-Sonnet-3.7-Search",
    "Claude-Sonnet-3.5-Search",
    "Claude-Haiku-3.5-Search",
    "Gemini-2.5-Pro",
    "Gemini-2.5-Flash",
    "Gemini-1.5-Pro-Search",
    "Gemini-1.5-Flash-Search",
    "GPT-4o-Search",
    "GPT-4o-mini-Search",
    "Grok-4",
    "Perplexity-Sonar",
    "Perplexity-Sonar-Pro",
    "Perplexity-Sonar-Rsn",
    "Perplexity-Sonar-Rsn-Pro",
    "Linkup-Deep-Search",
    "Linkup-Standard",
    "Bagoodex-Web-Search",
    "Reka-Research",
    "GPT-Researcher"
  ],
  "GPT": {
    "GPT-5 Series": [
      "GPT-5",
      "GPT-5-Chat",
      "GPT-5-mini",
      "GPT-5-nano"
    ],
    "GPT-4 Series": [
      "GPT-4.1",
      "GPT-4.1-mini",
      "GPT-4.1-nano",
      "GPT-4o",
      "GPT-4o-Aug",
      "GPT-4o-Search",
      "GPT-4o-mini",
      "GPT-4o-mini-Search",
      "GPT-4-Classic",
      "GPT-4-Classic-0314",
      "GPT-4-Turbo",
      "ChatGPT-4o-Latest"
    ],
    "GPT-3.5 Series": [
      "GPT-3.5-Turbo",
      "GPT-3.5-Turbo-Instruct",
      "GPT-3.5-Turbo-Raw"
    ],
    "o-Series": [
      "o1",
      "o1-mini",
      "o3",
      "o3-pro",
      "o3-mini",
      "o3-mini-high",
      "o4-mini"
    ]
  },
  "GPT - Open Weight": {
    "120B Models": [
      "GPT-OSS-120B",
      "GPT-OSS-120B-T",
      "GPT-OSS-120B-CS",
      "GPT-OSS-120B-Omni",
      "OpenAI-GPT-OSS-120B"
    ],
    "20B Models": [
      "GPT-OSS-20B",
      "GPT-OSS-20B-T",
      "OpenAI-GPT-OSS-20B"
    ]
  },
  "Google": {
    "Gemini 2.5": [
      "Gemini-2.5-Pro",
      "Gemini-2.5-Flash",
      "Gemini-2.5-Flash-Lite",
      "Gemini-2.5-Flash-Image"
    ],
    "Gemini 2.0": [
      "Gemini-2.0-Flash",
      "Gemini-2.0-Flash-Lite",
      "Gemini-2.0-Flash-Preview"
    ],
    "Gemini 1.5": [
      "Gemini-1.5-Pro",
      "Gemini-1.5-Pro-Search",
      "Gemini-1.5-Flash",
      "Gemini-1.5-Flash-Search"
    ],
    "Gemma": [
      "Gemma-3-27B",
      "Gemma-2-27b-T"
    ]
  },
  "Claude": {
    "Opus": [
      "Claude-Opus-4.1",
      "Claude-Opus-4",
      "Claude-Opus-4-Reasoning",
      "Claude-Opus-4-Search",
      "Claude-Opus-3"
    ],
    "Sonnet": [
      "Claude-Sonnet-4",
      "Claude-Sonnet-4-Reasoning",
      "Claude-Sonnet-4-Search",
      "Claude-Sonnet-3.7",
      "Claude-Sonnet-3.7-Reasoning",
      "Claude-Sonnet-3.7-Search",
      "Claude-Sonnet-3.5",
      "Claude-Sonnet-3.5-June",
      "Claude-Sonnet-3.5-Search"
    ],
    "Haiku": [
      "Claude-Haiku-3.5",
      "Claude-Haiku-3.5-Search",
      "Claude-Haiku-3"
    ]
  },
  "Grok": [
    "Grok-4",
    "Grok-3",
    "Grok-3-Mini",
    "Grok-Code-Fast-1",
    "Grok-2"
  ],
  "Llama 4": [
    "Llama-4-Scout-B10",
    "Llama-4-Scout",
    "Llama-4-Scout-T",
    "Llama-4-Scout-CS",
    "Llama-4-Maverick",
    "Llama-4-Maverick-B10",
    "Llama-4-Maverick-T"
  ],
  "Llama 3.X": {
    "405B Models": [
      "Llama-3.1-405B",
      "Llama-3.1-405B-T",
      "Llama-3.1-405B-FW",
      "Llama-3.1-405B-FP16"
    ],
    "70B Models": [
      "Llama-3.3-70B",
      "Llama-3.3-70B-CS",
      "Llama-3.3-70B-DI",
      "Llama-3.3-70B-FW",
      "Llama-3.3-70B-N",
      "Llama-3.3-70B-Omni",
      "Llama-3.1-70B",
      "Llama-3.1-70B-FP16",
      "Llama-3.1-70B-FW",
      "Llama-3.1-70B-T",
      "Llama-3.1-Nemotron",
      "Llama-3-70B-FP16",
      "Llama-3-70B-T"
    ],
    "8B Models": [
      "Llama-3.1-8B",
      "Llama-3.1-8B-CS",
      "Llama-3.1-8B-DI",
      "Llama-3.1-8B-FP16",
      "Llama-3.1-8B-FW",
      "Llama-3.1-8B-T-128k",
      "Llama-3-8B-T"
    ]
  },
  "Qwen": {
    "480B": [
      "Qwen3-480B-Coder-CS",
      "Qwen3-Coder-480B-T",
      "Qwen3-Coder-480B-N"
    ],
    "235B": [
      "Qwen-3-235B-2507-T",
      "Qwen3-235B-2507-FW",
      "Qwen3-235B-2507-CS",
      "Qwen3-235B-A22B",
      "Qwen3-235B-A22B-DI",
      "Qwen3-235B-A22B-N",
      "Qwen3-235B-Think-CS"
    ],
    "72B": [
      "Qwen-72B-T",
      "Qwen2-72B-Instruct-T",
      "Qwen2.5-VL-72B-T",
      "Qwen-2.5-72B-T"
    ],
    "32B": [
      "Qwen3-30B-A3B-Instruct",
      "Qwen2.5-Coder-32B",
      "Qwen-2.5-Coder-32B-T",
      "Qwen3-32B-CS",
      "Qwen3-Coder-30B-A3B"
    ],
    "Others": [
      "Qwen-2.5-7B-T",
      "Qwen-2.5-VL-32b",
      "Qwen3-Coder"
    ]
  },
  "DeepSeek": {
    "R1 Series": [
      "DeepSeek-R1",
      "DeepSeek-R1-FW",
      "DeepSeek-R1-DI",
      "DeepSeek-R1-N",
      "DeepSeek-R1-Distill",
      "DeepSeek-R1-Turbo-DI"
    ],
    "V3 Series": [
      "DeepSeek-V3.1",
      "DeepSeek-V3.1-Chat",
      "DeepSeek-V3.1-N",
      "DeepSeek-V3",
      "DeepSeek-V3-DI",
      "DeepSeek-V3-Turbo-DI",
      "Deepseek-V3-FW"
    ],
    "Specialized": [
      "DeepSeek-Prover-V2",
      "DeepClaude"
    ]
  },
  "Mistral": {
    "Large": [
      "Mistral-Large-2"
    ],
    "Medium": [
      "Mistral-Medium-3",
      "Mistral-Medium",
      "Magistral-Medium-2506-Thinking"
    ],
    "Small": [
      "Mistral-Small-3.2",
      "Mistral-Small-3.1",
      "Mistral-Small-3",
      "Mistral-7B-v0.3-DI",
      "Mistral-7B-v0.3-T"
    ],
    "Specialized": [
      "Mistral-NeMo",
      "Mixtral8x22b-Inst-FW"
    ]
  },
  "Perplexity": [
    "Perplexity-Sonar",
    "Perplexity-Sonar-Pro",
    "Perplexity-Sonar-Rsn",
    "Perplexity-Sonar-Rsn-Pro"
  ],
  "Reasoning Models": [
    "QwQ-32B-B10",
    "QwQ-32B-Preview-T",
    "QwQ-32B-T"
  ],
  "Specialty Tools": [
    "Assistant",
    "App-Creator",
    "GPT-Researcher",
    "Python",
    "MarkItDown",
    "FLUX-pro-1.1-ultra",
    "Tako"
  ],
  "Wildcards": {
    "Chinese Models": [
      "Kimi-K2",
      "Kimi-K2-0905-T",
      "Kimi-K2-Instruct",
      "Kimi-K2-T",
      "GLM-4.5",
      "GLM-4.5-Air",
      "GLM-4.5-Air-T",
      "GLM-4.5-FW",
      "GLM-4.5-Omni",
      "MiniMax-M1"
    ],
    "Others": [
      "Aya-Expanse-32B",
      "Aya-Vision",
      "Command-R",
      "Command-R-Plus",
      "Hermes-3-70B",
      "Inception-Mercury",
      "Inception-Mercury-Coder",
      "Phi-4-DI",
      "Reka-Core",
      "Reka-Flash",
      "Solar-Pro-2"
    ]
  }
};

  window.VGModels = MODEL_DATABASE;
})();