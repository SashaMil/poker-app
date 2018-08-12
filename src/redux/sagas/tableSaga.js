import { put, takeLatest } from 'redux-saga/effects';
import { TABLE_ACTIONS } from '../actions/tableActions';

import { shuffleRequest } from '../requests/tableRequests';
import { checkGameStatusRequest } from '../requests/tableRequests';
import { getGameInfoRequest } from '../requests/tableRequests';


let playerCards = '';
let gameInfo = '';

// function* shuffle(action) {
//   try {
//     playerCards = yield shuffleRequest();
//   }
//   catch (error) {
//     console.log('WHOOPS');
//   }
// }

function* checkGameStatus() {
  try {
    yield checkGameStatusRequest();
    console.log('dinosaur');
    yield shuffleRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
  }
  catch (error) {
    console.log('WHOOPS');
  }
}

function* tableSaga() {
  // yield takeLatest(TABLE_ACTIONS.NEW_GAME, newGame);
  // yield takeLatest(TABLE_ACTIONS.SHUFFLE, shuffle);
  yield takeLatest(TABLE_ACTIONS.CHECK_GAME_STATUS, checkGameStatus)

}

export default tableSaga;
