import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Typography from '@material-ui/core/Typography';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerAction extends Component {

  componentDidUpdate() {
    // console.log(this.props.playerMessage);
  }

  render() {
    return (
        <div>
          <Typography variant="subheading" style={{ color: 'white' }}>{this.props.playerMessage}</Typography>
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(PlayerAction);
