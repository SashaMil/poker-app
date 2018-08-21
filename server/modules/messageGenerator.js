function messageGenerator(action) {

  let user = (action.player) ? 'Player' : 'Computer';

  switch(action.type) {
    case 'SB':
      return `${user} on Button (5)`;
      break;

    case 'BB':
      return `${user} on BB (10)`
      break;

    case 'FOLD':
      return `${user} Folds`;
      break;

    case 'CALL':
      return `${user} Calls (${action.callAmount})`;
      break;

    case 'CHECK':
      return `${user} Checks`;
      break;

    case 'BET':
      return `${user} bets ${action.bet}`;
      break;

    case 'RAISE':
      return `${user} raises to ${action.bet}`;
      break;

    default:
      return 'Error';
  }
}



module.exports = messageGenerator;
