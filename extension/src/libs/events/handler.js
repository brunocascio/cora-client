export default class CoraHandler {

  static templatesNotFound(request, sender, sendResponse) {
    console.log('called templatesNotFound')
    chrome.browserAction.setIcon({ path: "./icon_disabled_19.png" });
  }

  static templatesFound(request, sender, sendResponse) {
    console.log('called templatesFound')
    chrome.browserAction.setIcon({ path: "./icon_found_19.png" });

  }

  static setCountBadge(request, sender, sendResponse) {
    const text = (request.total < 100) ? request.total : '99+';
    chrome.browserAction.setBadgeText({ text });
  }
}