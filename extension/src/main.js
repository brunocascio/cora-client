import ItemsCollectorUI from './items-collector-ui';

const collector = new ItemsCollectorUI(window.location.href);

collector.hasTemplates()
  .then((hasTemplates) => {
    if ( hasTemplates ) {
      collector.highlightExtractedItems();
      // ...
      // bindings events in order to push items
      // ...
    } else {
      collector.informNoTemplateAvailable();
    }
  })
  .catch(console.error)

// . . . collector.urlChanged()