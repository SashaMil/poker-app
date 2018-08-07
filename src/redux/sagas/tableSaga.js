import { put, takeLatest } from 'redux-saga/effects';
import { TABLE_ACTIONS } from '../actions/tableActions';

import { shuffleRequest } from '../requests/tableRequests';

let playerCards = '';

function* shuffle(action) {
  try {
    console.log('hello');
    playerCards = yield shuffleRequest();
    console.log(playerCards);
  }
  catch (error) {
    console.log('WHOOPS');
  }
}

function* tableSaga() {
  // yield takeLatest(TABLE_ACTIONS.NEW_GAME, newGame);
  yield takeLatest(TABLE_ACTIONS.SHUFFLE, shuffle);

}

export default tableSaga;
