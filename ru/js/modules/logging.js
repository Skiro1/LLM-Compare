// APP LOGGING SYSTEM
        // ═══════════════════════════════════════════════════════════════
        let appLogs = [];
        let loggingEnabled = true;
        let logFilter = 'all';
        const MAX_LOGS = 500;

        function appLog(level, message, details = null) {
            if (!loggingEnabled) return;
            const entry = {
                id: Date.now() + Math.random(),
                time: new Date().toISOString(),
                level,      // 'info' | 'warn' | 'error' | 'success'
                message,
                details
            };
            appLogs.unshift(entry);     // newest first
            if (appLogs.length > MAX_LOGS) appLogs.length = MAX_LOGS;
            saveLogs();
            updateLogBadge();
            // Refresh logs view if tab is open
            if (settingsTab === 'logs') renderLogs();
        }

        function saveLogs() {
            try {
                localStorage.setItem('multillm_logs', JSON.stringify(appLogs.slice(0, MAX_LOGS)));
            } catch(e) { /* silent */ }
        }

        function loadLogs() {
            try {
                const raw = localStorage.getItem('multillm_logs');
                if (raw) appLogs = JSON.parse(raw);
            } catch(e) { appLogs = []; }
            try {
                loggingEnabled = localStorage.getItem('multillm_logging_enabled') !== 'false';
            } catch(e) { loggingEnabled = true; }
        }

        function clearLogs() {
            appLogs = [];
            saveLogs();
            updateLogBadge();
            renderLogs();
            updateLogStats();
        }

        function exportLogs() {
            const text = appLogs.map(e =>
                `[${e.time}] [${e.level.toUpperCase()}] ${e.message}${e.details ? '\n  ' + e.details : ''}`
            ).join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `multillm-logs-${new Date().toISOString().slice(0,10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            appLog('info', 'Логи экспортированы');
        }

        function setLogFilter(filter, btn) {
            logFilter = filter;
            document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            renderLogs();
        }

        function renderLogs() {
            const container = document.getElementById('logsList');
            const emptyEl = document.getElementById('logsEmpty');
            if (!container) return;

            const filtered = logFilter === 'all' ? appLogs : appLogs.filter(e => e.level === logFilter);

            if (filtered.length === 0) {
                container.innerHTML = '';
                if (emptyEl) emptyEl.style.display = '';
                return;
            }
            if (emptyEl) emptyEl.style.display = 'none';

            container.innerHTML = filtered.map(e => {
                const t = new Date(e.time);
                const timeStr = t.toLocaleTimeString('ru-RU', { hour12: false }) + '.' + String(t.getMilliseconds()).padStart(3,'0');
                const dateStr = t.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit' });
                return `<div class="log-entry">
                    <span class="log-time">${dateStr} ${timeStr}</span>
                    <span class="log-level ${e.level}">${e.level}</span>
                    <span class="log-message">${escapeHtml(e.message)}${e.details ? `<div class="log-details">${escapeHtml(String(e.details))}</div>` : ''}</span>
                </div>`;
            }).join('');
            updateLogStats();
        }

        function updateLogStats() {
            const total = document.getElementById('log-stat-total');
            const errors = document.getElementById('log-stat-errors');
            const warns = document.getElementById('log-stat-warns');
            if (total) total.textContent = appLogs.length;
            if (errors) errors.textContent = appLogs.filter(e => e.level === 'error').length;
            if (warns) warns.textContent = appLogs.filter(e => e.level === 'warn').length;
        }

        function updateLogBadge() {
            const errorCount = appLogs.filter(e => e.level === 'error').length;
            const badge = document.getElementById('log-error-badge');
            if (!badge) return;
            if (errorCount > 0) {
                badge.textContent = errorCount > 99 ? '99+' : errorCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        function onLoggingToggleChange() {
            const checked = document.getElementById('loggingEnabledToggle').checked;
            loggingEnabled = checked;
            localStorage.setItem('multillm_logging_enabled', String(checked));
        }

        // ═══════════════════════════════════════════════════════════════
        // PROVIDERS CONFIG  (local + cloud)
        // ═══════════════════════════════════════════════════════════════
        