function logger() {
  return chrome.extension.getBackgroundPage().console.log;
}


window.onload = function () {

  $('#cora-highlight-items').on('click', function () {
    chrome.tabs.getSelected(function (tab) {
      chrome.tabs.sendMessage(tab.id, { "type": "HIGHLIGHT" });
      self.close();
    })
  });

  $('#cora-push-items').on('click', function () {
    chrome.tabs.getSelected(function (tab) {
      chrome.tabs.sendMessage(tab.id, { "type": "PUSH_ITEMS" });
      self.close();
    })
  });

}