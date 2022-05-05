import api from '../api';
import { targets } from '../api/endpoints.js'

export default {
  getTargets(mediaPlanId) {
    return api
      .get(`${targets}/?mediaPlan=${mediaPlanId}`)
      .then(response => response.data);
  },
  saveTargets(mediaPlanId, targetIds) {
    return api
      .put(`/media-plans/${mediaPlanId}/target`, { targetIds })
      .then(response => response.data)
  },
  getUniverses(mediaPlanId) {
    return api
      .get(`${targets}/universes?mediaPlan=${mediaPlanId}`)
      .then(response => response.data);
  }
};