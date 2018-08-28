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
          <Typography variant="headline" style={{ color: 'white' }}>{this.props.pot}</Typography>
          <img src="images/Table/pot.png" />
          <PlayerBet
            lastAction={this.props.lastAction}
          />
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Pot);
