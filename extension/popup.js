function logger() {
  return chrome.extension.getBackgroundPage().console.log;
}

function sendMessage(tabId, params) {
  chrome.tabs.sendMessage(tabId, params);
}

function getCurrentTab(cb) {
  chrome.tabs.getSelected(cb);
}


window.onload = function () {

  $('#cora-highlight-items').on('click', function () {
    getCurrentTab((tab) => {
      sendMessage(tab.id, { "type": "HIGHLIGHT" });
      self.close();
    })
  });

  $('#cora-push-items').on('click', function () {
    getCurrentTab((tab) => {
      sendMessage(tab.id, { "type": "PUSH_ITEMS" });
      self.close();
    })
  });

}