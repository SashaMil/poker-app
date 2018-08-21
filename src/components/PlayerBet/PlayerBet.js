import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Log from '../Log/Log';
import Deck from '../Deck/Deck';


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
            <h3>{this.props.bet}</h3>
          </div>
        ) : (
          null
        )}
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(PlayerBet);
