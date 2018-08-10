export const TABLE_ACTIONS = {
  SHUFFLE: 'SHUFFLE',
  CHECK_GAME_STATUS: 'CHECK_GAME_STATUS',
};

export const shuffle = () => ({
  type: TABLE_ACTIONS.SHUFFLE,
});

export const checkGameStatus = () => ({
  type: TABLE_ACTIONS.CHECK_GAME_STATUS
})
