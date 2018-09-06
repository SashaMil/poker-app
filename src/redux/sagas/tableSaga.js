import { put, takeLatest } from 'redux-saga/effects';
import { TABLE_ACTIONS } from '../actions/tableActions';

import { shuffleRequest } from '../requests/tableRequests';
import { checkGameStatusRequest } from '../requests/tableRequests';
import { getGameInfoRequest } from '../requests/tableRequests';
import { computerActionRequest } from '../requests/tableRequests';
import { getStreetRequest } from '../requests/tableRequests';
import { playerFoldRequest } from '../requests/tableRequests';
import { playerCallRequest } from '../requests/tableRequests';
import { playerCheckRequest } from '../requests/tableRequests';
import { playerBetRequest } from '../requests/tableRequests';

let playerCards = '';
let gameInfo = '';
let street = '';
let handHistory = '';
let newGame = null;
let amountToCall = 0;

function* checkGameStatus() {
  try {
    // Checking to see if this is a new game
    newGame = yield checkGameStatusRequest();
    console.log(newGame);
    // If it is, we are going to pass param to shuffle request so starting chips are hardcoded
    if (newGame) {
      yield shuffleRequest('newGame');
    }
    // Whether it's a new game or not, we will be making a get request all the same to retrieve hand info,
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    // Setting New hand messages here, (this is for when a shuffle occurs so we get text saying
    // who is on the button and who is on the BB)
    // Setting all other info

    // New Hand action will set the new cards and messages
    yield put({
      type: TABLE_ACTIONS.NEW_HAND,
      payload: gameInfo,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })

    // yield put({
    //   type: TABLE_ACTIONS.SET_GAME,
    //   payload: gameInfo,
    // })
    // If the player is not on the button, the computer will act first
    // if (!gameInfo.actions.playerButton) {
    //   yield computerAction();
    // }
  }
  catch (error) {
    console.log('WHOOPS');
  }
}

function* computerAction() {
  try {
    yield new Promise(resolve => setTimeout(resolve, 1000));
    yield computerActionRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    console.log(`Computer ${gameInfo.action.currentAction.type}`);
    yield put({
      type: TABLE_ACTIONS.SET_COMPUTER_MESSAGE,
      payload: gameInfo.action.currentAction.message,
    })
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    if (gameInfo.action.currentAction.type === 'FOLD') {
      yield shuffleRequest();
      gameInfo = yield getGameInfoRequest();
      yield put({
        type: TABLE_ACTIONS.SET_GAME,
        payload: gameInfo,
      })
      if (!gameInfo.player_sb) {
        yield computerAction();
      }
    }
    if (gameInfo.actions.lastAction.next_street) {
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
    yield playerFoldRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.message.message,
    })
    yield put({
      type: TABLE_ACTIONS.SET_CHIPS,
      payload: gameInfo.chips,
    })
    yield put({
      type: TABLE_ACTIONS.SET_ACTIONS,
      payload: gameInfo.actions,
    })
    yield new Promise(resolve => setTimeout(resolve, 2000));
    yield shuffleRequest();
    gameInfo = yield getGameInfoRequest();
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (!gameInfo.player_sb) {
      yield computerAction();
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
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.message.message,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (gameInfo.actions.lastAction.next_street) {
      yield getStreet();
    }
    else {
      yield computerAction();
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
    yield put({
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.message.message,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    if (gameInfo.actions.lastAction.next_street) {
      yield getStreet();
    }
    else {
      yield computerAction();
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
    yield put({
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.message.message,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    yield computerAction();
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
    yield put({
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.message.message,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    yield computerAction();
  }
  catch(error) {
    console.log(error);
  }
}

function* getStreet() {
  try {
    street = yield getStreetRequest();
    console.log('street', street);
    yield put({
      type: TABLE_ACTIONS.SET_STREET,
      payload: street.cards,
    })
    yield put ({
      type: TABLE_ACTIONS.SET_PLAYER_HAND_VALUE,
      payload: street.message,
    })
    yield new Promise(resolve => setTimeout(resolve, 2000));
    if (street.currentHandCompleted) {
      yield put({
        type: TABLE_ACTIONS.NEW_HAND,
      })
      yield checkGameStatus();
    }
    if (gameInfo.actions.playerButton) {
      yield computerAction();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* tableSaga() {
  yield takeLatest(TABLE_ACTIONS.CHECK_GAME_STATUS, checkGameStatus);
  yield takeLatest(TABLE_ACTIONS.COMPUTER_DECISION, computerAction);
  yield takeLatest(TABLE_ACTIONS.GET_STREET, getStreet);
  yield takeLatest(TABLE_ACTIONS.PLAYER_FOLD, playerFold);
  yield takeLatest(TABLE_ACTIONS.PLAYER_CALL, playerCall);
  yield takeLatest(TABLE_ACTIONS.PLAYER_CHECK, playerCheck);
  yield takeLatest(TABLE_ACTIONS.PLAYER_BET, playerBet);
  yield takeLatest(TABLE_ACTIONS.PLAYER_RAISE, playerRaise);

}

export default tableSaga;
