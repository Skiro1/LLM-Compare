document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('openApp').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('LLM_Compare.html') });
    });

    document.getElementById('openDocs').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('api-docs.html') });
    });
});
