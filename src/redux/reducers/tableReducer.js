import { combineReducers } from 'redux';
import { TABLE_ACTIONS } from '../actions/tableActions';

let initialActionsState = {lastAction: {}, playerSB: false,}
let initialCardsState = {playerCard1: '', playerCard2: '', dealPlayerHand: false, foldPlayerHand: false, dealComputerHand: false, foldComputerHand: false, showComputerHand: true};
let initialChipsState = {playerChips: 0, computerChips: 0, pot: 0};

const actions = (state = initialActionsState, action) => {
  switch (action.type) {
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
    case TABLE_ACTIONS.SET_CARDS:
      return {
        ... state,
        playerCard1: action.payload.playerCards.card1,
        playerCard2: action.payload.playerCards.card2,
        dealPlayerHand: true,
        dealComputerHand: true,
        street: action.payload.street,
      }
    default:
      return state;
  }
}

const chips = (state = initialChipsState, action) => {
  switch(action.type) {
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
