import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Deck from '../Deck/Deck';

import Typography from '@material-ui/core/Typography';
import './Pot.css';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Pot extends Component {

  render() {
    return (
        <div>
          <Typography variant="headline" style={{ color: 'white' }}>Pot: {this.props.pot}</Typography>
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Pot);
