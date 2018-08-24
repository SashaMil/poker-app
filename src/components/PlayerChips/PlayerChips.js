import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';

import './PlayerChips.css';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerChips extends Component {

  render() {
    return (
      <div>
        <h3 className="playerChipsH3">{'Player Chips ' + this.props.chips}</h3>
      </div>
    )
  }
}


export default compose(connect(mapStateToProps))(PlayerChips);
