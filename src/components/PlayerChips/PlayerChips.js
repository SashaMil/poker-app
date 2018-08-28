import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';

import Typography from '@material-ui/core/Typography';

import './PlayerChips.css';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerChips extends Component {

  render() {
    return (
      <div className="">
        <Typography variant="headline" style={{ color: 'white' }}>{this.props.chips}</Typography>
        <img width="80px" src="/images/Table/chipStack.png" />
      </div>
    )
  }
}


export default compose(connect(mapStateToProps))(PlayerChips);
