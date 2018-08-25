import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Typography from '@material-ui/core/Typography';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class ComputerBet extends Component {

  render() {
    return (
        <div>
          <Typography variant="headline" style={{ color: 'white' }}>Computer Action Message</Typography>
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(ComputerBet);
