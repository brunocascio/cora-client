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

  hasTemplates() {
    return this.extractor.canExtract();
  }

  informNoTemplateAvailable() {
    // TODO: change the icon
  }

  async highlightExtractedItems() {
    $('body').css({'z-index': 0});
    $('body').prepend($('<div class="cora-overlay"></div>'));

    this.selectorsArray = await this.extractor.extract();

    this.selectorsArray.map(selectors =>
      Object.values(selectors)
        .forEach(value => $(value).addClass('cora-can-extract'))
    );

    // this.extractor
    //   .extract()
    //   .map((item) => $(item).addClass('cora-can-extract'));
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