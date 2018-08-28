import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Deck from '../Deck/Deck';

import Typography from '@material-ui/core/Typography';
import './PlayerBet.css';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerBet extends Component {

  render() {
    return (
        <div>
        {this.props.bet.player ? (
          <div>
            <Typography variant="headline" style={{ color: 'white' }}>Current Player Bet: {this.props.bet}</Typography>
          </div>
        ) : (
          null
        )}
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(PlayerBet);
