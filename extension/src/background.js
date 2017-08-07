class CoraHandler {

  static _showDisabledIcon() {
    chrome.browserAction.setIcon({ path: "./icon_disabled_19.png" });
  }

  static _showDefaultIcon() {
    chrome.browserAction.setIcon({ path: "./icon_19.png" });
  }

  static _showAskIcon() {
    chrome.browserAction.setIcon({ path: "./icon_found_19.png" });
  }

  static _hideBadge() {
    chrome.browserAction.setBadgeText({ text: '' });
  }

  static _showBadge(text) {
    chrome.browserAction.setBadgeText({ text });
  }

  static templatesNotFound(request, sender, sendResponse) {
    this._showDisabledIcon();
    this._hideBadge();
  }

  static templatesFound(request, sender, sendResponse) {
    this._showAskIcon();
    this._hideBadge();
  }

  static itemsFound(request, sender, sendResponse) {
    this._showDefaultIcon();
    this.setCountBadge(request.total);
  }

  static setCountBadge(num) {
    const total = (num < 100) ? `${num}` : '99+';
    this._showDefaultIcon();
    this._showBadge(total);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  CoraHandler[`${request.method}`](request, sender, sendResponse);
});