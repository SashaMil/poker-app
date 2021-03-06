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
      yield put({
        type: TABLE_ACTIONS.FOLD,
        payload: gameInfo,
      });
      yield shuffleRequest('newGame');
      gameInfo = yield getGameInfoRequest();
      // New Hand action will set the new cards and messages
      yield put({
        type: TABLE_ACTIONS.NEW_HAND,
        payload: gameInfo,
      });
      yield put({
        type: TABLE_ACTIONS.SET_GAME,
        payload: gameInfo,
      });
    }
    else {
      yield put({
        type: TABLE_ACTIONS.FOLD,
        payload: gameInfo,
      });
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield shuffleRequest();
      gameInfo = yield getGameInfoRequest();
      console.log('look here', gameInfo);
      yield put({
        type: TABLE_ACTIONS.NEW_HAND,
        payload: gameInfo,
      });
      if (gameInfo.action.currentAction.street !== 'preflop') {
        yield put({
          type: TABLE_ACTIONS.SET_STREET,
          payload: gameInfo.cards.street
        });
      }
      yield put({
        type: TABLE_ACTIONS.SET_GAME,
        payload: gameInfo,
      });
      // Since I don't want to get new cards for every action since it will remain the same, i will call this special
      // action to retrieve hands when page refreshes
      yield put({
        type: TABLE_ACTIONS.SET_CHIPS,
        payload: gameInfo.chips,
      })
    }
    console.log(gameInfo);
    console.log(!gameInfo.action.playerButton);
    // If the player is not on the button, call computer action saga
    if (!gameInfo.action.playerButton) {
      console.log('omg why')
      yield computerAction();
    }
  }
  catch (error) {
    console.log('WHOOPS');
  }
}

function* computerAction() {
  try {
    console.log('in computer action');
    yield computerActionRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    console.log(`Computer ${gameInfo.action.currentAction.type}`);
    yield put({
      type: TABLE_ACTIONS.SET_COMPUTER_MESSAGE,
      payload: gameInfo.action.currentAction.message.computerMessage,
    })
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    yield put({
      type: TABLE_ACTIONS.SET_CHIPS,
      payload: gameInfo.chips,
    })
    yield new Promise(resolve => setTimeout(resolve, 2000));

    if (gameInfo.action.currentAction.type === 'FOLD') {
      yield put({
        type: TABLE_ACTIONS.FOLD,
      });
      yield new Promise(resolve => setTimeout(resolve, 2000));
      yield shuffleRequest();
      gameInfo = yield getGameInfoRequest();
      console.log(gameInfo);
      yield put({
        type: TABLE_ACTIONS.NEW_HAND,
        payload: gameInfo,
      })
      yield put({
        type: TABLE_ACTIONS.SET_GAME,
        payload: gameInfo,
      });
      if (!gameInfo.action.playerButton) {
        yield computerAction();
      }
    }
    if (gameInfo.action.currentAction.next_street) {
      yield getStreet();
    }
  }
  catch (error) {
    console.log(error);
  }
}

function* playerFold() {
  try {
    yield playerFoldRequest();
    yield put({
      type: TABLE_ACTIONS.FOLD,
    })
    yield new Promise(resolve => setTimeout(resolve, 1000));
    yield shuffleRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.NEW_HAND,
      payload: gameInfo,
    })
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    if (!gameInfo.action.playerButton) {
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
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.action.currentAction.message.playerMessage,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    yield put({
      type: TABLE_ACTIONS.SET_CHIPS,
      payload: gameInfo.chips,
    })
    yield new Promise(resolve => setTimeout(resolve, 1000));
    if (gameInfo.action.currentAction.next_street) {
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
    console.log(gameInfo);
    yield put({
      type: TABLE_ACTIONS.SET_PLAYER_MESSAGE,
      payload: gameInfo.action.currentAction.message.playerMessage,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    console.log(gameInfo.action.currentAction.next_street);
    yield new Promise(resolve => setTimeout(resolve, 1000));
    if (gameInfo.action.currentAction.next_street) {
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
      payload: gameInfo.action.currentAction.message.playerMessage,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    });
    yield put({
      type: TABLE_ACTIONS.SET_CHIPS,
      payload: gameInfo.chips,
    })
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
      payload: gameInfo.action.currentAction.message.playerMessage,
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
    console.log('we made it');
    yield getStreetRequest();
    gameInfo = yield getGameInfoRequest();
    console.log(gameInfo);
    // Resets messages when new street appears (so it doesn't say computer checks left over from previous street)
    yield put({
      type: TABLE_ACTIONS.NEW_STREET,
    })
    yield put({
      type: TABLE_ACTIONS.SET_STREET,
      payload: gameInfo.cards.street,
    });
    yield put ({
      type: TABLE_ACTIONS.SET_PLAYER_HAND_VALUE,
      payload: gameInfo.action.currentAction.player_best_five_cards_name,
    });
    yield put({
      type: TABLE_ACTIONS.SET_GAME,
      payload: gameInfo,
    })
    yield new Promise(resolve => setTimeout(resolve, 2000));
    console.log('hellloooooo');
    console.log(gameInfo.currentHandCompleted);
    if (gameInfo.currentHandCompleted) {
      console.log('did it do it??')
      yield checkGameStatus();
    }
    else if (gameInfo.action.currentAction.player_chips === 0 || gameInfo.action.currentAction.computer_chips === 0) {
      yield getStreet();
    }
    else {
      if (gameInfo.action.playerButton) {
        console.log('doggy');
        yield computerAction();
      }
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
