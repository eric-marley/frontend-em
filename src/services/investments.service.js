import api from '../api'
import { investments } from '../api/endpoints'

export default {
  getInvestments(mediaPlanId) {
    return api
      .get(`${investments}?mediaPlan=${mediaPlanId}`)
      .then(response => response.data)
  }
}