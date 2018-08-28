import { combineReducers } from 'redux';
import { TABLE_ACTIONS } from '../actions/tableActions';

let initialActionsState = {lastAction: {}, playerSB: false,}
let initialCardsState = {playerCard1: '', playerCard2: '', dealPlayerHand: false, dealComputerHand: false, showComputerHand: true};
let initialChipsState = {playerChips: 0, computerChips: 0, pot: 0};

const actions = (state = initialActionsState, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SET_GAME:
      return {
        ... state,
        lastAction: action.payload.actions.lastAction,
        playerButton: action.payload.actions.playerButton,
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
        street: action.payload.cards.street,
      }
    case TABLE_ACTIONS.FOLD_PLAYER_HAND:
      return {
        ... state,
        dealPlayerHand: false,
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
    default:
      return state;
  }
}

export default combineReducers({
  chips,
  cards,
  actions,
});
