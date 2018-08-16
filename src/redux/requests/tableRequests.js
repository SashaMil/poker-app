import axios from 'axios';

export function shuffleRequest() {
  return axios.put('/api/table/shuffle', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}

export function checkGameStatusRequest() {
  return axios.post('/api/table/checkGameStatus', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}

export function getGameInfoRequest() {
  return axios.get('/api/table/gameInfo', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}

export function computerDecisionRequest() {
  return axios.post('/api/logic/computerDecision', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}

export function getStreetRequest() {
  return axios.get('/api/table/street', {

  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}











//
