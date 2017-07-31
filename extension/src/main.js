import ItemsCollectorUI from './items-collector-ui';

const collector = new ItemsCollectorUI(window.location.href);

collector.run();

chrome.runtime.onMessage.addListener((request, sender, senderResponse) => {
  switch (request.type) {
    case 'HIGHLIGHT':
      collector.highlightExtractedItems();
      senderResponse(true);
      break;
    case 'PUSH_ITEMS':
      collector.publishAllExtractedItems();
      break;
    default:
      break;
  }
});
