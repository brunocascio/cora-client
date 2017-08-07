import axios from 'axios';

export default class ItemsRepository {

  static pushItems(uri, params) {
    const endpoint = ItemsRepository.ITEMS_URI;

    const payload = Object.assign({}, {
      owner: 'no_reply@lifia.info.unlp.edu.ar',
      type: 'string',
      url: uri,
      groups: [
        "public"
      ],
    }, params);

    return axios.post(endpoint, payload).then(res => res.data.response);
  }
}

ItemsRepository.ITEMS_URI = 'http://localhost:3000/api/Items';