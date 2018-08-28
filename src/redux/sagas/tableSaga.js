import { put, takeLatest } from 'redux-saga/effects';
import { TABLE_ACTIONS } from '../actions/tableActions';

import { shuffleRequest } from '../requests/tableRequests';
import { checkGameStatusRequest } from '../requests/tableRequests';
import { getGameInfoRequest } from '../requests/tableRequests';
import { computerDecisionRequest } from '../requests/tableRequests';
import { getStreetRequest } from '../requests/tableRequests';
import { playerFoldRequest } from '../requests/tableRequests';
import { playerCallRequest } from '../requests/tableRequests';
import { playerCheckRequest } from '../requests/tableRequests';
import { playerBetRequest } from '../requests/tableRequests';
import { getHandHistoryRequest } from '../requests/tableRequests';
import { deleteHandHistoryRequest } from '../requests/tableRequests';



let playerCards = '';
let gameInfo = '';
let street = '';
let handHistory = '';

function* checkGameStatus() {
  try {
    yield checkGameStatusRequest();
    yield shuffleRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    if (!gameInfo.actions.player_act_next) {
      yield computerDecision();
    }
  }
  catch (error) {
    console.log('WHOOPS');
  }
}

function* computerDecision() {
  try {
    yield computerDecisionRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(`Computer ${gameInfo.actions.type}`);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (gameInfo.actions.type === 'FOLD') {
      yield shuffleRequest();
      gameInfo = yield getGameInfoRequest();
      yield put({
        type: TABLE_ACTIONS.SET_GAME,
        payload: gameInfo,
      })
      if (!gameInfo.player_sb) {
        yield computerDecision();
      }
    }
    if (gameInfo.actions.next_street) {
      yield getStreet();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* playerFold() {
  try {
    yield put({
      type: TABLE_ACTIONS.FOLD_PLAYER_HAND,
    })
    yield new Promise(resolve => setTimeout(resolve, 2000));
    yield playerFoldRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    yield shuffleRequest();
    gameInfo = yield getGameInfoRequest();
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (!gameInfo.player_sb) {
      yield computerDecision();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* playerCall() {
  try {
    yield playerCallRequest();
    gameInfo = yield getGameInfoRequest();
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (gameInfo.actions.next_street) {
      yield getStreet();
    }
    else {
      yield computerDecision();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* playerCheck() {
  try {
    yield playerCheckRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (gameInfo.actions.next_street) {
      yield getStreet();
    }
    else {
      yield computerDecision();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* playerBet(action) {
  try {
    console.log(action);
    yield playerBetRequest(action.betSize);
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    yield computerDecision();
  }
  catch(error) {
    console.log(error);
  }
}

function* playerRaise(action) {
  try {
    console.log(action);
    yield playerBetRequest(action.betSize);
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    yield computerDecision();
  }
  catch(error) {
    console.log(error);
  }
}

function* getStreet() {
  try {
    gameInfo = yield getStreetRequest();
    console.log('Getting Street');
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (gameInfo.current_hand_completed) {
      yield checkGameStatus();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* tableSaga() {
  yield takeLatest(TABLE_ACTIONS.CHECK_GAME_STATUS, checkGameStatus);
  yield takeLatest(TABLE_ACTIONS.COMPUTER_DECISION, computerDecision);
  yield takeLatest(TABLE_ACTIONS.GET_STREET, getStreet);
  yield takeLatest(TABLE_ACTIONS.PLAYER_FOLD, playerFold);
  yield takeLatest(TABLE_ACTIONS.PLAYER_CALL, playerCall);
  yield takeLatest(TABLE_ACTIONS.PLAYER_CHECK, playerCheck);
  yield takeLatest(TABLE_ACTIONS.PLAYER_BET, playerBet);
  yield takeLatest(TABLE_ACTIONS.PLAYER_RAISE, playerRaise);

}

export default tableSaga;
