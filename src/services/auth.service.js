import api from '../api';
import { auth, users } from '../api/endpoints.js'

export default {
  login(credentials) {
    return api
      .post(auth + '/login/', credentials)
      .then(response => response.data);
  },
  me() {
    return api
      .get(users + '/me/')
      .then(response => response.data);
  }
};