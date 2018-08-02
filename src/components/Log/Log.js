import React, { Component } from 'react';
import './Log.css';

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
        <div id="logger"></div>
      </div>
    )
  }
}

export default Log;
