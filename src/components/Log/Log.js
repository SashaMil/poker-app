import React, { Component } from 'react';
import './Log.css';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const mapStateToProps = state => ({
  user: state.user,
});

class Log extends Component {

  state = {

  }

  render() {
    return (
      <div>
        <h2>Heres the Log</h2>
        <Paper elevation={5}>
          <p id="logText">PokerBot Raises 3 X</p>
        </Paper>
      </div>
    )
  }
}

export default Log;
