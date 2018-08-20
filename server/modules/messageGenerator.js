function messageGenerator(action) {
  if (action.type === 'SB') {
    return 'Player on Button (5)';
  }
  else if (action.type === 'BB') {
    return 'Player on Big Blind (10)';
  }
  else if (action.type === 'FOLD') {
    return 'Player Folds';
  }
  else if (action.type === 'CALL') {
    return `Player Calls (${action.bet})`
  }
}



module.exports = messageGenerator;
