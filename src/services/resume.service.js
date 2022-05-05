import api from '../api'
import { media_plans } from '../api/endpoints'

export default {
  getResumeLocations(mediaPlanId) {
    return api
      .get(`/media-plans/resume/locations?mediaPlan=${mediaPlanId}`)
      .then(response => response.data)
  },
  getMap(mediaPlanId) {
    return api
      .get(`/media-plans/map?mediaPlan=${mediaPlanId}`)
      .then(response => response.data)
  },
  getInvestments(mediaPlanId) {
    return api
      .get(`/media-plans/investments?mediaPlan=${mediaPlanId}`)
      .then(response => response.data)
  },
  getMediaPlan(mediaPlanId) {
    return api
      .get(media_plans + `/${mediaPlanId}`)
      .then(response => response.data);
  },
}