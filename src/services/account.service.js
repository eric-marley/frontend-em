import api from '../api';
import { accounts } from '../api/endpoints.js'

export default {
  fetchAll() {
    return api
      .get(accounts + '/')
      .then(response => response.data);
  }
};