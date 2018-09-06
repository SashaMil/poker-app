import axios from 'axios';

export function shuffleRequest(param) {
  return axios.put(`/api/table/shuffle/${param}`, {
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

export function getGameInfoRequest(param) {
  return axios.get(`/api/table/gameInfo`, {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}

export function computerActionRequest() {
  return axios.post('/api/computerAction/', {
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

export function playerFoldRequest() {
  return axios.post('/api/playerAction/fold', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}

export function playerCallRequest() {
  return axios.post('/api/playerAction/call', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; })
}

export function playerCheckRequest() {
  return axios.post('/api/playerAction/check', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; })
}

export function playerBetRequest(betSize) {
  return axios.post('/api/playerAction/bet', {
    betSize
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; })
}

export function playerRaiseRequest(betSize) {
  return axios.post('/api/playerAction/raise', {
    betSize
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; })
}









//
