// ==UserScript==
// @name         cora-scrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trabajo objetos 2
// @author       Bruno Cascio
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.mendeley.com/research-papers/.*
// ==/UserScript==

// ============= HTTPClient Class ==================

class HTTPClient {

  constructor(uri) {
    this.uri = uri;
  }

  getTemplate() {
    return axios.get(`${HTTPClient.TEMPLATES_URI}/matching?url=${this.uri}`);
  }

  pushItems(data) {
    const payload = {
      owner: 'no_reply@lifia.info.unlp.edu.ar',
      type: 'string',
      url: this.uri,
      groups: [
        "public"
      ],
      properties: data
    };
    return axios.post(`${HTTPClient.ITEMS_URI}`, payload);
  }
}

HTTPClient.TEMPLATES_URI = 'http://localhost:3000/api/Templates';
HTTPClient.ITEMS_URI = 'http://localhost:3000/api/Items';

// =========== CoralClient Class ===================

class CoralClient {

  constructor(uri) {
    this.uri = uri;
    this.client = new HTTPClient(uri);
    this.crawler = new Crawler(uri);
  }

  getSelectors() {
    return this.client.getTemplate()
      .then(res => res.data.response)
      .then(res => res.map(e => e.propertySelectors));
  }

  getSelectorType() {
    // TODO: retrive from server?
    return 'QuerySelector';
  }

  async getData() {
    let selectors = await this.getSelectors();

    const selectorsType = this.getSelectorType();

    if (selectorsType === 'QuerySelector') {
      this.crawler.setQSelectorStrategy();
    }
    else if (selectorsType === 'XpathSelector') {
      this.crawler.setXPathParserStrategy();
    }

    this.crawler.setSelectors(selectors);

    return await this.crawler.extract();
  }

  pushData(data) {
    return this.client.pushItems(data);
  }
}

// ============== Crawler Class ===================

class Crawler {

  constructor(uri) {
    this.uri = uri;
    this.parser = null;
    this.selectors = null;
  }

  setQSelectorStrategy() {
    this.parser = new QSelectorParser(this.uri);
  }

  setXPathStrategy() {
    this.parser = new XPathParser(this.uri);
  }

  setSelectors(selectors) {
    this.selectors = selectors;
  }

  extract() {
    return this.parser.extract(this.selectors);
  }
}

// =========== Parser Abstract Class ================

class Parser {

  constructor() {
    if (new.target === Parser) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    if (typeof this.extract !== "function") {
      throw new TypeError("Must override extract");
    }
  }
}

// =========== QSelectorParser Class ================

class QSelectorParser extends Parser {

  constructor() {
    super();
    this.finder = window.$;
  }

  extractSingle(obj) {
    let temp = {};
    return Object.entries(obj)
      .map(([key, value]) =>
        Object.assign({}, {
          [key]: this.finder(value).text().trim()
        }))
      .map((a) => Object.assign(temp, a))
      .pop();
  }

  extract(selectors) {
    return selectors.map((e) => this.extractSingle(e));
  }
}

// =========== XPathParser Class ====================

class XPathParser extends Parser {

  constructor() {
    super();
  }

  extract() {
    console.log('XPathParser', 'extracting data....');
  }
}

// =================================================
// ================= App Class =====================
// =================================================

class App {

  constructor(uri) {
    this.uri = uri;
    this.client = new CoralClient(uri);
  }

  async run() {
    console.info('App run()', `at ${this.uri}`);
    try {
      const data = await this.client.getData();
      const res = await this.client.pushData(data);
      console.log("Guardado", res);
      return res;
    } catch (e) {
      console.log(e);
    }
  }
}

// Fire!

(new App(window.location.href)).run();