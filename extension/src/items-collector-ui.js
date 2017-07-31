// import ItemsRepo from './libs/cw-repository/items-repository';
import IExtractor from './libs/items-extractor';
import style from './extractor.css'
import $ from 'jquery';

export default class ItemsCollectorUI {

  constructor(uri) {
    console.log(`Initialized extension at ${uri}`);
    this.autopublish = false;
    this.uri = uri;
    this.extractor = new IExtractor(uri);
    this.selectorsArray = [];
    this.highlighted = false;
    this.inputs = [];
    // this.itemsRepo = new ItemsRepo();
  }

  async run() {
    const success = await this.hasTemplates();
    if (success) {
      this.informTemplatesAvailable();
    } else {
      this.informNoTemplatesAvailable();
    }
  }

  async hasTemplates() {
    this.hasTemplates = await this.extractor.canExtract();

    return this.hasTemplates;
  }

  informTemplatesAvailable() {
    chrome.runtime.sendMessage({ message: "templatesFound" });
  }

  informNoTemplatesAvailable() {
    chrome.runtime.sendMessage({ message: "templatesNotFound" });
  }

  showItemsCount(items) {
    const total = this.selectorsArray.reduce((sum, obj) => {
      return sum + Object.keys(obj).length
    }, 0);

    chrome.runtime.sendMessage({ message: "setCountBadge", total });
  }

  async highlightExtractedItems() {
    if (this.highlighted || !this.hasTemplates)
      return;

    $('body').append($('<div class="cora-overlay"></div>'));

    this.selectorsArray = await this.extractor.extract();

    this.showItemsCount(this.selectorsArray);

    this.selectorsArray.map(selectors => Object.values(selectors)
      .forEach(value => this._highlightItem($(value)))
    );

    this.highlighted = true;
  }

  _highlightItem($item) {
    const position = $item.offset();
    const width = $item.width() - 50;
    const height = $item.height();
    const itemText = $item.html();

    const $input = $(`
      <div class="cora-can-extract" id="cora-${$item.attr('id')}">
        <div class="content">${itemText}</div>
        <div class="check">
          <input type="checkbox" checked/>
        </div>
      </div>`)
      .css(position)
      .css({ width });

    this.inputs.push($input);

    $('body').append($input);
  }

  publishOnlyThisItem(item) {
    // this.itemsRepo = new ItemsRepo();
    console.log('It will push an item.');
  }

  publishAllExtractedItems() {
    // this.itemsRepo = new ItemsRepo();
    console.log('It will push items.');
    const objToPush = {};
    this.inputs
      .forEach(($el) => {
        const root = $el.find('input[type="checkbox"]:checked').closest('.cora-can-extract');
        const key = $el.attr('id').replace('cora-', '');
        const text = root.find('.content').html();
        objToPush[key] = text;
      });

    console.log(objToPush);

    // TODO: push to the server.......
  }

  urlChanged(uri) {
    this.uri = url;
  }
}