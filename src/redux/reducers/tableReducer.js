import { combineReducers } from 'redux';
import { TABLE_ACTIONS } from '../actions/tableActions';

let initialActionsState = {currentAction: {}, playerButton: null}
let initialCardsState = {playerCard1: '', playerCard2: '', computerCard1: '', computerCard2: '', dealPlayerHand: false, dealComputerHand: false, showComputerHand: true, flop: [], turn: '', river: ''};
let initialChipsState = {playerChips: 0, computerChips: 0, pot: 0};
let initialMessagesState = {playerMessage: '', computerMessage: '', playerHandValue: ''};

const actions = (state = initialActionsState, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SET_GAME:
      return {
        ... state,
        currentAction: action.payload.action.currentAction,
        playerButton: action.payload.action.playerButton,
      }
    // What am I using this for??
    case TABLE_ACTIONS.SET_ACTIONS:
     return {
       ... state,
       lastAction: action.payload.lastAction,
       playerButton: action.payload.playerButton,
     }
    default:
      return state;
  }
};

const cards = (state = initialCardsState, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.NEW_HAND:
      return {
        ... state,
        playerCard1: action.payload.cards.playerCards.card1,
        playerCard2: action.payload.cards.playerCards.card2,
        dealPlayerHand: true,
        dealComputerHand: true,
      }
    case TABLE_ACTIONS.SET_STREET:
      return {
        ... state,
        flop: action.payload.flop ? action.payload.flop : state.flop,
        turn: action.payload.turn ? action.payload.turn : state.turn,
        river: action.payload.river ? action.payload.river : state.river,
      }
    case TABLE_ACTIONS.FOLD_PLAYER_HAND:
      return {
        ... state,
        dealPlayerHand: false,
        dealComputerHand: false,
        playerFoldFirst: true,
        playerCard1: 'purple_back',
        playerCard2: 'purple_back',
      }
    case TABLE_ACTIONS.FOLD:
      state = initialCardsState;

    default:
      return state;
  }
}

const chips = (state = initialChipsState, action) => {
  switch(action.type) {
    case TABLE_ACTIONS.NEW_HAND:
     return {
       ... state,
       playerChips: action.payload.chips.playerChips,
       computerChips: action.payload.chips.computerChips,
       pot: action.payload.chips.pot,
     }
    case TABLE_ACTIONS.SET_CHIPS:
      return {
        ... state,
        playerChips: action.payload.playerChips,
        computerChips: action.payload.computerChips,
        pot: action.payload.pot,
      }
    case TABLE_ACTIONS.FOLD:
      return {
        ... state,
        pot: 0,
      }
    default:
      return state;
  }
}

const messages = (state = initialMessagesState, action) => {
  switch(action.type) {
    case TABLE_ACTIONS.SET_PLAYER_MESSAGE:
      return {
        ... state,
        playerMessage: action.payload,
        computerMessage: '',
      }
    case TABLE_ACTIONS.SET_COMPUTER_MESSAGE:
      return {
        ... state,
        computerMessage: action.payload,
        playerMessage: '',
      }
    case TABLE_ACTIONS.SET_GAME:
     return {
       ... state,
       computerMessage: action.payload.action.currentAction.message.computerMessage,
       playerMessage: action.payload.action.currentAction.message.playerMessage,
     }
    case TABLE_ACTIONS.SET_PLAYER_HAND_VALUE:
     return {
       ... state,
       playerHandValue: action.payload,
     }
    case TABLE_ACTIONS.FOLD:
      state = initialMessagesState;
    default:
      return state;
  }
}

export default combineReducers({
  chips,
  cards,
  actions,
  messages,
});
