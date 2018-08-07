import axios from 'axios';

export function shuffleRequest() {
  return axios.get('/api/table/shuffle', {
  })
    .then(response => response.data)
    .catch((error) => { throw error.response || error; });
}
