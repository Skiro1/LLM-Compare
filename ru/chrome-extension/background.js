// background.js
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onInstalled) {
    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason === 'install') { chrome.tabs.create({ url: chrome.runtime.getURL('LLM_Compare.html') }); }
    });
}
