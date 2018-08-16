import { put, takeLatest } from 'redux-saga/effects';
import { TABLE_ACTIONS } from '../actions/tableActions';

import { shuffleRequest } from '../requests/tableRequests';
import { checkGameStatusRequest } from '../requests/tableRequests';
import { getGameInfoRequest } from '../requests/tableRequests';
import { computerDecisionRequest } from '../requests/tableRequests';

let playerCards = '';
let gameInfo = '';

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

function* computerDecision() {
  try {
    console.log('sheep');
    yield computerDecisionRequest();
  }
  catch (error) {
    console.log(error);
  }
}

function* tableSaga() {
  // yield takeLatest(TABLE_ACTIONS.NEW_GAME, newGame);
  // yield takeLatest(TABLE_ACTIONS.SHUFFLE, shuffle);
  yield takeLatest(TABLE_ACTIONS.CHECK_GAME_STATUS, checkGameStatus);
  yield takeLatest(TABLE_ACTIONS.COMPUTER_DECISION, computerDecision);

}

export default tableSaga;
