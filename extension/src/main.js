import ItemsCollector from './items-collector';

const collector = new ItemsCollector(window.location.href);

if (typeof chrome !== undefined) {
  // is chrome
  require('./chrome')(collector);
} else {
  // is firefox
  // TODO: code for mozilla :P
}
