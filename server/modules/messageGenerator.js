function messageGenerator(sb) {
  if (sb) {
    return 'Player on Button (5)';
  }
  else {
    return 'Player on Big Blind (10)';
  }
}



module.exports = messageGenerator;
