import ItemsCollectorUI from './items-collector-ui';

const collector = new ItemsCollectorUI(window.location.href);

collector.run();

// . . . collector.urlChanged()