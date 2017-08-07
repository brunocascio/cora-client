import axios from 'axios';

export default class TemplatesRepository {

  static getTemplatesFor(uri) {
    const endpoint = `${TemplatesRepository.TEMPLATES_URI}/matching?url=${uri}`;
    return axios.get(endpoint).then(res => res.data.response);
  }
}

TemplatesRepository.TEMPLATES_URI = `http://localhost:3000/api/Templates`;