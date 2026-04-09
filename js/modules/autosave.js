function showSystemNotification(message, status = 'saved', duration = 2200) {
            const indicator = document.getElementById('autosaveIndicator');
            const text = document.getElementById('autosaveText');
            if (!indicator || !text) return;

            if (!preferences.notificationsEnabled) {
                hideNotificationIndicator();
                return;
            }

            clearTimeout(notificationTimer);
            indicator.classList.remove('saving', 'saved', 'warning', 'error');
            indicator.classList.add(status, 'visible');
            text.textContent = message;

            if (duration > 0) {
                notificationTimer = setTimeout(() => {
                    indicator.classList.remove('visible');
                }, duration);
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // AUTO-SAVE SYSTEM
        // ═══════════════════════════════════════════════════════════════

        function pruneModelScopedState() {
            const validIds = new Set(models.map((m) => String(m.id)));
            answerDrafts = Object.fromEntries(
                Object.entries(answerDrafts).filter(([modelId]) => validIds.has(String(modelId)))
            );
            modelRatings = Object.fromEntries(
                Object.entries(modelRatings).filter(([modelId]) => validIds.has(String(modelId)))
            );
            continuationUrls = Object.fromEntries(
                Object.entries(continuationUrls).filter(([modelId]) => validIds.has(String(modelId)))
            );
        }

        function getAnswerValue(modelId) {
            const el = document.getElementById(`answer-${modelId}`);
            if (el) {
                answerDrafts[modelId] = el.value;
                return el.value;
            }
            return answerDrafts[modelId] || '';
        }

        function getTrimmedAnswerValue(modelId) {
            return getAnswerValue(modelId).trim();
        }

        function setAnswerValue(modelId, value) {
            const nextValue = value || '';
            answerDrafts[modelId] = nextValue;
            const el = document.getElementById(`answer-${modelId}`);
            if (el && el.value !== nextValue) {
                el.value = nextValue;
            }
            comparisonDirty = true;
        }

        function clearAnswerDrafts() {
            answerDrafts = {};
            comparisonDirty = true;
        }

        function handleAnswerInput(modelId, value) {
            answerDrafts[modelId] = value;
            comparisonDirty = true;
            autoSave();
        }

        function handleChatUrlInput(modelId, value) {
            const safeUrl = getSafeHttpUrl(value);
            if (safeUrl) {
                continuationUrls[modelId] = safeUrl;
            } else {
                delete continuationUrls[modelId];
            }
            modelCardsDirty = true;
            autoSave();
        }

        function ensureModelCardsRendered(force = false) {
            if (!force && !modelCardsDirty) return;
            renderModelCards();
        }

        function getAutoSaveState() {
            const answers = {};
            models.forEach(m => {
                const value = getAnswerValue(m.id);
                if (value) answers[m.id] = value;
            });
            return {
                rawPrompt: document.getElementById('rawPrompt').value,
                improvedPrompt: document.getElementById('improvedPrompt').value,
                finalAnswer: document.getElementById('finalAnswer').value,
                answers,
                ratings: { ...modelRatings },
                currentStep,
                currentThreadId: currentThread ? currentThread.id : null,
                timestamp: new Date().toISOString()
            };
        }

        function autoSave() {
            clearTimeout(autosaveTimer);
            autosaveTimer = setTimeout(async () => {
                try {
                    const state = getAutoSaveState();
                    await writeStoredText(STORAGE_KEYS.autosave, JSON.stringify(state), { mirrorLocal: false });
                    showAutoSaveIndicator('saved');
                } catch(e) {
                    console.error('Auto-save error:', e);
                }
            }, 800);
            showAutoSaveIndicator('saving');
        }

        async function restoreAutoSave() {
            try {
                const saved = await readStoredText(STORAGE_KEYS.autosave);
                if (!saved) return false;
                const state = JSON.parse(saved);
                if (!state.rawPrompt && !state.improvedPrompt && !state.finalAnswer) return false;

                document.getElementById('rawPrompt').value = state.rawPrompt || '';
                document.getElementById('improvedPrompt').value = state.improvedPrompt || '';
                document.getElementById('finalAnswer').value = state.finalAnswer || '';
                clearAnswerDrafts();

                if (state.answers) {
                    Object.entries(state.answers).forEach(([modelId, value]) => {
                        setAnswerValue(modelId, value);
                    });
                }

                modelRatings = normalizeOverallRatings(state.ratings);
                if (Object.keys(modelRatings).length === 0 && state.criteriaRatings) {
                    modelRatings = migrateCriteriaRatingsToOverall(state.criteriaRatings);
                }
                pruneModelScopedState();

                models.forEach((m) => updateRatingDisplay(m.id));
                comparisonDirty = true;
                refreshComparisonView();

                autosaveStepToRestore = state.currentStep || 1;

                // Restore currentThread from saved ID
                if (state.currentThreadId && allThreads.length > 0) {
                    const foundThread = allThreads.find(t => t.id === state.currentThreadId);
                    if (foundThread) {
                        currentThread = foundThread;
                        isContinuation = foundThread.turns.length > 0;
                    }
                }

                return true;
            } catch(e) {
                console.error('Restore auto-save error:', e);
                return false;
            }
        }

        async function clearAutoSave() {
            await removeStoredText(STORAGE_KEYS.autosave);
        }

        function showAutoSaveIndicator(status) {
            if (status === 'saving') {
                showSystemNotification('Saving...', 'saving', 0);
            } else if (status === 'saved') {
                showSystemNotification('Saved', 'saved', 2000);
            }
        }

        function initAutoSave() {
            const fields = ['rawPrompt', 'improvedPrompt', 'finalAnswer'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', autoSave);
            });
        }

        // ═══════════════════════════════════════════════════════════════
        