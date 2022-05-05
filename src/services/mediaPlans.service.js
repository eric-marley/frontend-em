import api from '../api';
import { media_plans } from '../api/endpoints.js'

export default {
  fetchAll({accountId, limit, skip}) {
    limit = limit || 10;
    skip = skip || 0;

    return api
      .get(`${media_plans}/?accountId=${accountId}&limit=${limit}&skip=${skip}`)
      .then(response => response.data);
  },

  getMediaPlan(mediaPlanId) {
    return api
      .get(media_plans + `/${mediaPlanId}`)
      .then(response => response.data);
  },

  getLocals(params) {
    const URLParams = {
      search: params.search ? encodeURIComponent(params.search) : '',
      limit: params.limit || 10,
      skip: params.skip || 0
    }

    const newURLParams = `search=${URLParams.search}&limit=${URLParams.limit}&skip=${URLParams.skip}`
    return api
      .get(`${media_plans}/locations/regions?${newURLParams}`)
      .then(response => response.data);
  },

  create(mediaPlan, accountId) {
    let regions = []
    let locations = []
    let ignoreErrors = null;
    let rangeOfPreference = null
    const type = mediaPlan.campaignObjective == 'city' ? 'PLACES_BY_TARGET' : 'SURROUND_LOCATIONS';
    
    if (type === 'PLACES_BY_TARGET') {
      regions = mediaPlan.regionTags.length ? mediaPlan.regionTags.map(item => item.text) : [];
    } else {
      locations = mediaPlan.tableRegions.length ? mediaPlan.tableRegions : [];
      ignoreErrors = mediaPlan.ignoreErrors;
      rangeOfPreference = mediaPlan.selectedRange
    }

    return api
      .post(media_plans + '/', {
        name: mediaPlan.campaignName,
        objective: {
          type: type,
          regions: regions,
          locations: locations,
          ignoreErrors,
          rangeOfPreference
        },
        accountId: accountId
      })
      .then(response => response.data)
  },
  update(mediaPlan) {
    let regions = [];
    let locations = []
    let ignoreErrors = null;
    let rangeOfPreference = null;
    const type = mediaPlan.campaignObjective == 'city' ? 'PLACES_BY_TARGET' : 'SURROUND_LOCATIONS';
    
    if (type === 'PLACES_BY_TARGET') {
      regions = mediaPlan.regionTags.length ? mediaPlan.regionTags.map(item => item.text) : [];
    } else {
      locations = mediaPlan.tableRegions.length ? mediaPlan.tableRegions : [];
      ignoreErrors = mediaPlan.ignoreErrors;
      rangeOfPreference = mediaPlan.selectedRange
    }

    return api
      .put(`${media_plans}/${mediaPlan._id}/identity-and-locations`, {
        name: mediaPlan.campaignName,
        objective: {
          type: type,
          regions: regions,
          locations: locations,
          ignoreErrors,
          rangeOfPreference
        }
      })
      .then(response => response.data)
  },
  uploadSurroundLocation(location) {
    return api
      .post(media_plans + '/locations/upload', location)
      .then(response => response.data)
  },
  updateMedias(mediaPlanId, {medias, period}) {
    return api
      .put(`${media_plans}/${mediaPlanId}/midias`, {
        midias: medias,
        period: period
      })
      .then(response => response.data)
  },
  updateInvestments(mediaPlanId, investments) {
    return api
      .put(`${media_plans}/${mediaPlanId}/investments`, investments)
      .then(response => response.data)
  },
  getInvestmentResult(params){
    return api.get(`${media_plans}/investments/custom`, {
      params: {
        region: params.region,
        budget: params.investment,
        mediaPlan: params.mediaPlan
      }
    })
  }
};