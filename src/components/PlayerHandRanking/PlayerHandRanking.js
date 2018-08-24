import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Deck from '../Deck/Deck';

import './PlayerHandRanking.css';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerHandRanking extends Component {

  render() {
    return (
        <div>
          {this.props.bestFiveCards ? (
            <h2 className="playerHandRankingH2">{this.props.bestFiveCards}</h2>
          ) : (
            null
          )
        }
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(PlayerHandRanking);
