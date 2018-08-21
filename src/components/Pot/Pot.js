import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Deck from '../Deck/Deck';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Pot extends Component {

  render() {
    return (
        <div>
          <h2>{this.props.pot}</h2>
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Pot);
