const LMS_PROVIDERS = {
            // ── Local ──────────────────────────────────────────────────
            lmstudio: {
                label:      'LM Studio',
                isCloud:    false,
                defaultUrl: 'http://localhost:1234',
                hint:       'Open LM Studio → Local Server → Start Server. Enable OpenAI API compatibility mode.',
                modelsApi:  'openai',
                chatApi:    'openai',
                models:     null,
            },
            ollama: {
                label:      'Ollama',
                isCloud:    false,
                defaultUrl: 'http://localhost:11434',
                hint:       'Run Ollama: <code>ollama serve</code>. Pull a model: <code>ollama pull &lt;model&gt;</code>.',
                modelsApi:  'ollama',
                chatApi:    'openai',
                models:     null,
            },
            custom: {
                label:      'Other (OpenAI API)',
                isCloud:    false,
                defaultUrl: 'http://localhost:8080',
                hint:       'Any OpenAI-compatible server: LiteLLM, llama.cpp, Jan, text-generation-webui, etc.',
                modelsApi:  'openai',
                chatApi:    'openai',
                models:     null,
            },
            // ── Cloud ──────────────────────────────────────────────────
            openai: {
                label:       'OpenAI',
                isCloud:     true,
                defaultUrl:  'https://api.openai.com',
                hint:        'Get a key at <a href="https://platform.openai.com/api-keys" target="_blank" class="text-blue-500 hover:underline">platform.openai.com</a>.',
                apikeyHint:  'Key starts with <code>sk-…</code>',
                apikeyLabel: 'OpenAI API Key',
                modelsApi:   'hardcoded',
                chatApi:     'openai',
                models:      [
                    'gpt-5.4',
                    'gpt-5.4-2026-03-05',
                    'gpt-5.4-pro',
                    'gpt-5.4-pro-2026-03-05',
                    'gpt-5.4-mini',
                    'gpt-5.4-nano',
                    'gpt-5-mini',
                    'gpt-5-nano',
                    'gpt-5',
                    'gpt-4.1',
                    'gpt-5.3-codex',
                    'gpt-5.2-codex',
                    'gpt-5.1-codex',
                    'gpt-5.1-codex-max',
                    'gpt-5.1-codex-mini',
                    'gpt-5-codex',
                    'codex-mini-latest',
                ],
            },
            deepseek: {
                label:       'DeepSeek',
                isCloud:     true,
                defaultUrl:  'https://api.deepseek.com',
                hint:        'Get a key at <a href="https://platform.deepseek.com" target="_blank" class="text-blue-500 hover:underline">platform.deepseek.com</a>.',
                apikeyHint:  'API Key DeepSeek',
                apikeyLabel: 'DeepSeek API Key',
                modelsApi:   'openai',
                chatApi:     'openai',
                models:      null,
            },
            anthropic: {
                label:       'Anthropic',
                isCloud:     true,
                defaultUrl:  'http://localhost:3000',
                hint:        'Get a key at <a href="https://console.anthropic.com" target="_blank" class="text-blue-500 hover:underline">console.anthropic.com</a>.<br><span style="color:#a16207;">⚠️ Requires running proxy: <code>node proxy-server.js</code></span>',
                apikeyHint:  'Key starts with <code>sk-ant-…</code>',
                apikeyLabel: 'Anthropic API Key',
                modelsApi:   'hardcoded',
                chatApi:     'anthropic',
                models:      [
                    'claude-opus-4-6',
                    'claude-sonnet-4-5',
                    'claude-haiku-4-5',
                    'claude-opus-4-5',
                    'claude-opus-4-1',
                    'claude-sonnet-4',
                    'claude-sonnet-3-7',
                    'claude-opus-4',
                    'claude-haiku-3',
                ],
            },
            mistral: {
                label:       'Mistral AI',
                isCloud:     true,
                defaultUrl:  'https://api.mistral.ai',
                hint:        'Get a key at <a href="https://console.mistral.ai" target="_blank" class="text-blue-500 hover:underline">console.mistral.ai</a>.',
                apikeyHint:  'API Key Mistral',
                apikeyLabel: 'Mistral API Key',
                modelsApi:   'openai',
                chatApi:     'openai',
                models:      null,
            },
            huggingface: {
                label:       'Hugging Face',
                isCloud:     true,
                defaultUrl:  'https://router.huggingface.co/hf-inference/models',
                hint:        'Get a key at <a href="https://huggingface.co/settings/tokens" target="_blank" class="text-blue-500 hover:underline">huggingface.co</a>. Specify model manually, e.g.: meta-llama/Llama-3.3-70B-Instruct',
                apikeyHint:  'HF key (hf_…)',
                apikeyLabel: 'Hugging Face API Key',
                modelsApi:   'manual',
                chatApi:     'openai',
                models:      null,
                manualModel: true,
                cloudCheck:  true,
            },
            openrouter: {
                label:       'OpenRouter',
                isCloud:     true,
                defaultUrl:  'https://openrouter.ai/api',
                hint:        'Get a key at <a href="https://openrouter.ai/keys" target="_blank" class="text-blue-500 hover:underline">openrouter.ai/keys</a>. Specify model manually, e.g.: <code>anthropic/claude-3.5-sonnet</code>',
                apikeyHint:  'Key starts with <code>sk-or-…</code>',
                apikeyLabel: 'OpenRouter API Key',
                modelsApi:   'manual',
                chatApi:     'openai',
                models:      null,
                manualModel: true,
                cloudCheck:  true,
            },
            google: {
                label:       'Google (Gemini)',
                isCloud:     true,
                defaultUrl:  'https://generativelanguage.googleapis.com/v1beta/openai',
                hint:        'Get a key at <a href="https://aistudio.google.com/apikey" target="_blank" class="text-blue-500 hover:underline">aistudio.google.com</a>.',
                apikeyHint:  'Google AI Studio API Key',
                apikeyLabel: 'Google API Key',
                modelsApi:   'hardcoded',
                chatApi:     'openai',
                models:      [
                    'gemini-2.5-pro',
                    'gemini-2.5-flash',
                    'gemini-2.5-flash-lite',
                    'gemini-2.0-flash',
                    'gemini-2.0-flash-lite',
                ],
            },
            groq: {
                label:       'Groq Cloud',
                isCloud:     true,
                defaultUrl:  'https://api.groq.com/openai',
                hint:        'Get a key at <a href="https://console.groq.com/keys" target="_blank" class="text-blue-500 hover:underline">console.groq.com/keys</a>.',
                apikeyHint:  'Key starts with <code>gsk_…</code>',
                apikeyLabel: 'Groq API Key',
                modelsApi:   'hardcoded',
                chatApi:     'openai',
                models:      [
                    'llama-3.1-8b-instant',
                    'llama-3.3-70b-versatile',
                    'meta-llama/llama-4-scout-17b-16e-instruct',
                    'groq/compound',
                    'groq/compound-mini',
                    'qwen/qwen3-32b',
                    'openai/gpt-oss-120b',
                    'openai/gpt-oss-20b',
                    'openai/gpt-oss-safeguard-20b',
                    'whisper-large-v3',
                    'whisper-large-v3-turbo',
                ],
            },
        };

        function getProviderInfo(provider) {
            return LMS_PROVIDERS[provider] || LMS_PROVIDERS.lmstudio;
        }

        function isCloudProvider(provider) {
            return !!(getProviderInfo(provider).isCloud);
        }

        function toggleApiKeyVisibility() {
            const input = document.getElementById('lmsApiKeyInput');
            const iconClosed = document.getElementById('eye-icon-closed');
            const iconOpen   = document.getElementById('eye-icon-open');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                iconClosed?.classList.add('hidden');
                iconOpen?.classList.remove('hidden');
            } else {
                input.type = 'password';
                iconClosed?.classList.remove('hidden');
                iconOpen?.classList.add('hidden');
            }
        }

        // ── Import API keys from .txt file ──
        const KEY_MAP = {
            'OPENAI':     'openai',
            'GROQ':       'groq',
            'GOOGLE':     'google',
            'ANTHROPIC':  'anthropic',
            'DEEPSEEK':   'deepseek',
            'MISTRAL':    'mistral',
            'HUGGING_FACE': 'huggingface',
            'HUGGINGFACE':  'huggingface',
            'OPENROUTER': 'openrouter',
        };

        function importKeysFromFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const lines = text.split('\n');
                let imported = 0;
                lines.forEach(line => {
                    line = line.trim();
                    if (!line || line.startsWith('#')) return;
                    const sepIdx = line.indexOf(' - ');
                    if (sepIdx === -1) return;
                    const key   = line.substring(0, sepIdx).trim().toUpperCase();
                    const value = line.substring(sepIdx + 3).trim();
                    if (!value) return;
                    const provider = KEY_MAP[key];
                    if (!provider) return;
                    if (!providerCredentials[provider]) providerCredentials[provider] = {};
                    providerCredentials[provider].apiKey = value;
                    imported++;
                });
                saveLmsSettings();
                // Refresh UI for current provider
                const currentProvider = document.getElementById('lmsProviderInput')?.value || lmStudioSettings.provider;
                if (providerCredentials[currentProvider]?.apiKey) {
                    const apiKeyInput = document.getElementById('lmsApiKeyInput');
                    if (apiKeyInput) apiKeyInput.value = providerCredentials[currentProvider].apiKey;
                }
                showSystemNotification(`Imported keys: ${imported}`, 'saved', 3000);
                appLog('success', `Key import: ${imported} from ${lines.length} lines`);
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        // ── Export API keys to .txt file ──
        function exportKeysToFile() {
            const lines = [];
            const providerNames = {
                'openai': 'OPENAI', 'groq': 'GROQ', 'google': 'GOOGLE',
                'anthropic': 'ANTHROPIC', 'deepseek': 'DEEPSEEK', 'mistral': 'MISTRAL',
                'huggingface': 'HUGGING_FACE', 'openrouter': 'OPENROUTER',
            };
            Object.keys(providerCredentials).forEach(provider => {
                const cred = providerCredentials[provider];
                if (cred?.apiKey) {
                    const name = providerNames[provider] || provider.toUpperCase();
                    lines.push(`${name} - ${cred.apiKey}`);
                }
            });
            if (lines.length === 0) {
                showSystemNotification('No keys to export', 'warning', 2500);
                return;
            }
            const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'api-keys.txt';
            a.click();
            URL.revokeObjectURL(url);
            showSystemNotification(`Exported keys: ${lines.length}`, 'saved', 2500);
        }

        // ── Clear all API keys ──
        function clearAllApiKeys() {
            const count = Object.keys(providerCredentials).filter(p => providerCredentials[p]?.apiKey).length;
            if (count === 0) {
                showSystemNotification('No keys', 'warning', 2000);
                return;
            }
            if (!confirm(`Delete all saved API keys (${count} )? This action cannot be undone.`)) return;
            providerCredentials = {};
            lmStudioSettings.apiKey = '';
            saveLmsSettings();
            const apiKeyInput = document.getElementById('lmsApiKeyInput');
            if (apiKeyInput) apiKeyInput.value = '';
            showSystemNotification(`Deleted keys: ${count}`, 'saved', 2500);
            appLog('success', `All API keys deleted (${count})`);
        }

        function updateLmsLayoutForProvider(provider) {
            const info    = getProviderInfo(provider);
            const isCloud = info.isCloud;
            const isManual = info.manualModel;

            // Show/hide API key card
            const apiKeyCard = document.getElementById('lms-apikey-card');
            if (apiKeyCard) apiKeyCard.style.display = isCloud ? '' : 'none';

            // Show/hide URL card
            const urlCard = document.getElementById('lms-url-card');
            if (urlCard) urlCard.style.display = (isCloud && (!isManual || info.cloudCheck)) ? 'none' : '';

            // Show/hide cloud check card
            const cloudCard = document.getElementById('lms-cloud-check-card');
            if (cloudCard) cloudCard.style.display = (isCloud && (!isManual || info.cloudCheck)) ? '' : 'none';

            // Show/hide model select vs manual input
            const selectCard = document.getElementById('lms-model-select-card');
            const manualCard = document.getElementById('lms-model-manual-card');
            if (selectCard) selectCard.style.display = isManual ? 'none' : '';
            if (manualCard) manualCard.style.display = isManual ? '' : 'none';

            // Update manual model hints
            if (isManual) {
                const manualHint = document.getElementById('lms-model-manual-hint');
                if (manualHint) manualHint.innerHTML = info.hint || 'Specify the model ID manually.';
                // Restore saved manual model
                const manualInput = document.getElementById('lmsModelManualInput');
                if (manualInput && lmStudioSettings.model) manualInput.value = lmStudioSettings.model;
            }

            // Update API key labels/hints
            if (isCloud) {
                const lbl = document.getElementById('lms-apikey-label');
                const hint = document.getElementById('lms-apikey-hint');
                if (lbl) lbl.textContent = info.apikeyLabel || 'API Key';
                if (hint) hint.innerHTML = (info.apikeyHint || '') + ' · Key is stored only in your browser.';
            }

            // Update model hint
            const modelHint = document.getElementById('lms-model-hint');
            if (modelHint && !isManual) {
                if (info.modelsApi === 'hardcoded') {
                    modelHint.textContent = `Model list ${info.label} (current at the time of application update).`;
                } else {
                    modelHint.textContent = 'List loads when checking connection.';
                }
            }
        }

        function selectLmsProvider(provider) {
            const input = document.getElementById('lmsProviderInput');
            const prevProvider = input?.value || lmStudioSettings.provider;

            // Save current provider credentials before switching
            if (prevProvider && prevProvider !== provider) {
                const apiKeyInput = document.getElementById('lmsApiKeyInput');
                const modelSelect = document.getElementById('lmsModelSelect');
                const manualInput = document.getElementById('lmsModelManualInput');
                const urlInput    = document.getElementById('lmsUrlInput');
                const prevInfo    = getProviderInfo(prevProvider);
                providerCredentials[prevProvider] = {
                    apiKey: apiKeyInput?.value || '',
                    model:  (prevInfo.manualModel ? manualInput?.value : modelSelect?.value) || '',
                    url:    urlInput?.value || ''
                };
                saveLmsSettings();
            }

            if (input) input.value = provider;

            // Update card highlights
            Object.keys(LMS_PROVIDERS).forEach(p => {
                const card = document.getElementById(`lms-provider-card-${p}`);
                if (card) card.classList.toggle('selected', p === provider);
            });

            const info = getProviderInfo(provider);
            const saved = providerCredentials[provider] || {};

            // Update URL field
            const urlInput = document.getElementById('lmsUrlInput');
            if (urlInput) {
                if (!info.isCloud) {
                    urlInput.value = saved.url || info.defaultUrl;
                    urlInput.placeholder = info.defaultUrl;
                }
            }

            // Load saved API key
            const apiKeyInput = document.getElementById('lmsApiKeyInput');
            if (apiKeyInput) apiKeyInput.value = saved.apiKey || '';

            // Update hints
            const serverHint = document.getElementById('lms-server-hint');
            if (serverHint) serverHint.innerHTML = info.isCloud ? '' : (info.hint || '');

            const providerHint = document.getElementById('lms-provider-hint');
            if (providerHint) {
                const icons = { lmstudio:'🖥️', ollama:'🦙', custom:'⚙️', openai:'🤖', deepseek:'🔮', anthropic:'🧠', google:'🌟', groq:'⚡', mistral:'🌀', huggingface:'🤗', openrouter:'🔀' };
                providerHint.innerHTML = `${icons[provider]||'⚙️'} <strong>${info.label}</strong> selected${info.isCloud ? ` · <span style="color:var(--text-muted)">API key required</span>` : ''}`;
            }

            // Update cloud hint
            const cloudHint = document.getElementById('lms-cloud-hint');
            if (cloudHint && info.isCloud) cloudHint.innerHTML = info.hint || '';

            // Show/hide layout panels
            updateLmsLayoutForProvider(provider);

            // Reset connection status
            setLmsConnectionStatus('disconnected', 'Not verified');
            setLmsCloudStatus('disconnected', 'Not verified');

            // For hardcoded-model providers, pre-populate list immediately
            if (info.modelsApi === 'hardcoded' && info.models) {
                populateLmsModelSelect(info.models);
                if (saved.model) {
                    const modelSelect = document.getElementById('lmsModelSelect');
                    if (modelSelect) modelSelect.value = saved.model;
                }
            } else if (saved.model) {
                // Show saved model even before refresh
                const modelSelect = document.getElementById('lmsModelSelect');
                if (modelSelect) {
                    modelSelect.innerHTML = `<option value="${escapeHtml(saved.model)}" selected>${escapeHtml(saved.model)}</option><option value="">— Refresh list —</option>`;
                }
            } else {
                const modelSelect = document.getElementById('lmsModelSelect');
                if (modelSelect) modelSelect.innerHTML = '<option value="">— Check connection —</option>';
            }

            // Restore manual model input
            if (info.manualModel && saved.model) {
                const manualInput = document.getElementById('lmsModelManualInput');
                if (manualInput) manualInput.value = saved.model;
            }

            // Update global settings to match
            lmStudioSettings.provider = provider;
            lmStudioSettings.apiKey   = saved.apiKey || '';
            lmStudioSettings.model    = saved.model || '';
            lmStudioSettings.url      = saved.url || info.defaultUrl;
        }

        function loadLmsSettings() {
            try {
                const raw = localStorage.getItem('multillm_lmstudio');
                if (raw) lmStudioSettings = { ...lmStudioSettings, ...JSON.parse(raw) };
                if (!lmStudioSettings.provider) lmStudioSettings.provider = 'lmstudio';

                // Load per-provider credentials
                const credRaw = localStorage.getItem('multillm_provider_credentials');
                if (credRaw) providerCredentials = JSON.parse(credRaw);

                // Migrate old single-key format to per-provider on first load
                if (lmStudioSettings.apiKey && !providerCredentials[lmStudioSettings.provider]) {
                    providerCredentials[lmStudioSettings.provider] = {
                        apiKey: lmStudioSettings.apiKey,
                        model:  lmStudioSettings.model || '',
                        url:    lmStudioSettings.url || ''
                    };
                }
            } catch(e) { appLog('error', 'Error loading provider settings', e.message); }
        }

        function saveLmsSettings() {
            try {
                localStorage.setItem('multillm_lmstudio', JSON.stringify(lmStudioSettings));
                localStorage.setItem('multillm_provider_credentials', JSON.stringify(providerCredentials));
            } catch(e) { appLog('error', 'Error saving provider settings', e.message); }
        }

        function saveCurrentProviderCredentials() {
            const provider    = document.getElementById('lmsProviderInput')?.value || lmStudioSettings.provider;
            const info        = getProviderInfo(provider);
            const apiKeyInput = document.getElementById('lmsApiKeyInput');
            const modelSelect = document.getElementById('lmsModelSelect');
            const manualInput = document.getElementById('lmsModelManualInput');
            const urlInput    = document.getElementById('lmsUrlInput');

            providerCredentials[provider] = {
                apiKey: apiKeyInput?.value || '',
                model:  (info.manualModel ? manualInput?.value : modelSelect?.value) || '',
                url:    urlInput?.value || ''
            };

            // Also update global settings
            lmStudioSettings.provider = provider;
            lmStudioSettings.apiKey   = providerCredentials[provider].apiKey;
            lmStudioSettings.model    = providerCredentials[provider].model;
            lmStudioSettings.url      = providerCredentials[provider].url;

            saveLmsSettings();
        }

        function onLmsToggleChange() {
            const enabled = document.getElementById('lmsEnabledToggle').checked;
            const section = document.getElementById('lms-config-section');
            if (section) section.style.opacity = enabled ? '1' : '0.5';
        }

        function populateLmsSettingsUI() {
            const enabledToggle = document.getElementById('lmsEnabledToggle');
            const urlInput      = document.getElementById('lmsUrlInput');
            const apiKeyInput   = document.getElementById('lmsApiKeyInput');
            const modelSelect   = document.getElementById('lmsModelSelect');
            const section       = document.getElementById('lms-config-section');
            const providerInp   = document.getElementById('lmsProviderInput');

            if (enabledToggle) enabledToggle.checked = lmStudioSettings.enabled;
            if (section) section.style.opacity = lmStudioSettings.enabled ? '1' : '0.5';

            const provider = lmStudioSettings.provider || 'lmstudio';
            if (providerInp) providerInp.value = provider;

            // Highlight card
            Object.keys(LMS_PROVIDERS).forEach(p => {
                const card = document.getElementById(`lms-provider-card-${p}`);
                if (card) card.classList.toggle('selected', p === provider);
            });

            const info   = getProviderInfo(provider);
            const saved  = providerCredentials[provider] || {};

            // URL
            if (urlInput) {
                urlInput.value       = saved.url || lmStudioSettings.url || info.defaultUrl;
                urlInput.placeholder = info.defaultUrl;
            }

            // API Key (from per-provider credentials)
            if (apiKeyInput) apiKeyInput.value = saved.apiKey || '';

            // Hints
            const serverHint = document.getElementById('lms-server-hint');
            if (serverHint) serverHint.innerHTML = info.isCloud ? '' : (info.hint || '');

            const cloudHint = document.getElementById('lms-cloud-hint');
            if (cloudHint && info.isCloud) cloudHint.innerHTML = info.hint || '';

            const providerHint = document.getElementById('lms-provider-hint');
            if (providerHint) {
                const icons = { lmstudio:'🖥️', ollama:'🦙', custom:'⚙️', openai:'🤖', deepseek:'🔮', anthropic:'🧠', google:'🌟', groq:'⚡', mistral:'🌀', huggingface:'🤗', openrouter:'🔀' };
                providerHint.innerHTML = `${icons[provider]||'⚙️'} <strong>${info.label}</strong> selected${info.isCloud ? ` · <span style="color:var(--text-muted)">API key required</span>` : ''}`;
            }

            // Layout
            updateLmsLayoutForProvider(provider);

            // Usage radio
            const radio = document.querySelector(`input[name="lmsUseFor"][value="${lmStudioSettings.useFor || 'both'}"]`);
            if (radio) radio.checked = true;

            // Populate models (from per-provider credentials)
            const savedModel = saved.model || '';
            if (info.modelsApi === 'hardcoded' && info.models) {
                populateLmsModelSelect(info.models);
                if (savedModel && modelSelect) {
                    const opt = modelSelect.querySelector(`option[value="${savedModel}"]`);
                    if (opt) modelSelect.value = savedModel;
                }
            } else if (savedModel && modelSelect) {
                modelSelect.innerHTML = `<option value="${escapeHtml(savedModel)}" selected>${escapeHtml(savedModel)}</option><option value="">— Refresh list —</option>`;
            }

            // Restore manual model input
            if (info.manualModel && savedModel) {
                const manualInput = document.getElementById('lmsModelManualInput');
                if (manualInput) manualInput.value = savedModel;
            }
        }

        function setLmsConnectionStatus(status, text) {
            // Local status indicator (inside url card)
            const el     = document.getElementById('lms-connection-status');
            const textEl = document.getElementById('lms-status-text');
            if (el) el.className = `lms-status ${status}`;
            if (textEl) textEl.textContent = text;
        }

        function setLmsCloudStatus(status, text) {
            // Cloud status indicator
            const el     = document.getElementById('lms-connection-status-cloud');
            const textEl = document.getElementById('lms-status-text-cloud');
            if (el) el.className = `lms-status ${status}`;
            if (textEl) textEl.textContent = text;
        }

        function setAnyLmsStatus(status, text) {
            const provider = document.getElementById('lmsProviderInput')?.value || lmStudioSettings.provider;
            if (isCloudProvider(provider)) {
                setLmsCloudStatus(status, text);
            } else {
                setLmsConnectionStatus(status, text);
            }
        }

        // ── Fetch model list — handles all API types ──────────────────
        async function fetchLmsModelList(url, provider, apiKey) {
            const info = getProviderInfo(provider);

            // Hardcoded lists (Anthropic, Google)
            if (info.modelsApi === 'hardcoded') {
                if (!apiKey) throw new Error('Enter API Key');
                // Quick auth test via a minimal chat request
                await testCloudAuth(url, provider, apiKey);
                return info.models || [];
            }

            // Ollama native /api/tags
            if (info.modelsApi === 'ollama') {
                try {
                    const resp = await fetchWithTimeout(`${url}/api/tags`, { method: 'GET' }, 6000);
                    if (resp.ok) {
                        const data = await resp.json();
                        return (data.models || []).map(m => m.name || m.model).filter(Boolean);
                    }
                } catch(_) { /* fall through */ }
            }

            // OpenAI /v1/models
            const headers = { 'Content-Type': 'application/json' };
            if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

            const resp = await fetchWithTimeout(`${url}/v1/models`, { method: 'GET', headers }, 8000);
            if (!resp.ok) {
                const txt = await resp.text().catch(() => '');
                throw new Error(`HTTP ${resp.status}${txt ? ': ' + txt.slice(0,120) : ''}`);
            }
            const data = await resp.json();
            const allModels = (data.data || []).map(m => m.id).filter(Boolean);
            // For OpenAI: filter to useful chat models, keep order
            if (provider === 'openai') {
                const preferred = allModels.filter(m =>
                    m.startsWith('gpt-') || m.startsWith('o1') || m.startsWith('o3') || m.startsWith('chatgpt')
                );
                return preferred.length ? preferred : allModels;
            }
            return allModels;
        }

        // Quick auth test for providers with hardcoded model lists
        async function testCloudAuth(url, provider, apiKey) {
            const info = getProviderInfo(provider);
            if (info.chatApi === 'anthropic') {
                const resp = await fetchWithTimeout(`${url}/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':    'application/json',
                        'x-api-key':       apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model:      info.models[0],
                        max_tokens: 1,
                        messages:   [{ role: 'user', content: 'Hi' }],
                    })
                }, 10000);
                if (resp.status === 401) throw new Error('Invalid API Key');
                if (resp.status === 403) throw new Error('Access denied');
                // 400/529 etc. are acceptable — key is valid
                return;
            }
            // Google / others — OpenAI compat
            const resp = await fetchWithTimeout(`${url}/v1/models`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${apiKey}` },
            }, 8000);
            if (resp.status === 401) throw new Error('Invalid API Key');
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        }

        async function testLmsConnection() {
            const urlInput    = document.getElementById('lmsUrlInput');
            const providerInp = document.getElementById('lmsProviderInput');
            const apiKeyInp   = document.getElementById('lmsApiKeyInput');
            const provider    = providerInp?.value || lmStudioSettings.provider || 'lmstudio';
            const info        = getProviderInfo(provider);
            const url         = info.isCloud ? info.defaultUrl : (urlInput?.value || lmStudioSettings.url).trim().replace(/\/+$/, '');
            const apiKey      = apiKeyInp?.value?.trim() || lmStudioSettings.apiKey || '';
            const isManual    = info.manualModel;

            const btnId = info.isCloud ? 'lms-test-cloud-btn' : 'lms-test-btn';
            const btn   = document.getElementById(btnId);

            setAnyLmsStatus('checking', 'Checking…');
            if (btn) btn.disabled = true;
            appLog('info', `Connection check → ${info.label}${url ? ' (' + url + ')' : ''}`);

            // For manual model providers, check API key
            if (isManual) {
                if (!apiKey) {
                    setAnyLmsStatus('error', 'Enter API Key');
                    appLog('warn', `Check ${info.label}: API key not specified`);
                    showSystemNotification(`Enter API key for ${info.label}`, 'warning', 3000);
                    if (btn) btn.disabled = false;
                    return [];
                }
                // Read model from manual input
                const manualInput = document.getElementById('lmsModelManualInput');
                const manualModel = manualInput?.value?.trim() || lmStudioSettings.model || '';

                // If cloudCheck is enabled, do a real API test
                if (info.cloudCheck) {
                    try {
                        let testUrl, testOpts;
                        if (provider === 'openrouter') {
                            testUrl  = `${info.defaultUrl}/v1/auth/key`;
                            testOpts = { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } };
                        } else if (provider === 'huggingface') {
                            // HF Router: POST to model endpoint with minimal payload
                            const mdl = manualModel || 'meta-llama/Llama-3.3-70B-Instruct';
                            testUrl  = `${info.defaultUrl}/${mdl}/v1/chat/completions`;
                            testOpts = {
                                method:  'POST',
                                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                                body:    JSON.stringify({ model: mdl, messages: [{ role: 'user', content: 'hi' }], max_tokens: 1 })
                            };
                        } else {
                            testUrl  = `${info.defaultUrl}/v1/models`;
                            testOpts = { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } };
                        }
                        const resp = await fetchWithTimeout(testUrl, testOpts, 10000);
                        if (resp.status === 401 || resp.status === 403) {
                            throw new Error('Invalid API Key');
                        }
                        // Any other response means key is valid
                    } catch(e) {
                        if (e.message === 'Invalid API Key') throw e;
                        // Network errors are ok — key might still be valid
                    }
                }

                if (manualModel) {
                    lmStudioSettings.model = manualModel;
                }
                saveCurrentProviderCredentials();
                setAnyLmsStatus('connected', `Key valid${manualModel ? ' · ' + manualModel : ''}`);
                appLog('success', `${info.label} — API key verified${manualModel ? ', model: ' + manualModel : ''}`);
                showSystemNotification(`${info.label} configured ✓`, 'saved', 2500);
                if (btn) btn.disabled = false;
                return manualModel ? [manualModel] : [];
            }

            try {
                const modelList = await fetchLmsModelList(url, provider, apiKey);
                const count = modelList.length;
                saveCurrentProviderCredentials();
                setAnyLmsStatus('connected', `Connected · ${count} models`);
                populateLmsModelSelect(modelList);
                appLog('success', `${info.label} — OK. Models: ${count}`, modelList.slice(0,10).join(', '));
                showSystemNotification(`${info.label} connected ✓`, 'saved', 2500);
                return modelList;
            } catch(e) {
                setAnyLmsStatus('error', 'Error');
                appLog('error', `Failed to connect to ${info.label}`, e.message);
                showSystemNotification(`${info.label}: ${e.message.slice(0, 60)}`, 'error', 4000);
                return [];
            } finally {
                if (btn) btn.disabled = false;
            }
        }

        async function refreshLmsModels() {
            const btn = document.getElementById('lms-refresh-btn');
            if (btn) { btn.disabled = true; btn.textContent = '…'; }
            await testLmsConnection();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Refresh`;
            }
        }

        function populateLmsModelSelect(modelsList) {
            const select  = document.getElementById('lmsModelSelect');
            if (!select) return;
            if (!modelsList || modelsList.length === 0) {
                select.innerHTML = '<option value="">— No models available —</option>';
                return;
            }
            const current = lmStudioSettings.model;
            select.innerHTML = modelsList.map(m =>
                `<option value="${escapeHtml(m)}"${m === current ? ' selected' : ''}>${escapeHtml(m)}</option>`
            ).join('');
            if (!current && modelsList.length > 0) select.value = modelsList[0];
        }

        function fetchWithTimeout(url, options, timeoutMs) {
            return new Promise((resolve, reject) => {
                const controller = new AbortController();
                const timer = setTimeout(() => { controller.abort(); reject(new Error(`Timeout (${timeoutMs}ms)`)); }, timeoutMs);
                fetch(url, { ...options, signal: controller.signal })
                    .then(r  => { clearTimeout(timer); resolve(r); })
                    .catch(e => { clearTimeout(timer); reject(e); });
            });
        }

        // ── Build request and parse response for each chat API format ──
        async function doCloudChatRequest(url, provider, apiKey, model, systemPrompt, userPrompt) {
            const info = getProviderInfo(provider);

            if (info.chatApi === 'anthropic') {
                // Anthropic Messages API
                const resp = await fetchWithTimeout(`${url}/v1/messages`, {
                    method:  'POST',
                    headers: {
                        'Content-Type':      'application/json',
                        'x-api-key':         apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model,
                        max_tokens: 4096,
                        system:   systemPrompt,
                        messages: [{ role: 'user', content: userPrompt }],
                    })
                }, 120000);
                if (!resp.ok) {
                    const txt = await resp.text().catch(() => '');
                    throw new Error(`HTTP ${resp.status}: ${txt.slice(0, 200)}`);
                }
                const data = await resp.json();
                return data?.content?.[0]?.text || '';
            }

            // OpenAI-compat (works for OpenAI, Google, local servers)
            const headers = { 'Content-Type': 'application/json' };
            if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

            const resp = await fetchWithTimeout(`${url}/v1/chat/completions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user',   content: userPrompt   },
                    ],
                    temperature: 0.7,
                    max_tokens:  4096,
                    stream:      false,
                })
            }, 120000);
            if (!resp.ok) {
                const txt = await resp.text().catch(() => '');
                throw new Error(`HTTP ${resp.status}: ${txt.slice(0, 200)}`);
            }
            const data = await resp.json();
            return data?.choices?.[0]?.message?.content || '';
        }

        // ── Main call function ─────────────────────────────────────────
        async function callLmsApi(systemPrompt, userPrompt, targetFieldId, statusElId, btnId, badgeId) {
            const provider = lmStudioSettings.provider || 'lmstudio';
            const info     = getProviderInfo(provider);
            const url      = info.isCloud ? info.defaultUrl : (lmStudioSettings.url || info.defaultUrl).trim().replace(/\/+$/, '');
            const apiKey   = lmStudioSettings.apiKey || '';
            // Get model from manual input for manualModel providers, or from select
            let model;
            if (info.manualModel) {
                const manualInput = document.getElementById('lmsModelManualInput');
                model = manualInput?.value?.trim() || lmStudioSettings.model || '';
            } else {
                model = lmStudioSettings.model;
            }

            const btn      = document.getElementById(btnId);
            const statusEl = document.getElementById(statusElId);

            if (!model) {
                showSystemNotification('Select a model in Settings → Providers', 'warning', 3200);
                appLog('warn', 'Sending canceled: no model selected');
                return;
            }
            if (info.isCloud && !apiKey) {
                showSystemNotification(`Enter API key for ${info.label}`, 'warning', 3200);
                appLog('warn', `Sending canceled: no API key for ${info.label}`);
                return;
            }

            if (btn) {
                btn.disabled = true; btn.classList.add('loading');
                btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Waiting for response…`;
            }
            if (statusEl) {
                statusEl.textContent = `⏳ ${info.label} · ${model}…`;
                statusEl.classList.remove('hidden');
                statusEl.style.color = 'var(--text-muted)';
            }
            appLog('info', `Request → ${info.label} · ${model}`);

            try {
                const result = await doCloudChatRequest(url, provider, apiKey, model, systemPrompt, userPrompt);
                if (!result) throw new Error('Empty response from model');

                const field = document.getElementById(targetFieldId);
                if (field) { field.value = result; field.dispatchEvent(new Event('input')); }
                autoSave();

                const badge = document.getElementById(badgeId);
                if (badge) badge.classList.remove('hidden');

                if (statusEl) { statusEl.textContent = `✓ ${info.label} · ${model}`; statusEl.style.color = '#16a34a'; }
                appLog('success', `Response received ← ${info.label} · ${model}, chars: ${result.length}`);
                showSystemNotification(`Response from ${model} received ✓`, 'saved', 2500);

            } catch(e) {
                appLog('error', `Error ${info.label} · ${model}`, e.message);
                if (statusEl) { statusEl.textContent = `✗ ${e.message.slice(0, 120)}`; statusEl.style.color = '#ef4444'; }
                showSystemNotification(`${info.label}: ${e.message.slice(0, 70)}`, 'error', 4500);
            } finally {
                if (btn) {
                    btn.disabled = false; btn.classList.remove('loading');
                    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Send to AI`;
                }
            }
        }

        async function sendEnhancerToLmStudio() {
            if (!document.getElementById('rawPrompt')?.value?.trim()) {
                showSystemNotification('Enter a request in step 1', 'warning', 2500);
                appLog('warn', 'Prompt enhancement send: empty request');
                return;
            }
            await callLmsApi(enhancerSystem, generateEnhancerUserPrompt(), 'improvedPrompt', 'lms-enhancer-status', 'lms-send-enhancer-btn', 'lms-enhancer-filled-badge');
        }

        async function sendAggregatorToLmStudio() {
            if (!models.some(m => getTrimmedAnswerValue(m.id))) {
                showSystemNotification('Add model responses in step 3', 'warning', 2500);
                appLog('warn', 'Synthesis send: no model responses');
                return;
            }
            await callLmsApi(aggregatorSystem, generateAggregatorPrompt(), 'finalAnswer', 'lms-aggregator-status', 'lms-send-aggregator-btn', 'lms-aggregator-filled-badge');
        }

        function updateLmsUiVisibility() {
            const enabled   = lmStudioSettings.enabled;
            const useFor    = lmStudioSettings.useFor || 'both';
            const provider  = lmStudioSettings.provider || 'lmstudio';
            const provLabel = getProviderInfo(provider).label;
            // Get model from manual input for manualModel providers, or from settings
            let modelName = lmStudioSettings.model || '—';
            if (getProviderInfo(provider).manualModel) {
                const manualInput = document.getElementById('lmsModelManualInput');
                modelName = manualInput?.value?.trim() || lmStudioSettings.model || '—';
            }

            const enhancerPanel   = document.getElementById('lms-enhancer-panel');
            const aggregatorPanel = document.getElementById('lms-aggregator-panel');

            if (enhancerPanel) {
                const show = enabled && (useFor === 'prompt' || useFor === 'both');
                enhancerPanel.classList.toggle('hidden', !show);
                const n = document.getElementById('lms-enhancer-model-name');
                const p = document.getElementById('lms-enhancer-provider-label');
                if (n) n.textContent = modelName;
                if (p) p.textContent = provLabel;
            }
            if (aggregatorPanel) {
                const show = enabled && (useFor === 'synthesis' || useFor === 'both');
                aggregatorPanel.classList.toggle('hidden', !show);
                const n = document.getElementById('lms-aggregator-model-name');
                const p = document.getElementById('lms-aggregator-provider-label');
                if (n) n.textContent = modelName;
                if (p) p.textContent = provLabel;
            }

            // Update HF panel visibility
            updateHfUiVisibility();
        }

        // ═══════════════════════════════════════════════════════════════
        