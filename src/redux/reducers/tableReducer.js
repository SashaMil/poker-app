import { combineReducers } from 'redux';
import { TABLE_ACTIONS } from '../actions/tableActions';

let initialActionsState = {lastAction: {}, playerSB: false,}
let initialCardsState = {playerCard1: '', playerCard2: '', dealPlayerHand: false, dealComputerHand: false, showComputerHand: true, flop: [], turn: '', river: ''};
let initialChipsState = {playerChips: 0, computerChips: 0, pot: 0};

const actions = (state = initialActionsState, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SET_GAME:
      return {
        ... state,
        lastAction: action.payload.actions.lastAction,
        playerButton: action.payload.actions.playerButton,
      }
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
    case TABLE_ACTIONS.SET_GAME:
      return {
        ... state,
        playerCard1: action.payload.cards.playerCards.card1,
        playerCard2: action.payload.cards.playerCards.card2,
        dealPlayerHand: true,
        dealComputerHand: true,
        flop: action.payload.cards.flop ? action.payload.cards.flop : state.flop,
        turn: action.payload.cards.turn ? action.payload.cards.turn : state.turn,
        river: action.payload.cards.river ? action.payload.cards.river : state.river,
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
    default:
      return state;
  }
}

const chips = (state = initialChipsState, action) => {
  switch(action.type) {
    case TABLE_ACTIONS.SET_GAME:
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
    default:
      return state;
  }
}

export default combineReducers({
  chips,
  cards,
  actions,
});
