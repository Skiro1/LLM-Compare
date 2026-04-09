// HUGGING FACE INTEGRATION
        // ═══════════════════════════════════════════════════════════════
        let hfSettings = {
            enabled: false,
            apiKey: '',
            model: '',
            useFor: 'both'
        };

        function loadHfSettings() {
            try {
                const raw = localStorage.getItem('multillm_huggingface');
                if (raw) hfSettings = { ...hfSettings, ...JSON.parse(raw) };
            } catch(e) { appLog('error', 'Ошибка загрузки настроек HF', e.message); }
        }

        function saveHfSettings() {
            try {
                localStorage.setItem('multillm_huggingface', JSON.stringify(hfSettings));
            } catch(e) { appLog('error', 'Ошибка сохранения настроек HF', e.message); }
        }

        function onHfToggleChange() {
            const enabled = document.getElementById('hfEnabledToggle').checked;
            const section = document.getElementById('hf-config-section');
            if (section) section.style.opacity = enabled ? '1' : '0.5';
        }

        function toggleHfApiKeyVisibility() {
            const input = document.getElementById('hfApiKeyInput');
            const iconClosed = document.getElementById('hf-eye-icon-closed');
            const iconOpen = document.getElementById('hf-eye-icon-open');
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

        function setHfModel(model) {
            const input = document.getElementById('hfModelInput');
            if (input) input.value = model;
        }

        function setHfConnectionStatus(status, text) {
            const el = document.getElementById('hf-connection-status');
            const textEl = document.getElementById('hf-status-text');
            if (el) el.className = `lms-status ${status}`;
            if (textEl) textEl.textContent = text;
        }

        async function testHfConnection() {
            const apiKeyInput = document.getElementById('hfApiKeyInput');
            const modelInput = document.getElementById('hfModelInput');
            const apiKey = apiKeyInput?.value?.trim() || '';
            const model = modelInput?.value?.trim() || '';

            if (!apiKey) {
                setHfConnectionStatus('error', 'Введите API ключ');
                appLog('warn', 'Проверка HF: API ключ не указан');
                showSystemNotification('Введите API ключ Hugging Face', 'warning', 3000);
                return;
            }

            if (!model) {
                setHfConnectionStatus('error', 'Укажите модель');
                appLog('warn', 'Проверка HF: модель не указана');
                showSystemNotification('Укажите ID модели Hugging Face', 'warning', 3000);
                return;
            }

            setHfConnectionStatus('checking', 'Проверка…');
            const btn = document.getElementById('hf-test-btn');
            if (btn) btn.disabled = true;

            appLog('info', `Проверка HF → ${model}`);

            try {
                // Test with a minimal request
                const resp = await fetchWithTimeout(
                    `https://router.huggingface.co/hf-inference/models/${model}/v1/chat/completions`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [{ role: 'user', content: 'Hi' }],
                            max_tokens: 1
                        })
                    },
                    15000
                );

                if (resp.status === 401) {
                    throw new Error('Неверный API ключ');
                }
                if (resp.status === 404) {
                    throw new Error('Модель не найдена');
                }

                setHfConnectionStatus('connected', 'Подключено ✓');
                appLog('success', `HF подключён → ${model}`);
                showSystemNotification(`Hugging Face подключён ✓`, 'saved', 2500);
            } catch(e) {
                setHfConnectionStatus('error', 'Ошибка');
                appLog('error', `Ошибка HF: ${model}`, e.message);
                showSystemNotification(`HF: ${e.message.slice(0, 60)}`, 'error', 4000);
            } finally {
                if (btn) btn.disabled = false;
            }
        }

        function populateHfSettingsUI() {
            const enabledToggle = document.getElementById('hfEnabledToggle');
            const apiKeyInput = document.getElementById('hfApiKeyInput');
            const modelInput = document.getElementById('hfModelInput');
            const section = document.getElementById('hf-config-section');

            if (enabledToggle) enabledToggle.checked = hfSettings.enabled;
            if (section) section.style.opacity = hfSettings.enabled ? '1' : '0.5';
            if (apiKeyInput) apiKeyInput.value = hfSettings.apiKey || '';
            if (modelInput) modelInput.value = hfSettings.model || '';

            // Set radio
            const radio = document.querySelector(`input[name="hfUseFor"][value="${hfSettings.useFor || 'both'}"]`);
            if (radio) radio.checked = true;
        }

        function updateHfUiVisibility() {
            const enabled = hfSettings.enabled;
            const useFor = hfSettings.useFor || 'both';
            const model = hfSettings.model || '—';

            // Show/hide HF enhancer panel
            const hfEnhancerPanel = document.getElementById('hf-enhancer-panel');
            if (hfEnhancerPanel) {
                const show = enabled && (useFor === 'prompt' || useFor === 'both');
                hfEnhancerPanel.classList.toggle('hidden', !show);
                const modelNameEl = document.getElementById('hf-enhancer-model-name');
                if (modelNameEl) modelNameEl.textContent = model;
            }

            // Show/hide HF aggregator panel
            const hfAggregatorPanel = document.getElementById('hf-aggregator-panel');
            if (hfAggregatorPanel) {
                const show = enabled && (useFor === 'synthesis' || useFor === 'both');
                hfAggregatorPanel.classList.toggle('hidden', !show);
                const modelNameEl = document.getElementById('hf-aggregator-model-name');
                if (modelNameEl) modelNameEl.textContent = model;
            }
        }

        async function callHfApi(systemPrompt, userPrompt, targetFieldId, statusElId, btnId, badgeId) {
            const apiKey = hfSettings.apiKey || '';
            const model = hfSettings.model || '';

            const btn = document.getElementById(btnId);
            const statusEl = document.getElementById(statusElId);

            if (!model) {
                showSystemNotification('Укажите модель HF в настройках → HF', 'warning', 3200);
                appLog('warn', 'Отправка HF: модель не указана');
                return;
            }
            if (!apiKey) {
                showSystemNotification('Введите API ключ HF', 'warning', 3200);
                appLog('warn', 'Отправка HF: нет API ключа');
                return;
            }

            if (btn) {
                btn.disabled = true; btn.classList.add('loading');
                btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Жду ответа…`;
            }
            if (statusEl) {
                statusEl.textContent = `⏳ HF · ${model}…`;
                statusEl.classList.remove('hidden');
                statusEl.style.color = 'var(--text-muted)';
            }
            appLog('info', `Запрос → HF · ${model}`);

            try {
                const result = await doCloudChatRequest(
                    `https://router.huggingface.co/hf-inference/models/${model}`,
                    'huggingface',
                    apiKey,
                    model,
                    systemPrompt,
                    userPrompt
                );

                if (!result) throw new Error('Пустой ответ от HF');

                const field = document.getElementById(targetFieldId);
                if (field) { field.value = result; field.dispatchEvent(new Event('input')); }
                autoSave();

                const badge = document.getElementById(badgeId);
                if (badge) badge.classList.remove('hidden');

                if (statusEl) { statusEl.textContent = `✓ HF · ${model}`; statusEl.style.color = '#16a34a'; }
                appLog('success', `Ответ получен ← HF · ${model}, симв.: ${result.length}`);
                showSystemNotification(`Ответ от HF ${model} получен ✓`, 'saved', 2500);

            } catch(e) {
                appLog('error', `Ошибка HF · ${model}`, e.message);
                if (statusEl) { statusEl.textContent = `✗ ${e.message.slice(0, 120)}`; statusEl.style.color = '#ef4444'; }
                showSystemNotification(`HF: ${e.message.slice(0, 70)}`, 'error', 4500);
            } finally {
                if (btn) {
                    btn.disabled = false; btn.classList.remove('loading');
                    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Отправить в ИИ`;
                }
            }
        }

        async function sendEnhancerToHf() {
            if (!document.getElementById('rawPrompt')?.value?.trim()) {
                showSystemNotification('Введите запрос на шаге 1', 'warning', 2500);
                appLog('warn', 'Отправка улучшения HF: пустой запрос');
                return;
            }
            await callHfApi(enhancerSystem, generateEnhancerUserPrompt(), 'improvedPrompt', 'lms-enhancer-status', 'lms-send-enhancer-btn', 'lms-enhancer-filled-badge');
        }

        async function sendAggregatorToHf() {
            if (!models.some(m => getTrimmedAnswerValue(m.id))) {
                showSystemNotification('Добавьте ответы моделей на шаге 3', 'warning', 2500);
                appLog('warn', 'Отправка синтеза HF: нет ответов моделей');
                return;
            }
            await callHfApi(aggregatorSystem, generateAggregatorPrompt(), 'finalAnswer', 'lms-aggregator-status', 'lms-send-aggregator-btn', 'lms-aggregator-filled-badge');
        }

        const STORAGE_KEYS = {
            autosave: 'multillm_autosave',
            threads: 'multillm_threads'
        };
        const STORAGE_DB_NAME = 'multillm-storage';
        const STORAGE_DB_VERSION = 1;
        const STORAGE_STORE_NAME = 'keyval';
        let storageDbPromise = null;

        function openStorageDb() {
            if (!window.indexedDB) return Promise.resolve(null);
            if (!storageDbPromise) {
                storageDbPromise = new Promise((resolve) => {
                    const request = indexedDB.open(STORAGE_DB_NAME, STORAGE_DB_VERSION);
                    request.onupgradeneeded = () => {
                        const db = request.result;
                        if (!db.objectStoreNames.contains(STORAGE_STORE_NAME)) {
                            db.createObjectStore(STORAGE_STORE_NAME);
                        }
                    };
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => {
                        console.warn('IndexedDB unavailable:', request.error);
                        resolve(null);
                    };
                });
            }
            return storageDbPromise;
        }

        function runIdbOperation(mode, executor) {
            return openStorageDb().then((db) => {
                if (!db) return null;
                return new Promise((resolve, reject) => {
                    try {
                        const tx = db.transaction(STORAGE_STORE_NAME, mode);
                        const store = tx.objectStore(STORAGE_STORE_NAME);
                        const request = executor(store);
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = () => reject(request.error);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        async function readStoredText(key) {
            try {
                const value = await runIdbOperation('readonly', (store) => store.get(key));
                if (typeof value === 'string') return value;
            } catch (error) {
                console.warn('Read from IndexedDB failed:', error);
            }

            let fallback = null;
            try {
                fallback = localStorage.getItem(key);
            } catch (error) {
                console.warn('Read from localStorage failed:', error);
            }
            if (fallback !== null) {
                void writeStoredText(key, fallback, { mirrorLocal: false });
            }
            return fallback;
        }

        async function writeStoredText(key, value, options = {}) {
            const { mirrorLocal = true } = options;
            let savedToIndexedDb = false;

            try {
                const result = await runIdbOperation('readwrite', (store) => store.put(value, key));
                savedToIndexedDb = result !== null;
            } catch (error) {
                console.warn('Write to IndexedDB failed:', error);
            }

            if (mirrorLocal || !savedToIndexedDb) {
                try {
                    localStorage.setItem(key, value);
                } catch (error) {
                    console.warn('Write to localStorage failed:', error);
                }
            }

            return savedToIndexedDb;
        }

        async function removeStoredText(key) {
            try {
                await runIdbOperation('readwrite', (store) => store.delete(key));
            } catch (error) {
                console.warn('Delete from IndexedDB failed:', error);
            }
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn('Delete from localStorage failed:', error);
            }
        }

        function loadPreferences() {
            try {
                const saved = JSON.parse(localStorage.getItem('multillm_preferences') || '{}');
                preferences = {
                    notificationsEnabled: saved.notificationsEnabled !== false,
                    useRatingsInSynthesis: saved.useRatingsInSynthesis !== false
                };
            } catch (error) {
                preferences = {
                    notificationsEnabled: true,
                    useRatingsInSynthesis: true
                };
            }
        }

        function savePreferences() {
            localStorage.setItem('multillm_preferences', JSON.stringify(preferences));
        }

        function hideNotificationIndicator() {
            clearTimeout(notificationTimer);
            const indicator = document.getElementById('autosaveIndicator');
            if (!indicator) return;
            indicator.classList.remove('saving', 'saved', 'warning', 'error', 'visible');
        }

        