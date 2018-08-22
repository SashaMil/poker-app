import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class ComputerChips extends Component {

  render() {
    return (
      <div>
        {'Computer Chips ' + this.props.chips}
      </div>
    )
  }
}


export default compose(connect(mapStateToProps))(ComputerChips);
