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
}



module.exports = messageGenerator;
