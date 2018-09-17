import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Slide from '@material-ui/core/Slide';


import Typography from '@material-ui/core/Typography';
import './PlayerBet.css';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerBet extends Component {

  render() {
    return (
        <div>
          <Slide direction="up" in={this.props.lastAction.player && (this.props.lastAction.betAmount > 0 || this.props.lastAction.callAmount > 0)} mountOnEnter timeout={1000}>
            <img src="/images/Table/bet.png" />
          </Slide>
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(PlayerBet);
