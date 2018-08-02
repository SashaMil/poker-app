import React, { Component } from 'react';

import Log from '../Log/Log';

import './Table.css';
import Paper from '@material-ui/core/Paper';

const mapStateToProps = state => ({
  user: state.user,
});

class Table extends Component {

  state = {

  }

  render() {
    return (
      <div className="wrapper">
        <Log id="paper" />
      </div>
    )
  }
}

export default Table;
