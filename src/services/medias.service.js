import api from '../api';
import { medias } from '../api/endpoints.js'

export default {
  getMedias(mediaPlanId) {
    return api
      .get(`${medias}/?mediaPlan=${mediaPlanId}`)
      .then(response => response.data);
  }
};