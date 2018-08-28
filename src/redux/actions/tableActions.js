export const TABLE_ACTIONS = {
  SHUFFLE: 'SHUFFLE',
  CHECK_GAME_STATUS: 'CHECK_GAME_STATUS',
  SET_GAME: 'SET_GAME',
  SET_ACTIONS: 'SET_ACTIONS',
  SET_CHIPS: 'SET_CHIPS',
  SET_CARDS: 'SET_CARDS',
  SET_PLAYER_MESSAGE: 'SET_PLAYER_MESSAGE',
  SET_COMPUTER_MESSAGE: 'SET_COMPUTER_MESSAGE',
  SET_NEW_HAND_MESSAGES: 'SET_NEW_HAND_MESSAGES',
  FOLD_PLAYER_HAND: 'FOLD_PLAYER_HAND',
  COMPUTER_DECISION: 'COMPUTER_DECISION',
  GET_STREET: 'GET_STREET',
  PLAYER_FOLD: 'PLAYER_FOLD',
  PLAYER_CALL: 'PLAYER_CALL',
  PLAYER_CHECK: 'PLAYER_CHECK',
  PLAYER_BET: 'PLAYER_BET',
  PLAYER_RAISE: 'PLAYER_RAISE',
  GET_HAND_HISTORY: 'GET_HAND_HISTORY',
  DELETE_HAND_HISTORY: 'DELETE_HAND_HISTORY',
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
});

export const playerFold = () => ({
  type: TABLE_ACTIONS.PLAYER_FOLD,
});

export const playerCall = () => ({
  type: TABLE_ACTIONS.PLAYER_CALL,
});

export const playerCheck = () => ({
  type: TABLE_ACTIONS.PLAYER_CHECK,
});

export const playerBet = (betSize) => ({
  type: TABLE_ACTIONS.PLAYER_BET,
  betSize,
});

export const playerRaise = (betSize) => ({
  type: TABLE_ACTIONS.PLAYER_BET,
  betSize,
});
