function getTaskProfileById(profileId) {
            return TASK_PROFILES.find((profile) => profile.id === profileId) || TASK_PROFILES[0];
        }

        function buildTaskProfilePrompt(basePrompt, profileId, promptKind) {
            const profile = getTaskProfileById(profileId);
            if (!profile || profile.isCustom) return basePrompt;

            const note = promptKind === 'enhancer' ? profile.enhancerNote : profile.aggregatorNote;
            if (!note) return basePrompt;

            return `${basePrompt}\n\nПРОФИЛЬ ЗАДАЧИ: ${profile.name.toUpperCase()}\n${note}`;
        }

        function buildTaskProfilePrompts(profileId) {
            const effectiveProfileId = getTaskProfileById(profileId).isCustom ? 'balanced' : profileId;
            return {
                enhancer: buildTaskProfilePrompt(DEFAULT_ENHANCER_SYSTEM, effectiveProfileId, 'enhancer'),
                aggregator: buildTaskProfilePrompt(DEFAULT_AGGREGATOR_SYSTEM, effectiveProfileId, 'aggregator')
            };
        }

        function inferTaskProfileId(enhancerPrompt, aggregatorPrompt) {
            for (const profile of TASK_PROFILES) {
                if (profile.isCustom) continue;
                const prompts = buildTaskProfilePrompts(profile.id);
                if (prompts.enhancer === enhancerPrompt && prompts.aggregator === aggregatorPrompt) {
                    return profile.id;
                }
            }
            return 'custom';
        }

        function renderTaskProfileOptions() {
            const select = document.getElementById('taskProfileSelect');
            if (!select) return;

            select.innerHTML = TASK_PROFILES.map((profile) => (
                `<option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>`
            )).join('');
        }

        function updateTaskProfileUi(profileId = currentTaskProfile) {
            const profile = getTaskProfileById(profileId);
            const select = document.getElementById('taskProfileSelect');
            const nameEl = document.getElementById('taskProfileName');
            const descriptionEl = document.getElementById('taskProfileDescription');

            if (select) select.value = profile.id;
            if (nameEl) nameEl.textContent = profile.name;
            if (descriptionEl) descriptionEl.textContent = profile.description;
        }

        function handleTaskProfileChange(profileId) {
            currentTaskProfile = profileId || 'balanced';
            updateTaskProfileUi(currentTaskProfile);

            const profile = getTaskProfileById(currentTaskProfile);
            if (profile.isCustom) return;

            const prompts = buildTaskProfilePrompts(profile.id);
            const enhancerField = document.getElementById('settingsEnhancerPrompt');
            const aggregatorField = document.getElementById('settingsAggregatorPrompt');
            if (enhancerField) enhancerField.value = prompts.enhancer;
            if (aggregatorField) aggregatorField.value = prompts.aggregator;
        }

        function syncTaskProfileFromPromptEditors() {
            const enhancerField = document.getElementById('settingsEnhancerPrompt');
            const aggregatorField = document.getElementById('settingsAggregatorPrompt');
            if (!enhancerField || !aggregatorField) return;

            currentTaskProfile = inferTaskProfileId(enhancerField.value, aggregatorField.value);
            updateTaskProfileUi(currentTaskProfile);
        }

        // Settings functions
        let templates = [];

        function loadSettings() {
            const savedModels = localStorage.getItem('multillm_models');
            const savedEnhancer = localStorage.getItem('multillm_enhancer');
            const savedAggregator = localStorage.getItem('multillm_aggregator');
            const savedTemplates = localStorage.getItem('multillm_templates');
            let parsedTemplates = null;

            if (savedTemplates) {
                try {
                    parsedTemplates = JSON.parse(savedTemplates);
                } catch (error) {
                    parsedTemplates = null;
                }
            }

            models = savedModels ? JSON.parse(savedModels) : [...DEFAULT_MODELS];
            const defaultProfilePrompts = buildTaskProfilePrompts('balanced');
            enhancerSystem = savedEnhancer || defaultProfilePrompts.enhancer;
            aggregatorSystem = savedAggregator || defaultProfilePrompts.aggregator;
            currentTaskProfile = inferTaskProfileId(enhancerSystem, aggregatorSystem);
            const templateMap = new Map(DEFAULT_TEMPLATES.map((template) => [template.name, { ...template }]));
            if (Array.isArray(parsedTemplates)) {
                parsedTemplates.forEach((template) => {
                    if (!template || typeof template.name !== 'string' || typeof template.content !== 'string') return;
                    const name = template.name.trim();
                    const content = template.content.trim();
                    if (!name || !content) return;
                    templateMap.set(name, { name, content });
                });
            }
            templates = Array.from(templateMap.values());
            pruneModelScopedState();
            modelCardsDirty = true;
            comparisonDirty = true;

            updateModelsCount();
            updatePromptDisplays();
            updateLmsUiVisibility();
        }

        function saveSettings() {
            // Save prompts from textarea
            enhancerSystem = document.getElementById('settingsEnhancerPrompt').value;
            aggregatorSystem = document.getElementById('settingsAggregatorPrompt').value;
            currentTaskProfile = inferTaskProfileId(enhancerSystem, aggregatorSystem);
            preferences.notificationsEnabled = document.getElementById('notificationsEnabledToggle').checked;
            preferences.useRatingsInSynthesis = document.getElementById('useRatingsInSynthesisToggle').checked;

            // Save provider settings
            const lmsEnabledEl  = document.getElementById('lmsEnabledToggle');
            const lmsUrlEl      = document.getElementById('lmsUrlInput');
            const lmsModelEl    = document.getElementById('lmsModelSelect');
            const lmsManualEl   = document.getElementById('lmsModelManualInput');
            const lmsUseForEl   = document.querySelector('input[name="lmsUseFor"]:checked');
            const lmsProviderEl = document.getElementById('lmsProviderInput');
            const lmsApiKeyEl   = document.getElementById('lmsApiKeyInput');
            if (lmsEnabledEl)  lmStudioSettings.enabled  = lmsEnabledEl.checked;
            if (lmsProviderEl) lmStudioSettings.provider = lmsProviderEl.value || 'lmstudio';
            // Read model from either dropdown or manual input based on provider type
            const currentInfo = getProviderInfo(lmStudioSettings.provider);
            if (currentInfo.manualModel && lmsManualEl) {
                lmStudioSettings.model = lmsManualEl.value || '';
            } else if (lmsModelEl && lmsModelEl.value) {
                lmStudioSettings.model = lmsModelEl.value;
            }
            if (lmsUseForEl)   lmStudioSettings.useFor   = lmsUseForEl.value;
            if (lmsApiKeyEl !== null) lmStudioSettings.apiKey = lmsApiKeyEl?.value?.trim() || '';
            // Only save URL for non-cloud providers
            const provInfo = getProviderInfo(lmStudioSettings.provider);
            if (!provInfo.isCloud && lmsUrlEl) lmStudioSettings.url = lmsUrlEl.value.trim().replace(/\/+$/, '') || provInfo.defaultUrl;
            saveLmsSettings();

            localStorage.setItem('multillm_models', JSON.stringify(models));
            localStorage.setItem('multillm_enhancer', enhancerSystem);
            localStorage.setItem('multillm_aggregator', aggregatorSystem);
            localStorage.setItem('multillm_templates', JSON.stringify(templates));
            savePreferences();

            if (!preferences.notificationsEnabled) {
                hideNotificationIndicator();
            }

            pruneModelScopedState();
            modelCardsDirty = true;
            comparisonDirty = true;
            if (currentStep === 3) {
                ensureModelCardsRendered(true);
            }
            updatePromptDisplays();
            updateLmsUiVisibility();
            appLog('success', 'Настройки сохранены');
            closeSettings();
        }

        function openSettings() {
            document.getElementById('settingsModal').classList.remove('hidden');
            renderTaskProfileOptions();
            renderModelsList();
            renderTemplatesList();
            document.getElementById('settingsEnhancerPrompt').value = enhancerSystem;
            document.getElementById('settingsAggregatorPrompt').value = aggregatorSystem;
            document.getElementById('notificationsEnabledToggle').checked = preferences.notificationsEnabled;
            document.getElementById('useRatingsInSynthesisToggle').checked = preferences.useRatingsInSynthesis;
            currentTaskProfile = inferTaskProfileId(enhancerSystem, aggregatorSystem);
            updateTaskProfileUi(currentTaskProfile);
            // Populate LM Studio tab
            populateLmsSettingsUI();
            // Populate Logs tab
            const loggingToggle = document.getElementById('loggingEnabledToggle');
            if (loggingToggle) loggingToggle.checked = loggingEnabled;
            renderLogs();
            updateLogStats();
            updateLogBadge();
            setSettingsTab('general');
        }

        function closeSettings() {
            document.getElementById('settingsModal').classList.add('hidden');
        }

        function setSettingsTab(tab) {
            settingsTab = tab;
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.settings-tab[onclick="setSettingsTab('${tab}')"]`);
            if (activeTab) activeTab.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            const pane = document.getElementById(`settings-${tab}`);
            if (pane) pane.classList.add('active');
            // Refresh templates list when templates tab is selected
            if (tab === 'templates') renderTemplatesList();
            if (tab === 'lmstudio') populateLmsSettingsUI();
            if (tab === 'logs') { renderLogs(); updateLogStats(); }
        }

        function renderModelsList() {
            const container = document.getElementById('modelsList');
            const countEl = document.getElementById('modelsListCount');
            
            if (models.length === 0) {
                container.innerHTML = '<p class="text-zinc-500 text-sm text-center py-4">Нет моделей. Добавьте первую модель ниже.</p>';
                countEl.textContent = 'Моделей: 0';
                return;
            }

            countEl.innerHTML = `Моделей: ${models.length} (выбрано: <span id="selectedCount">0</span>)`;

            container.innerHTML = `<div id="selectAllRow" class="model-row mb-2 border-b border-zinc-200">
                <input type="checkbox" class="model-checkbox mr-3" onchange="toggleAllModels(this)">
                <span class="text-base text-zinc-500">Выбрать все</span>
            </div>` + models.map((m, i) => `
                <div class="model-row">
                    <input type="checkbox" class="model-checkbox mr-3" data-index="${i}" onchange="updateSelectedCount()">
                    <div class="model-info">
                        <div class="font-medium text-sm">${escapeHtml(m.name)}</div>
                        <div class="text-xs text-zinc-500">${escapeHtml(m.provider)}</div>
                        ${getSafeHttpUrl(m.chatUrl) ? `<div class="text-xs text-blue-500 mt-0.5 truncate"><a href="${escapeHtml(getSafeHttpUrl(m.chatUrl))}" target="_blank" rel="noopener noreferrer" class="hover:underline">🔗 ${escapeHtml(getSafeHttpUrl(m.chatUrl))}</a></div>` : ''}
                        ${m.systemPrompt ? '<div class="text-xs text-blue-600 mt-1">✓ Индивидуальный промт</div>' : ''}
                    </div>
                    <button onclick="editModel(${i})" class="btn btn-outline btn-sm" title="Редактировать">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onclick="deleteModel(${i})" class="btn btn-danger btn-sm" title="Удалить">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `).join('');
        }

        function updateSelectedCount() {
            const checkboxes = document.querySelectorAll('.model-checkbox');
            const allCheckbox = checkboxes[0];
            const modelCheckboxes = Array.from(checkboxes).slice(1);
            const checked = modelCheckboxes.filter(cb => cb.checked).length;
            const selectedEl = document.getElementById('selectedCount');
            const deleteBtn = document.getElementById('deleteSelectedBtn');
            const selectAllRow = document.getElementById('selectAllRow');
            
            allCheckbox.checked = checked === modelCheckboxes.length && checked > 0;
            
            if (selectAllRow) {
                if (checked === modelCheckboxes.length && checked > 0) {
                    selectAllRow.classList.add('selected');
                } else {
                    selectAllRow.classList.remove('selected');
                }
            }
            
            if (selectedEl) selectedEl.textContent = checked;
            if (deleteBtn) deleteBtn.disabled = checked === 0;
        }

        function toggleAllModels(checkbox) {
            const checkboxes = document.querySelectorAll('.model-checkbox');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
            updateSelectedCount();
        }

        function restoreDefaultModels() {
            if (confirm('Восстановить все модели по умолчанию? Текущие модели будут заменены.')) {
                models = [...DEFAULT_MODELS];
                localStorage.setItem('multillm_models', JSON.stringify(models));
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
                updatePromptDisplays();
            }
        }

        function deleteSelectedModels() {
            const checkboxes = document.querySelectorAll('.model-checkbox:checked');
            const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);
            
            if (indices.length === 0) return;
            
            if (confirm(`Удалить выбранные модели (${indices.length})?`)) {
                indices.forEach(i => models.splice(i, 1));
                localStorage.setItem('multillm_models', JSON.stringify(models));
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
            }
        }

        function deleteAllModels() {
            if (confirm('Удалить ВСЕ модели? Это действие нельзя отменить.')) {
                models = [];
                localStorage.setItem('multillm_models', JSON.stringify(models));
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
            }
        }

        function addModel() {
            const name = document.getElementById('newModelName').value.trim();
            const provider = document.getElementById('newModelProvider').value.trim();
            const systemPrompt = document.getElementById('newModelSystemPrompt').value.trim();
            const chatUrl = document.getElementById('newModelChatUrl').value.trim();

            if (!name) {
                alert('Введите название модели');
                return;
            }
            if (!provider) {
                alert('Введите провайдера');
                return;
            }

            const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
            models.push({ id, name, provider, systemPrompt, chatUrl });

            document.getElementById('newModelName').value = '';
            document.getElementById('newModelProvider').value = '';
            document.getElementById('newModelSystemPrompt').value = '';
            document.getElementById('newModelChatUrl').value = '';

            renderModelsList();
            updateModelsCount();
            invalidateModelViews();
        }

        function editModel(index) {
            const model = models[index];
            const newName = prompt('Название:', model.name);
            if (newName === null) return;
            const newProvider = prompt('Провайдер:', model.provider);
            if (newProvider === null) return;
            const newSystemPrompt = prompt('Системный промт (пусто = общий):', model.systemPrompt || '');
            if (newSystemPrompt === null) return;
            const newChatUrl = prompt('Ссылка на чат:', model.chatUrl || '');
            
            models[index].name = newName.trim() || model.name;
            models[index].provider = newProvider.trim() || model.provider;
            models[index].systemPrompt = newSystemPrompt !== null ? newSystemPrompt.trim() : model.systemPrompt;
            models[index].chatUrl = newChatUrl !== null ? newChatUrl.trim() : model.chatUrl;

            renderModelsList();
            invalidateModelViews();
        }

        function deleteModel(index) {
            if (confirm(`Удалить модель "${models[index].name}"?`)) {
                models.splice(index, 1);
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
            }
        }

        function resetEnhancerPrompt() {
            document.getElementById('settingsEnhancerPrompt').value = buildTaskProfilePrompts(currentTaskProfile).enhancer;
            syncTaskProfileFromPromptEditors();
        }

        function resetAggregatorPrompt() {
            document.getElementById('settingsAggregatorPrompt').value = buildTaskProfilePrompts(currentTaskProfile).aggregator;
            syncTaskProfileFromPromptEditors();
        }

        // ─── TEMPLATE MANAGEMENT ─────────────────────────────────────────────

        function renderTemplatesList() {
            const container = document.getElementById('templatesList');
            if (templates.length === 0) {
                container.innerHTML = '<p class="text-xs text-zinc-500 text-center py-4">Нет сохранённых шаблонов</p>';
                return;
            }
            container.innerHTML = templates.map((t, i) => `
                <div class="flex items-center justify-between p-3 mb-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium">${escapeHtml(t.name)}</div>
                        <div class="text-xs text-zinc-500 truncate mt-1">${escapeHtml(t.content.slice(0, 80))}${t.content.length > 80 ? '...' : ''}</div>
                    </div>
                    <div class="flex gap-2 ml-3">
                        <button onclick="applyTemplate(${i})" class="btn btn-outline btn-sm" title="Использовать">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                        <button onclick="deleteTemplate(${i})" class="btn btn-outline btn-sm text-red-500" title="Удалить">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function addTemplate() {
            const name = prompt('Название шаблона:');
            if (!name || !name.trim()) return;
            const content = prompt('Содержимое шаблона:');
            if (!content || !content.trim()) return;
            
            templates.push({ name: name.trim(), content: content.trim() });
            localStorage.setItem('multillm_templates', JSON.stringify(templates));
            renderTemplatesList();
        }

        function deleteTemplate(index) {
            if (confirm(`Удалить шаблон "${templates[index].name}"?`)) {
                templates.splice(index, 1);
                localStorage.setItem('multillm_templates', JSON.stringify(templates));
                renderTemplatesList();
            }
        }

        function applyTemplate(index) {
            const template = templates[index];
            document.getElementById('rawPrompt').value = template.content;
            closeSettings();
            setStep(1);
        }

        function updateModelsCount() {
            document.getElementById('modelsCount').textContent = `Моделей: ${models.length}`;
        }

        function invalidateModelViews() {
            pruneModelScopedState();
            modelCardsDirty = true;
            comparisonDirty = true;
            if (currentStep === 3) {
                ensureModelCardsRendered(true);
            }
        }

        function renderModelCards() {
            const container = document.getElementById('modelCardsContainer');
            if (!container) return;
            pruneModelScopedState();

            container.innerHTML = models.map(m => {
                const contUrl = getSafeHttpUrl(continuationUrls[m.id]);
                const effectiveUrl = contUrl || getSafeHttpUrl(m.chatUrl);
                const hasUrl = !!effectiveUrl;
                const hasSystemPrompt = m.systemPrompt && m.systemPrompt.trim();
                const isCont = !!contUrl;
                const answerValue = answerDrafts[m.id] ?? '';

                return `
                <div class="answer-section">
                    <div class="answer-section-header" onclick="toggleAnswerSection('model-${m.id}')">
                        <div class="answer-section-header-left">
                            <span class="badge badge-dark">${escapeHtml(m.name)}</span>
                            <span class="badge badge-light">${escapeHtml(m.provider)}</span>
                            ${hasSystemPrompt ? '<span class="badge" style="background:#e0f2fe;color:#0369a1;font-size:0.75rem;">⚙ Свой промт</span>' : ''}
                            ${isCont ? '<span class="continuation-badge">🔗 Продолжение чата</span>' : ''}
                        </div>
                        <svg id="section-toggle-model-${m.id}" class="answer-section-toggle" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    <div id="section-content-model-${m.id}" class="answer-section-content">
                        <div class="flex flex-wrap gap-2 mb-3">
                            <button id="copy-open-${m.id}" class="btn btn-primary btn-sm" onclick="copyAndOpen('${m.id}', event)" title="Скопировать промт${hasSystemPrompt ? ' с системным промтом' : ''} ${hasUrl ? 'и открыть ' + escapeHtml(m.name) : ''}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                ${hasUrl ? `Скопировать и открыть ${escapeHtml(m.name)}` : 'Скопировать промт'}
                                ${hasUrl ? '<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}
                            </button>
                        </div>
                        <div class="mb-3">
                            <label class="text-xs text-zinc-500 mb-1 block">Ссылка на чат:</label>
                            <input type="url" class="model-chat-url-input" id="chat-url-${m.id}"
                                placeholder="${escapeHtml(getSafeHttpUrl(m.chatUrl) || 'https://...')}"
                                value="${escapeHtml(contUrl || '')}"
                                oninput="handleChatUrlInput('${m.id}', this.value)" />
                        </div>
                        <div class="mb-3">
                            ${renderStarRating(m.id)}
                        </div>
                        <p class="text-zinc-500 text-sm mb-2">Вставьте ответ от ${escapeHtml(m.name)}:</p>
                        <textarea id="answer-${m.id}" class="textarea" placeholder="Вставьте ответ от ${escapeHtml(m.name)}..." oninput="handleAnswerInput('${m.id}', this.value)">${escapeHtml(answerValue)}</textarea>
                    </div>
                </div>
            `}).join('');
            modelCardsDirty = false;
        }

        function copyModelSystemPrompt(modelId, event) {
            event.stopPropagation();
            const m = models.find(x => String(x.id) === String(modelId));
            if (!m || !m.systemPrompt) return;
            copyToClipboard(m.systemPrompt).then((success) => {
                if (!success) {
                    showSystemNotification('Не удалось скопировать системный промт', 'warning', 2600);
                    return;
                }
                const btn = document.getElementById('copy-sys-' + modelId);
                if (btn) {
                    btn.classList.add('copied');
                    setCopyButtonIconState(btn, true);
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        setCopyButtonIconState(btn, false);
                    }, 2000);
                }
            });
        }

        function copyAndOpen(modelId, event) {
            event.stopPropagation();
            const m = models.find(x => String(x.id) === String(modelId));
            if (!m) return;

            const improved = document.getElementById('improvedPrompt').value.trim();
            let textToCopy = improved || '(промт ещё не задан)';
            
            // If model has a system prompt, prepend it
            if (m.systemPrompt && m.systemPrompt.trim()) {
                textToCopy = m.systemPrompt.trim() + '\n\n---\n\n' + textToCopy;
            }
            
            // Use continuation URL if set, otherwise default chatUrl
            const urlToOpen = getSafeHttpUrl(continuationUrls[m.id]) || getSafeHttpUrl(m.chatUrl);

            const copyPromise = copyToClipboard(textToCopy);

            if (urlToOpen) {
                const popup = window.open(urlToOpen, '_blank', 'noopener,noreferrer');
                if (popup) {
                    popup.opener = null;
                } else {
                    showSystemNotification('Браузер заблокировал новую вкладку', 'warning', 2600);
                }
            }

            copyPromise.then((success) => {
                const btn = document.getElementById('copy-open-' + modelId);
                const hasUrl = !!urlToOpen;
                if (btn) {
                    if (!success) {
                        showSystemNotification('Не удалось скопировать промт', 'warning', 2600);
                        return;
                    }
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-copy', 'copied');
                    btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Скопировано!';
                    setTimeout(() => {
                        btn.classList.remove('btn-copy', 'copied');
                        btn.classList.add('btn-primary');
                        const label = hasUrl ? `Скопировать и открыть ${escapeHtml(m.name)}` : 'Скопировать промт';
                        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> ${label}${hasUrl ? '<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}`;
                    }, 2000);
                }
            });
        }

        function updatePromptDisplays() {
            document.getElementById('enhancerSystemDisplay').textContent = enhancerSystem;
            document.getElementById('aggregatorSystemDisplay').textContent = aggregatorSystem;
        }

        // Step functions
        function setStep(step) {
            // Validate
            if (step === 2 && !document.getElementById('rawPrompt').value.trim()) {
                alert('Введите запрос');
                return;
            }
            if (step === 3 && !document.getElementById('improvedPrompt').value.trim()) {
                alert('Вставьте улучшенный промт');
                return;
            }
            if (step === 4) {
                const hasAnswers = models.some((m) => getTrimmedAnswerValue(m.id));
                if (!hasAnswers) {
                    alert('Добавьте хотя бы один ответ от модели');
                    return;
                }
            }
            if (step === 5 && !document.getElementById('finalAnswer').value.trim()) {
                alert('Вставьте синтезированный ответ');
                return;
            }

            currentStep = step;

            if (step === 3) {
                ensureModelCardsRendered();
            }

            // Refresh in-page chat history when on step 1
            if (step === 1) renderInPageChatHistory();

            // Update step buttons
            document.querySelectorAll('.step-btn').forEach((btn, i) => {
                btn.classList.remove('active', 'completed');
                if (i + 1 === step) {
                    btn.classList.add('active');
                } else if (i + 1 < step) {
                    btn.classList.add('completed');
                }
            });

            // Update step content
            document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
            document.getElementById('step-' + step).classList.add('active');

            // Update dynamic content
            if (step === 2) {
                document.getElementById('enhancerUserPrompt').innerHTML = '<div class="code-block scrollable">Вот исходный запрос пользователя:\n«' + escapeHtml(document.getElementById('rawPrompt').value) + '»</div>';
            }
            if (step === 3) {
                renderMarkdownInto(document.getElementById('improvedPromptDisplay'), document.getElementById('improvedPrompt').value);
            }
            if (step === 4) {
                document.getElementById('aggregatorPromptDisplay').innerHTML = '<div class="md-content" style="max-height: 300px; overflow-y: auto;">' + escapeHtml(generateAggregatorPrompt()) + '</div>';
            }
            if (step === 5) {
                updateResults();
            }

            // Update LM Studio panel visibility
            updateLmsUiVisibility();
        }

        function setResultTab(tab, evt) {
            currentResultTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-zinc-900', 'text-zinc-900');
                btn.classList.add('border-transparent', 'text-zinc-500');
            });
            if (evt && evt.target) {
                evt.target.classList.remove('border-transparent', 'text-zinc-500');
                evt.target.classList.add('border-zinc-900', 'text-zinc-900');
            }

            // Update tab content
            document.querySelectorAll('.result-tab').forEach(el => el.classList.add('hidden'));
            document.getElementById('result-' + tab).classList.remove('hidden');

            if (tab === 'comparison') {
                refreshComparisonView();
            }
        }

        function generateEnhancerUserPrompt() {
            return 'Вот исходный запрос пользователя:\n«' + document.getElementById('rawPrompt').value + '»';
        }

        function generateAggregatorPromptLegacy() {
            const improvedPrompt = document.getElementById('improvedPrompt').value;
            const useRatings = preferences.useRatingsInSynthesis;

            let answersText = '';
            let index = 1;
            models.forEach(m => {
                const answer = getTrimmedAnswerValue(m.id);
                if (answer) {
                    let ratingText = '';
                    if (useRatings) {
                        const rating = modelRatings[m.id];
                        ratingText = rating
                            ? `Пользовательская оценка: ${rating}/5. Это мягкий сигнал предпочтения, а не гарантия фактической точности.\n`
                            : 'Пользовательская оценка: не указана. Это нейтральный случай; не считай отсутствие оценки минусом.\n';
                    }

                    answersText += `Ответ ${index} (${m.name}, ${m.provider}):\n${ratingText}«${answer}»\n\n`;
                    index++;
                }
            });

            const ratingsGuidance = useRatings
                ? `Интерпретация оценок пользователя:
- Если у ответа есть оценка, учитывай её как дополнительный сигнал полезности и предпочтения пользователя.
- Не подменяй пользовательской оценкой фактическую точность, логическую согласованность и полноту.
- Если оценка отсутствует, считай это отсутствием сигнала, а не негативной оценкой.

`
                : '';

            return `Исходный вопрос (улучшенный промт):
«${improvedPrompt}»

${ratingsGuidance}Ответы разных моделей:

${answersText}`;
        }

        // Blind synthesis: keep model/provider names out of the aggregator prompt.
        function generateAggregatorPrompt() {
            const improvedPrompt = document.getElementById('improvedPrompt').value;
            const useRatings = preferences.useRatingsInSynthesis;

            let answersText = '';
            let index = 1;
            models.forEach((m) => {
                const answer = getTrimmedAnswerValue(m.id);
                if (!answer) return;

                let ratingText = '';
                if (useRatings) {
                    const rating = modelRatings[m.id];
                    ratingText = rating
                        ? `Пользовательская оценка этого варианта: ${rating}/5. Это мягкий сигнал предпочтения, а не гарантия фактической точности.\n`
                        : 'Пользовательская оценка этого варианта: не указана. Это нейтральный случай; не считай отсутствие оценки минусом.\n';
                }

                answersText += `Вариант ${index}:\n${ratingText}«${answer}»\n\n`;
                index++;
            });

            const ratingsGuidance = useRatings
                ? `Интерпретация оценок пользователя:
- Если у варианта есть оценка, учитывай её как дополнительный сигнал полезности и предпочтения пользователя.
- Не подменяй пользовательской оценкой фактическую точность, логическую согласованность и полноту.
- Если оценка отсутствует, считай это отсутствием сигнала, а не негативной оценкой.

`
                : '';

            return `Исходный вопрос (улучшенный промт):
«${improvedPrompt}»

${ratingsGuidance}Ниже несколько обезличенных вариантов ответа. Названия моделей и провайдеров намеренно скрыты; оценивай только содержание, логику, полезность и ясность.

Обезличенные варианты:

${answersText}`;
        }

        function generateResultJSON() {
            const answers = models
                .map(m => {
                    return {
                        model_id: m.id,
                        model_name: m.name,
                        provider: m.provider,
                        user_rating: modelRatings[m.id] ?? null,
                        answer_text: getTrimmedAnswerValue(m.id)
                    };
                })
                .filter(a => a.answer_text);

            const result = {
                raw_prompt: document.getElementById('rawPrompt').value,
                improved_prompt: document.getElementById('improvedPrompt').value,
                answers: answers,
                final_answer: document.getElementById('finalAnswer').value
            };

            return JSON.stringify(result, null, 2);
        }

        function updateResults() {
            // Save to history
            void saveToHistory();

            // JSON tab
            document.getElementById('resultJSONDisplay').textContent = generateResultJSON();

            // Final answer tab - render markdown
            const finalAnswerContent = document.getElementById('finalAnswer').value;
            renderMarkdownInto(document.getElementById('finalAnswerDisplay'), finalAnswerContent);
            if (currentResultTab === 'comparison') {
                refreshComparisonView();
            }
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getSafeHttpUrl(value) {
            if (!value || !value.trim()) return null;
            try {
                const url = new URL(value.trim(), window.location.href);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    return url.href;
                }
            } catch (error) {}
            return null;
        }

        function sanitizeLinkUrl(value) {
            if (!value || !value.trim()) return null;
            if (value.trim().startsWith('#')) return value.trim();
            try {
                const url = new URL(value.trim(), window.location.href);
                if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
                    return url.href;
                }
            } catch (error) {}
            return null;
        }

        function sanitizeMarkdownHtml(html) {
            const template = document.createElement('template');
            template.innerHTML = html;
            const allowedTags = new Set([
                'a', 'blockquote', 'br', 'code', 'del', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'hr', 'li', 'ol', 'p', 'pre', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'
            ]);
            const removeWithContentTags = new Set([
                'button', 'form', 'iframe', 'input', 'link', 'meta', 'object', 'script', 'select', 'style', 'textarea'
            ]);
            const allowedAttributes = {
                a: new Set(['href', 'title']),
                code: new Set(['class'])
            };

            const visit = (node) => {
                if (node.nodeType === Node.TEXT_NODE) return;
                if (node.nodeType === Node.COMMENT_NODE) {
                    node.remove();
                    return;
                }
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    node.remove();
                    return;
                }

                const tag = node.tagName.toLowerCase();
                if (removeWithContentTags.has(tag)) {
                    node.remove();
                    return;
                }

                Array.from(node.childNodes).forEach(visit);

                if (!allowedTags.has(tag)) {
                    const parent = node.parentNode;
                    if (!parent) return;
                    while (node.firstChild) {
                        parent.insertBefore(node.firstChild, node);
                    }
                    node.remove();
                    return;
                }

                Array.from(node.attributes).forEach((attr) => {
                    const attrName = attr.name.toLowerCase();
                    if (attrName.startsWith('on') || attrName === 'style') {
                        node.removeAttribute(attr.name);
                        return;
                    }

                    const tagAllowed = allowedAttributes[tag];
                    if (!tagAllowed || !tagAllowed.has(attrName)) {
                        node.removeAttribute(attr.name);
                        return;
                    }

                    if (tag === 'a' && attrName === 'href') {
                        const safeHref = sanitizeLinkUrl(attr.value);
                        if (!safeHref) {
                            node.removeAttribute('href');
                            return;
                        }
                        node.setAttribute('href', safeHref);
                        node.setAttribute('target', '_blank');
                        node.setAttribute('rel', 'noopener noreferrer');
                    }

                    if (tag === 'code' && attrName === 'class') {
                        const safeClasses = attr.value
                            .split(/\s+/)
                            .filter((className) => /^language-[\w-]+$/.test(className));
                        if (safeClasses.length > 0) {
                            node.setAttribute('class', safeClasses.join(' '));
                        } else {
                            node.removeAttribute('class');
                        }
                    }
                });
            };

            Array.from(template.content.childNodes).forEach(visit);
            return template.innerHTML;
        }

        function parseMarkdown(text) {
            const source = text || '';
            if (!source.trim()) return '';

            const cached = markdownCache.get(source);
            if (cached) return cached;

            const rendered = sanitizeMarkdownHtml(marked.parse(source, { breaks: true, gfm: true }));
            if (markdownCache.size >= MAX_MARKDOWN_CACHE_ENTRIES) {
                markdownCache.clear();
            }
            markdownCache.set(source, rendered);
            return rendered;
        }

        function renderMarkdownInto(container, text) {
            if (!container) return;
            container.innerHTML = '<div class="md-content">' + parseMarkdown(text) + '</div>';
            renderCodeBlocks(container);
        }

        function toggleAnswerSection(id) {
            const header = document.getElementById('section-header-' + id);
            const content = document.getElementById('section-content-' + id);
            const toggle = document.getElementById('section-toggle-' + id);
            
            content.classList.toggle('collapsed');
            toggle.classList.toggle('collapsed');
        }

        function renderCodeBlocks(container) {
            container.querySelectorAll('pre').forEach(pre => {
                const code = pre.querySelector('code');
                if (!code) return;

                // Skip if already wrapped (e.g. called twice)
                if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) return;

                const language = code.className.replace(/language-/, '') || '';
                const codeText = code.textContent;

                // Create a wrapper div and insert it in place of <pre>
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(pre);

                if (language) {
                    const langSpan = document.createElement('span');
                    langSpan.className = 'code-lang';
                    langSpan.textContent = language;
                    wrapper.appendChild(langSpan);
                }

                const btn = document.createElement('button');
                btn.className = 'code-copy-btn';
                btn.dataset.iconSize = 'w-3 h-3';
                btn.title = 'Скопировать код';
                btn.setAttribute('aria-label', 'Скопировать код');
                setCopyButtonIconState(btn, false);
                btn.onclick = function() { copyCodeBlock(this, codeText); };
                wrapper.appendChild(btn);
            });
        }

        // ── Universal clipboard: Clipboard API + execCommand fallback (Яндекс Браузер / file://) ──
        function copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text)
                    .then(() => true)
                    .catch(() => Promise.resolve(execCommandCopy(text)));
            }
            return Promise.resolve(execCommandCopy(text));
        }

        function execCommandCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            let ok = false;
            try { ok = document.execCommand('copy'); } catch(e) {}
            document.body.removeChild(ta);
            return ok;
        }

        function getCopyIconMarkup(sizeClass = 'w-4 h-4') {
            return `<svg class="${sizeClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
        }

        function getCheckIconMarkup(sizeClass = 'w-4 h-4') {
            return `<svg class="${sizeClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
        }

        function setCopyButtonIconState(btn, copied = false) {
            if (!btn) return;
            const iconSize = btn.dataset.iconSize || (btn.classList.contains('code-copy-btn') ? 'w-3 h-3' : 'w-4 h-4');
            btn.innerHTML = copied ? getCheckIconMarkup(iconSize) : getCopyIconMarkup(iconSize);
        }

        function copyCodeBlock(btn, code) {
            copyToClipboard(code).then((success) => {
                if (!success) {
                    showSystemNotification('Не удалось скопировать код', 'warning', 2600);
                    return;
                }
                btn.classList.add('copied');
                setCopyButtonIconState(btn, true);
                setTimeout(() => {
                    btn.classList.remove('copied');
                    setCopyButtonIconState(btn, false);
                }, 2000);
            });
        }

        function copyModelAnswer(modelId, buttonId) {
            copyText(getAnswerValue(modelId), buttonId);
        }

        function copyText(text, buttonId) {
            // Handle special constants
            if (text === 'ENHANCER_SYSTEM') text = enhancerSystem;
            if (text === 'AGGREGATOR_SYSTEM') text = aggregatorSystem;

            copyToClipboard(text).then((success) => {
                if (!success) {
                    showSystemNotification('Не удалось скопировать текст', 'warning', 2600);
                    return;
                }
                const btn = document.getElementById(buttonId);
                if (!btn) return;
                btn.classList.add('copied');
                setCopyButtonIconState(btn, true);
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    setCopyButtonIconState(btn, false);
                }, 2000);
            });
        }

        function copyAsMarkdown(containerId, buttonId) {
            const container = document.getElementById(containerId);
            const mdContent = container.querySelector('.md-content');
            if (!mdContent) return;

            const text = document.getElementById('finalAnswer').value;
            
            copyToClipboard(text).then((success) => {
                if (!success) {
                    showSystemNotification('Не удалось скопировать Markdown', 'warning', 2600);
                    return;
                }
                const btn = document.getElementById(buttonId);
                if (!btn) return;
                btn.classList.add('copied');
                setCopyButtonIconState(btn, true);
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    setCopyButtonIconState(btn, false);
                }, 2000);
            });
        }

        function resetAll() {
            continuationUrls = {};
            isContinuation = false;
            currentThread = null;
            modelRatings = {};
            clearAutoSave();
            clearAnswerDrafts();
            modelCardsDirty = true;
            comparisonDirty = true;
            
            document.getElementById('rawPrompt').value = '';
            document.getElementById('improvedPrompt').value = '';
            document.getElementById('finalAnswer').value = '';
            models.forEach(m => {
                const el = document.getElementById(`answer-${m.id}`);
                if (el) el.value = '';
            });
            setStep(1);
        }

        // ─── THREADS / HISTORY ───────────────────────────────────────────────

        async function loadThreads() {
            try {
                const saved = await readStoredText(STORAGE_KEYS.threads);
                allThreads = JSON.parse(saved || '[]');
            }
            catch(e) { allThreads = []; }
        }

        async function saveThreads() {
            await writeStoredText(STORAGE_KEYS.threads, JSON.stringify(allThreads), { mirrorLocal: false });
        }

        async function saveToHistory() {
            const rawPrompt = document.getElementById('rawPrompt').value.trim();
            const finalAnswer = document.getElementById('finalAnswer').value.trim();
            if (!rawPrompt || !finalAnswer) return;

            const turn = {
                rawPrompt,
                improvedPrompt: document.getElementById('improvedPrompt').value.trim(),
                finalAnswer,
                timestamp: new Date().toISOString(),
                chatUrls: { ...continuationUrls }
            };

            if (!currentThread) {
                // Start a new thread
                currentThread = {
                    id: Date.now(),
                    title: rawPrompt.length > 80 ? rawPrompt.slice(0, 80) + '…' : rawPrompt,
                    createdAt: new Date().toISOString(),
                    turns: []
                };
                allThreads.unshift(currentThread);
                if (allThreads.length > 30) allThreads = allThreads.slice(0, 30);
            }

            // Avoid duplicate turn
            const last = currentThread.turns[currentThread.turns.length - 1];
            if (last && last.rawPrompt === turn.rawPrompt && last.finalAnswer === turn.finalAnswer) return;

            currentThread.turns.push(turn);
            // Sync reference in allThreads
            const idx = allThreads.findIndex(t => t.id === currentThread.id);
            if (idx !== -1) allThreads[idx] = currentThread;

            await saveThreads();
        }

        // Render the in-page chat history bubbles above step-1 input
        function renderInPageChatHistory() {
            const wrap = document.getElementById('chatHistoryWrap');
            const body = document.getElementById('chatHistoryBody');
            const titleEl = document.getElementById('chatHistoryTitle');
            const step1Title = document.getElementById('step1Title');
            const step1Hint = document.getElementById('step1Hint');

            if (!currentThread || currentThread.turns.length === 0) {
                wrap.classList.add('hidden');
                body.innerHTML = '';
                if (step1Title) step1Title.textContent = 'Шаг 1: Ваш сырой запрос';
                if (step1Hint) step1Hint.textContent = 'Введите ваш исходный вопрос или задачу';
                return;
            }

            wrap.classList.remove('hidden');
            if (titleEl) titleEl.textContent = `Чат · ${currentThread.turns.length} ${currentThread.turns.length === 1 ? 'вопрос' : 'вопроса'}`;
            if (step1Title) step1Title.textContent = 'Продолжить чат';
            if (step1Hint) step1Hint.textContent = 'Задайте следующий вопрос — он будет отправлен в те же чаты';

            body.innerHTML = currentThread.turns.map((turn, i) => {
                const aiId = 'ai-bubble-' + i;
                const aiHTML = parseMarkdown(turn.finalAnswer);
                return `
                <div class="chat-turn">
                    <span class="chat-turn-num">Вопрос ${i + 1}</span>
                    <div class="chat-bubble-user">${escapeHtml(turn.rawPrompt)}</div>
                    <div class="chat-bubble-ai">
                        <div id="${aiId}" class="md-content chat-bubble-ai-collapsed">${aiHTML}</div>
                        <button onclick="toggleAiBubble('${aiId}', this)" class="mt-1 text-xs text-zinc-500 hover:text-zinc-700 underline">Развернуть</button>
                    </div>
                </div>`;
            }).join('');

            // Render code blocks inside bubbles
            body.querySelectorAll('.chat-bubble-ai .md-content').forEach(el => renderCodeBlocks(el));

            // Scroll to bottom
            setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
        }

        function toggleAiBubble(id, btn) {
            const el = document.getElementById(id);
            if (!el) return;
            const collapsed = el.classList.toggle('chat-bubble-ai-collapsed');
            btn.textContent = collapsed ? 'Развернуть' : 'Свернуть';
        }

        // ─── HISTORY PANEL ───────────────────────────────────────────────────

        async function openHistory() {
            await loadThreads();
            renderHistoryList();
            document.getElementById('historyPanel').classList.add('open');
            document.getElementById('historyOverlay').classList.add('open');
        }

        function closeHistory() {
            document.getElementById('historyPanel').classList.remove('open');
            document.getElementById('historyOverlay').classList.remove('open');
        }

        function exportHistory() {
            const data = {
                threads: allThreads,
                models: models,
                exportDate: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `multillm-history-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function importHistory() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.threads && Array.isArray(data.threads)) {
                            if (confirm(`Импортировать ${data.threads.length} чатов? Существующая история будет дополнена.`)) {
                                // Merge threads
                                const existingIds = new Set(allThreads.map(t => t.id));
                                data.threads.forEach(thread => {
                                    if (!existingIds.has(thread.id)) {
                                        allThreads.push(thread);
                                    }
                                });
                                await saveThreads();
                                renderHistoryList();
                                alert(`Импортировано ${data.threads.length} чатов`);
                            }
                        }
                    } catch (err) {
                        alert('Ошибка при чтении файла: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        function filterHistory() {
            const query = document.getElementById('historySearch').value.toLowerCase().trim();
            const entries = document.querySelectorAll('.thread-entry');
            entries.forEach(entry => {
                const title = entry.querySelector('.thread-title').textContent.toLowerCase();
                const visible = !query || title.includes(query);
                entry.style.display = visible ? 'block' : 'none';
            });
        }

        function clearHistory() {
            if (!confirm('Очистить всю историю чатов?')) return;
            allThreads = [];
            currentThread = null;
            void saveThreads();
            renderHistoryList();
            renderInPageChatHistory();
        }

        function renderHistoryList() {
            const container = document.getElementById('historyList');
            if (allThreads.length === 0) {
                container.innerHTML = `<div class="history-empty">
                    <svg class="w-10 h-10 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>История пуста</p>
                    <p class="text-xs mt-1">Завершённые чаты появятся здесь</p>
                </div>`;
                return;
            }
            container.innerHTML = allThreads.map((thread, idx) => {
                const date = new Date(thread.createdAt);
                const dateStr = date.toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit'}) + ' ' +
                                date.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'});
                const isActive = currentThread && currentThread.id === thread.id;
                return `
                <div class="thread-entry" style="${isActive ? 'border-color:#3b82f6;' : ''}">
                    <div class="thread-entry-header" onclick="toggleThreadExpand(${idx})">
                        <div style="flex:1;min-width:0;">
                            <div class="thread-title">${escapeHtml(thread.title)}${isActive ? ' <span style="color:#3b82f6;font-size:0.7rem;font-weight:600;">● активный</span>' : ''}</div>
                            <div class="thread-meta">
                                <span>🕐 ${dateStr}</span>
                                <span>💬 ${thread.turns.length} ${thread.turns.length === 1 ? 'вопрос' : thread.turns.length < 5 ? 'вопроса' : 'вопросов'}</span>
                            </div>
                        </div>
                        <svg id="thread-arrow-${idx}" style="width:16px;height:16px;flex-shrink:0;transition:transform 0.2s;color:#a1a1aa;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    <div id="thread-turns-${idx}" class="thread-turns" style="display:none;">
                        ${thread.turns.map((turn, ti) => `
                        <div class="thread-turn-row">
                            <span style="width:20px;flex-shrink:0;color:#a1a1aa;font-size:0.7rem;">${ti+1}.</span>
                            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(turn.rawPrompt.length > 60 ? turn.rawPrompt.slice(0,60)+'…' : turn.rawPrompt)}</span>
                        </div>`).join('')}
                    </div>
                    <div class="thread-actions">
                        <button class="btn btn-primary btn-sm" onclick="openThread(${idx})">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Открыть и продолжить
                        </button>
                        <button class="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50" onclick="deleteThread(${idx})" title="Удалить чат">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>`;
            }).join('');
        }

        function toggleThreadExpand(idx) {
            const el = document.getElementById('thread-turns-' + idx);
            const arrow = document.getElementById('thread-arrow-' + idx);
            if (!el) return;
            const open = el.style.display === 'none';
            el.style.display = open ? 'block' : 'none';
            if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
        }

        function openThread(idx) {
            const thread = allThreads[idx];
            if (!thread) return;
            currentThread = thread;
            isContinuation = thread.turns.length > 0;
            modelRatings = {};
            clearAnswerDrafts();
            modelCardsDirty = true;
            comparisonDirty = true;
            models.forEach(m => {
                const answerEl = document.getElementById(`answer-${m.id}`);
                if (answerEl) answerEl.value = '';
            });
            // Load last turn's chatUrls as continuation URLs
            const lastTurn = thread.turns[thread.turns.length - 1];
            continuationUrls = lastTurn ? { ...(lastTurn.chatUrls || {}) } : {};
            // Load last turn data into fields
            if (lastTurn) {
                document.getElementById('rawPrompt').value = '';
                document.getElementById('improvedPrompt').value = lastTurn.improvedPrompt || '';
                document.getElementById('finalAnswer').value = lastTurn.finalAnswer || '';
            }
            closeHistory();
            // Ask for chat URLs (pre-filled with last turn's URLs)
            openContinueModalWithPrefill(continuationUrls);
        }

        function deleteThread(idx) {
            const thread = allThreads[idx];
            if (!confirm(`Удалить чат «${thread.title.slice(0,40)}»?`)) return;
            if (currentThread && currentThread.id === thread.id) {
                currentThread = null;
                isContinuation = false;
                continuationUrls = {};
            }
            allThreads.splice(idx, 1);
            void saveThreads();
            renderHistoryList();
            renderInPageChatHistory();
        }

        // ─── CONTINUE CHAT ───────────────────────────────────────────────────

        function openContinueModal() {
            openContinueModalWithPrefill(continuationUrls);
        }

        function openContinueModalWithPrefill(prefill) {
            const container = document.getElementById('continueUrlList');
            container.innerHTML = models.map(m => {
                const existing = prefill[m.id] || '';
                return `
                <div class="continue-url-row">
                    <div class="continue-url-label">
                        <span class="badge badge-dark" style="font-size:0.75rem;">${escapeHtml(m.name)}</span>
                    </div>
                    <input type="url" class="continue-url-input" id="cont-url-${m.id}"
                        placeholder="${escapeHtml(getSafeHttpUrl(m.chatUrl) || 'https://...')}"
                        value="${escapeHtml(existing)}" />
                </div>`;
            }).join('');
            document.getElementById('continueModal').classList.remove('hidden');
        }

        function closeContinueModal() {
            document.getElementById('continueModal').classList.add('hidden');
            // Не сбрасываем currentThread, чтобы не потерять контекст чата
        }

        function submitContinue() {
            const newUrls = {};
            let invalidUrls = 0;
            models.forEach(m => {
                const input = document.getElementById('cont-url-' + m.id);
                if (!input || !input.value.trim()) return;
                const safeUrl = getSafeHttpUrl(input.value);
                if (safeUrl) {
                    newUrls[m.id] = safeUrl;
                } else {
                    invalidUrls++;
                }
            });
            continuationUrls = newUrls;
            isContinuation = true;
            closeContinueModal();
            if (invalidUrls > 0) {
                showSystemNotification('Часть ссылок пропущена: поддерживаются только http/https', 'warning', 3200);
            }
            // Clear input fields for new question, keep thread alive
            document.getElementById('rawPrompt').value = '';
            document.getElementById('improvedPrompt').value = '';
            document.getElementById('finalAnswer').value = '';
            modelRatings = {};
            clearAnswerDrafts();
            modelCardsDirty = true;
            comparisonDirty = true;
            models.forEach(m => {
                const el = document.getElementById(`answer-${m.id}`);
                if (el) el.value = '';
            });
            setStep(1);
        }

        // ── Chat fullscreen view ──
        function openChatFullscreen() {
            if (!currentThread || currentThread.turns.length === 0) return;
            const overlay = document.getElementById('chatFullscreenOverlay');
            const body    = document.getElementById('chatFullscreenBody');
            const titleEl = document.getElementById('chatFullscreenTitle');

            if (titleEl) titleEl.textContent = `Чат · ${currentThread.turns.length} ${currentThread.turns.length === 1 ? 'вопрос' : 'вопроса'}`;

            body.innerHTML = currentThread.turns.map((turn, i) => {
                const aiHTML = parseMarkdown(turn.finalAnswer);
                return `
                <div class="chat-turn">
                    <span class="chat-turn-num">Вопрос ${i + 1}</span>
                    <div class="chat-bubble-user">${escapeHtml(turn.rawPrompt)}</div>
                    <div class="chat-bubble-ai">
                        <div class="md-content">${aiHTML}</div>
                    </div>
                </div>`;
            }).join('');

            body.querySelectorAll('.md-content').forEach(el => renderCodeBlocks(el));
            overlay.classList.add('open');
        }

        function closeChatFullscreen() {
            document.getElementById('chatFullscreenOverlay').classList.remove('open');
        }
    