// State
        let currentStep = 1;
        let currentResultTab = 'final';
        let settingsTab = 'general';
        let models = [];
        let enhancerSystem = '';
        let aggregatorSystem = '';
        // Thread-based history
        let allThreads = [];      // [{id, title, createdAt, turns:[{rawPrompt,improvedPrompt,finalAnswer,timestamp,chatUrls}]}]
        let currentThread = null; // active thread
        let continuationUrls = {};
        let isContinuation = false;
        // Ratings: {modelId: 1-5}
        let modelRatings = {};
        let answerDrafts = {};
        let modelCardsDirty = true;
        let comparisonDirty = true;
        let currentTaskProfile = 'balanced';
        // Auto-save
        let autosaveTimer = null;
        let autosaveStepToRestore = 1;
        let notificationTimer = null;
        const markdownCache = new Map();
        const MAX_MARKDOWN_CACHE_ENTRIES = 100;
        let preferences = {
            notificationsEnabled: true,
            useRatingsInSynthesis: true
        };

        // ═══════════════════════════════════════════════════════════════
        // LOCAL AI STATE  (LM Studio / Ollama / Custom)
        // ═══════════════════════════════════════════════════════════════
        let lmStudioSettings = {
            enabled:  false,
            provider: 'lmstudio',   // 'lmstudio'|'ollama'|'custom'|'openai'|'anthropic'|'google'
            url:      'http://localhost:1234',
            apiKey:   '',
            model:    '',
            useFor:   'both'        // 'prompt'|'synthesis'|'both'
        };

        // Per-provider credentials (apiKey + model saved separately for each provider)
        let providerCredentials = {};

        // ═══════════════════════════════════════════════════════════════
        