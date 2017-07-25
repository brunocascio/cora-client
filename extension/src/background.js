import CoraHandler from './libs/events/handler';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  CoraHandler[`${request.message}`](request, sender, sendResponse);
});