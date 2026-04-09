// Theme
        function initTheme() {
            const saved = localStorage.getItem('multillm_theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = saved || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
            updateThemeIcon(theme);
        }
        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('multillm_theme', next);
            updateThemeIcon(next);
        }
        function updateThemeIcon(theme) {
            const light = document.getElementById('themeIconLight');
            const dark = document.getElementById('themeIconDark');
            if (theme === 'dark') { light.classList.add('hidden'); dark.classList.remove('hidden'); }
            else { light.classList.remove('hidden'); dark.classList.add('hidden'); }
        }

        