import React, { Component } from 'react';
import './Log.css';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';


const mapStateToProps = state => ({
  user: state.user,
});

class Log extends Component {

  render() {
    return (
      <div style={{maxHeight: 200, overflow: 'auto'}}>
        <h3>Log Here</h3>
        <List>
         Player Folds
        </List>
      </div>
    )
  }
}

export default Log;
