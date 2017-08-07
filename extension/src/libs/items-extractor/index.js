import TemplatesRepo from '../cw-repository/templates-repository';

export default class ItemsExtractor {

  constructor(uri) {
    this.uri = uri;
    this.templateRepo = TemplatesRepo;
  }

  async canExtract() {
    try {
      const req = await this.getTemplates();
      return (req.length > 0);
    } catch (error) {
      console.error('Error on canExtract()', error)
      return false;
    }
  }

  async getTemplates() {
    try {
      return await this.templateRepo.getTemplatesFor(this.uri);
    } catch (error) {
      console.error('Error on getTemplates()', error)
      return [];
    }
  }

  /**
   * Get items by templates
   * 
   * @param {array} templates
   * @return {array} of propertySelectors objects 
   */
  async getItems(templates) {
    try {
      const res = await this.getTemplates();
      // Get the properties for the templates passed by arg
      // and return just the propertySelectors property
      return res
        .filter(template => templates.find(t => t.id == template.id))
        .map(template => template.propertySelectors);
    } catch (err) {
      console.log('Error on getItems()', err);
      return [];
    }
  }
}