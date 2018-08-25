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
      <div>
        <Typography variant="headline" style={{ color: 'white' }}>Player Chips: {this.props.chips}</Typography>
      </div>
    )
  }
}


export default compose(connect(mapStateToProps))(PlayerChips);
