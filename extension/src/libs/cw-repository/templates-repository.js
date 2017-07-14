import axios from 'axios';

export default class TemplatesRepository {

  static getTemplatesFor(uri) {
    return axios.get(`
      ${TemplatesRepository.TEMPLATES_URI}/matching?url=${uri}
    `);
  }
}

TemplatesRepository.TEMPLATES_URI = `http://localhost:3000/api/Templates`;