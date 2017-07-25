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
    // this.itemsRepo = new ItemsRepo();
  }

  async run() {
    if (await this.hasTemplates()) {
      this.informTemplatesAvailable();
    } else {
      this.informNoTemplatesAvailable();
    }
  }

  async hasTemplates() {
    return await this.extractor.canExtract();
  }

  informTemplatesAvailable() {
    chrome.runtime.sendMessage({ message: "templatesFound" });
  }

  informNoTemplatesAvailable() {
    chrome.runtime.sendMessage({ message: "templatesNotFound" });
  }

  async highlightExtractedItems() {
    $('body').append($('<div class="cora-overlay"></div>'));

    this.selectorsArray = await this.extractor.extract();

    this.showItemsCount(this.selectorsArray.length);

    this.selectorsArray.map(selectors => Object.values(selectors)
      .forEach(value => this._highlightItem($(value)))
    );
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

    $('body').append($input);
  }

  publishOnlyThisItem(item) {
    // this.itemsRepo = new ItemsRepo();
  }

  publishAllExtractedItems() {
    // this.itemsRepo = new ItemsRepo();
  }

  urlChanged(uri) {
    this.uri = url;
  }
}