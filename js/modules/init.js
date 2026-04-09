// Initialize
        document.addEventListener('DOMContentLoaded', async () => {
            loadLogs();
            loadLmsSettings();
            loadSettings();
            loadPreferences();
            initAutoSave();
            initTheme();
            await loadThreads();
            
            // Restore auto-saved data
            if (await restoreAutoSave()) {
                if (autosaveStepToRestore >= 3) {
                    ensureModelCardsRendered();
                }
                setStep(autosaveStepToRestore);
            } else {
                setStep(1);
            }

            updateLmsUiVisibility();
            updateLogBadge();
            appLog('info', 'Application started');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+N - New chat
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                resetAll();
            }
            // Ctrl+S - Save to history (when on step 5)
            if (e.ctrlKey && e.key === 's' && currentStep === 5) {
                e.preventDefault();
                void saveToHistory();
            }
            // Ctrl+E - Export history
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportHistory();
            }
            // Ctrl+I - Import history
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                importHistory();
            }
            // Ctrl+H - Toggle history
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                if (document.getElementById('historyPanel').classList.contains('open')) {
                    closeHistory();
                } else {
                    openHistory();
                }
            }
            // Arrow keys for step navigation (when no input is focused)
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                if (e.key === 'ArrowRight' && currentStep < 5) {
                    e.preventDefault();
                    setStep(currentStep + 1);
                }
                if (e.key === 'ArrowLeft' && currentStep > 1) {
                    e.preventDefault();
                    setStep(currentStep - 1);
                }
            }
        });

        