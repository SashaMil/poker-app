import React, { Component } from 'react';

import Log from '../Log/Log';

const mapStateToProps = state => ({
  user: state.user,
});

class Table extends Component {

  state = {

  }

  render() {
    return (
      <div>
        <h1>Heres the table</h1>
        <Log />
      </div>
    )
  }
}

export default Table;
