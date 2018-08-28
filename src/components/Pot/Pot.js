import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import ComputerBet from '../ComputerBet/ComputerBet';
import PlayerBet from '../PlayerBet/PlayerBet';


import Typography from '@material-ui/core/Typography';
import './Pot.css';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Pot extends Component {

  render() {
    return (
        <div>
          <ComputerBet
            lastAction={this.props.lastAction}
          />
          <Typography variant="headline" style={{ color: 'white' }}>Pot: {this.props.pot}</Typography>
          <PlayerBet
            betAmount={this.props.betAmount}
          />
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Pot);
