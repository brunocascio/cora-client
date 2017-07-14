import TemplatesRepo from '../cw-repository/templates-repository';

export default class ItemsExtractor {

  constructor(uri) {
    this.uri = uri;
    this.items = [];
    this.templateRepo = TemplatesRepo;
  }

  async canExtract() {
    // TODO: check if exists some template
    const req = await this.templateRepo.getTemplatesFor(this.uri);
    return (req.status == 200) && (!!req.data.response.length);
  }

  async extract() {
    try {
      const res = await this.templateRepo.getTemplatesFor(this.uri);
      this.items = await res.data.response
        .map(template => template.propertySelectors);
    } catch (err) {
      console.log('Error on extract()', err);
      return [];
    }

    return this.items;
  }
}