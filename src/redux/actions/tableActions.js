export const TABLE_ACTIONS = {
  SHUFFLE: 'SHUFFLE',
  CHECK_GAME_STATUS: 'CHECK_GAME_STATUS',
  SET_GAME: 'SET_GAME',
  COMPUTER_DECISION: 'COMPUTER_DECISION',
  GET_STREET: 'GET_STREET',
};

export const shuffle = () => ({
  type: TABLE_ACTIONS.SHUFFLE,
});

export const checkGameStatus = () => ({
  type: TABLE_ACTIONS.CHECK_GAME_STATUS,
});

export const computerDecision = () => ({
  type: TABLE_ACTIONS.COMPUTER_DECISION,
});

export const getStreet = () => ({
  type: TABLE_ACTIONS.GET_STREET,
})
