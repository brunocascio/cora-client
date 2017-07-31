class CoraHandler {

  static templatesNotFound(request, sender, sendResponse) {
    chrome.browserAction.setIcon({ path: "./icon_disabled_19.png" });
    chrome.browserAction.setBadgeText({ text: '' });
  }

  static templatesFound(request, sender, sendResponse) {
    chrome.browserAction.setIcon({ path: "./icon_found_19.png" });
    chrome.browserAction.setBadgeText({ text: '' });
  }

  static setCountBadge(request, sender, sendResponse) {
    const text = (request.total < 100) ? request.total : '99+';
    chrome.browserAction.setIcon({ path: "./icon_found_19.png" });
    chrome.browserAction.setBadgeText({ text: text + '' });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  CoraHandler[`${request.message}`](request, sender, sendResponse);
});