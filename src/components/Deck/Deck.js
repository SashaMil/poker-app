import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import './Deck.css';

const mapStateToProps = state => ({
  user: state.user,
});

class Deck extends Component {

  render() {
    return (
      <div>
        <img width='80px' src={`images/Cards/purple_back.png`} />
        <img className="deck2" width='80px' src={`images/Cards/purple_back.png`} />
        <img className="deck3" width='80px' src={`images/Cards/purple_back.png`} />
        <img className="deck4" width='80px' src={`images/Cards/purple_back.png`} />
        <img className="deck5" width='80px' src={`images/Cards/purple_back.png`} />
        <img className="deck6" width='80px' src={`images/Cards/purple_back.png`} />
      </div>
    )
  }
}

export default Deck;
