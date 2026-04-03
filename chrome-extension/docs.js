
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
            const text = document.getElementById('themeText');
            if (theme === 'dark') {
                light.classList.add('hidden');
                dark.classList.remove('hidden');
                text.textContent = 'Light';
            } else {
                light.classList.remove('hidden');
                dark.classList.add('hidden');
                text.textContent = 'Dark';
            }
        }

        // Sidebar
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        function setActiveLink(el) {
            document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
            el.classList.add('active');
            // Close sidebar on mobile
            if (window.innerWidth <= 1024) {
                document.getElementById('sidebar').classList.remove('open');
            }
        }

        // Active link on scroll
        function updateActiveLinkOnScroll() {
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        // Code tabs
        function switchTab(blockId, lang, btn) {
            // Hide all code blocks for this block
            const blocks = document.querySelectorAll(`[id^="${blockId}-"]`);
            blocks.forEach(block => block.classList.add('hidden'));
            
            // Show selected block
            const selected = document.getElementById(`${blockId}-${lang}`);
            if (selected) selected.classList.remove('hidden');
            
            // Update tabs
            const tabs = btn.parentElement.querySelectorAll('.code-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');
            
            // Update lang label
            const langLabel = document.getElementById(`${blockId}Lang`);
            if (langLabel) langLabel.textContent = lang.toUpperCase();
        }

        // Copy code
        function copyCode(blockId) {
            const activeBlock = document.querySelector(`[id^="${blockId}-"]:not(.hidden)`);
            if (!activeBlock) return;
            
            const text = activeBlock.textContent;
            copyToClipboard(text, blockId);
        }

        function copySingleCode(btn) {
            const codeBlock = btn.parentElement.querySelector('.code-block');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                btn.classList.add('copied');
                btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy';
                }, 2000);
            });
        }

        function copyToClipboard(text, blockId) {
            const btn = document.querySelector(`[data-action="copyCode"][data-block-id="${blockId}"]`);
            if (!btn) return;

            navigator.clipboard.writeText(text).then(() => {
                btn.classList.add('copied');
                btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy';
                }, 2000);
            });
        }

        // Sync theme with main app
        window.addEventListener('storage', (e) => {
            if (e.key === 'multillm_theme') {
                document.documentElement.setAttribute('data-theme', e.newValue);
                updateThemeIcon(e.newValue);
            }
        });

        // Init
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            window.addEventListener('scroll', updateActiveLinkOnScroll);
        });
    



// ═══════════════════════════════════════════════════
// Event Listeners (auto-converted from inline handlers)
// ═══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('ext-el-1').addEventListener('click', toggleSidebar);
    document.getElementById('ext-el-2').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-2')); });
    document.getElementById('ext-el-3').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-3')); });
    document.getElementById('ext-el-4').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-4')); });
    document.getElementById('ext-el-5').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-5')); });
    document.getElementById('ext-el-6').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-6')); });
    document.getElementById('ext-el-7').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-7')); });
    document.getElementById('ext-el-8').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-8')); });
    document.getElementById('ext-el-9').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-9')); });
    document.getElementById('ext-el-10').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-10')); });
    document.getElementById('ext-el-11').addEventListener('click', function() { setActiveLink(document.getElementById('ext-el-11')); });
    document.getElementById('ext-el-12').addEventListener('click', function() { switchTab('firstRequest', 'curl', document.getElementById('ext-el-12')); });
    document.getElementById('ext-el-13').addEventListener('click', function() { switchTab('firstRequest', 'python', document.getElementById('ext-el-13')); });
    document.getElementById('ext-el-14').addEventListener('click', function() { switchTab('firstRequest', 'javascript', document.getElementById('ext-el-14')); });
    document.getElementById('ext-el-15').addEventListener('click', function() { copyCode('firstRequest'); });
    document.getElementById('ext-el-16').addEventListener('click', function() { copySingleCode(document.getElementById('ext-el-16')); });
    document.getElementById('ext-el-17').addEventListener('click', function() { switchTab('listModels', 'curl', document.getElementById('ext-el-17')); });
    document.getElementById('ext-el-18').addEventListener('click', function() { switchTab('listModels', 'python', document.getElementById('ext-el-18')); });
    document.getElementById('ext-el-19').addEventListener('click', function() { copyCode('listModels'); });
    document.getElementById('ext-el-20').addEventListener('click', function() { copySingleCode(document.getElementById('ext-el-20')); });
    document.getElementById('ext-el-21').addEventListener('click', function() { switchTab('streaming', 'curl', document.getElementById('ext-el-21')); });
    document.getElementById('ext-el-22').addEventListener('click', function() { switchTab('streaming', 'python', document.getElementById('ext-el-22')); });
    document.getElementById('ext-el-23').addEventListener('click', function() { switchTab('streaming', 'javascript', document.getElementById('ext-el-23')); });
    document.getElementById('ext-el-24').addEventListener('click', function() { copyCode('streaming'); });
    document.getElementById('ext-el-25').addEventListener('click', function() { copySingleCode(document.getElementById('ext-el-25')); });
    document.getElementById('ext-el-26').addEventListener('click', function() { copySingleCode(document.getElementById('ext-el-26')); });
    // Event delegation for copy buttons
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('[data-action="copyCode"]');
        if (btn) {
            const blockId = btn.getAttribute('data-block-id');
            copyCode(blockId);
        }
    });

});;
