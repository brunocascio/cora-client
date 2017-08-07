import ItemsExtractor from './libs/items-extractor';
import ItemsRepository from './libs/cw-repository/items-repository';
import style from './extractor.css'
import $ from 'jquery';

export default class ItemsCollector {

  constructor(uri) {
    console.log(`Item Collector at ${uri}`);
    this.uri = uri;
    this.extractor = new ItemsExtractor(uri);
    this.alreadyHighlighted = false;
    this.itemsRepository = ItemsRepository;
    this.items = {};
  }

  clean() {
    $('.cora-overlay').remove();
    $('.cora-can-extract').remove();
    this.items = {};
    this.alreadyHighlighted = false;
  }

  /**
   * Retrieves templates of the current URI
   * 
   * @return {object} {found: <bool>, items: <array>}
   */
  async getTemplates() {
    // check if exists templates in the current site
    const success = await this.extractor.canExtract();
    // default response
    const res = { found: success, items: [], count: 0 };

    if (success) {
      // retrieves available templates
      res.items = await this.extractor.getTemplates();
    }

    res.count = res.items.length;

    return res;
  }

  /**
   * Shows items for the templates
   * 
   * @param {array} of templates
   * @return {numeric} Total of highlighted items
   */
  async showItems(templates) {
    if (!templates.length || this.alreadyHighlighted) {
      return;
    }

    this._createOverlay();

    this._bindEvents();

    this.alreadyHighlighted = true;

    return (await this.extractor.getItems(templates))
      .map((items) =>
        Object
          .keys(items)
          .map(key => this._highlightItem(key, items[key])))
      .reduce((sum, items) => sum += items.length, 0);
  }

  async pushSelectedItems() {
    if (!Object.keys(this.items).length) {
      throw Error("No hay items para enviar.");
    }
    return await this.itemsRepository
      .pushItems(this.uri, { properties: this.items });
  }

  // ------------------------------------------------
  // Private methods
  // ------------------------------------------------

  _getOriginalKey(key) {
    return key.replace(/^cora-item-/, '');
  }

  _addItem({ id, content }) {
    const key = this._getOriginalKey(id);
    this.items[key] = content;
  }

  _removeItem(id) {
    const key = this._getOriginalKey(id);
    delete this.items[key];
  }

  _createOverlay() {
    $('body').append($(`
      <div id="cora-overlay" class="cora-overlay">
        <div class="cora-actions">
          <button id="cora-button-select-all">Marcar Todo</button>
          <button id="cora-button-deselect-all">Desmarcar Todo</button>
          <button id="cora-button-cancel">Salir</button>
        </div>
      </div>`
    ));
  }

  _bindEvents() {

    $('body').on('click', '#cora-button-cancel', () => this.clean());

    $('body').on('click', '.cora-can-extract input[type="checkbox"]', (e) => {
      const parent = $(e.target).closest('.cora-can-extract');
      const id = $(parent).prop('id');
      const content = $(parent).find('.content').text().trim();
      (e.target.checked) ? this._addItem({ id, content }) : this._removeItem(id);
    });

    $('body').on('click', '#cora-button-select-all', () => {
      $('.cora-can-extract')
        .find('input[type=checkbox]:not(:checked)')
        .trigger('click');
    });

    $('body').on('click', '#cora-button-deselect-all', () => {
      $('.cora-can-extract')
        .find('input[type=checkbox]:checked')
        .trigger('click');
    });
  }

  _highlightItem(key, selector) {
    const $item = $(selector);

    const position = $item.offset();
    const width = $item.width() - 50;
    const height = $item.height();
    const itemText = $item.html();

    const $input = $(`
      <div class="cora-can-extract" id="cora-item-${key}">
        <div class="content">${itemText}</div>
        <div class="check">
          <input type="checkbox" />
        </div>
      </div>`)
      .css(position)
      .css({ width });

    $('body').append($input);
  }
}