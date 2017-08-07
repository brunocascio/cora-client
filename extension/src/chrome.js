module.exports = function (collector) {

  collector.getTemplates()
    .then(templates => {
      console.log(`Templates found: ${templates.found}`);

      chrome.runtime.onMessage.addListener((request, sender, senderResponse) => {
        switch (request.type) {
          case 'HIGHLIGHT':
            collector
              .showItems(templates.items)
              .then((total) => {
                chrome.runtime.sendMessage({ method: "itemsFound", total })
              });
            break;
          case 'PUSH_ITEMS':
            collector
              .pushSelectedItems()
              .then((res) => alert('Enviado al server con éxito!'))
              .catch((err) => alert(err))
              .then(() => collector.clean());
            break;
          default:
            console.log('UNHANDLED message', request)
            break;
        }
      });

      if (templates.found) {
        chrome.runtime.sendMessage({ method: "templatesFound" });
      } else {
        chrome.runtime.sendMessage({ method: "templatesNotFound" });
      }
    });
}