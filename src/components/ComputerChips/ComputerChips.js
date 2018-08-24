import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';

import './ComputerChips.css';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class ComputerChips extends Component {

  render() {
    return (
      <div>
        <h3 className="computerChipsH3">{'Computer Chips ' + this.props.chips}</h3>
      </div>
    )
  }
}


export default compose(connect(mapStateToProps))(ComputerChips);
