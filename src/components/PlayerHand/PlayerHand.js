import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

const PlayerHand = ({ table }) => {

  return (
    <div>
      <Slide direction="right" in={table.state.playerCard1} mountOnEnter unmountOnExit>
        <img width='120px' src={`images/Cards/${table.state.playerCard1}.png`} />
      </Slide>
      <Slide direction="right" in={table.state.playerCard2} mountOnEnter unmountOnExit>
        <img width='120px' src={`images/Cards/${table.state.playerCard2}.png`} />
      </Slide>
      <p style={{color: 'white'}}>{table.table.state.computer_action_type}</p>
    </div>
  )
}

Slide.defaultProps = {
  timeout: {
    enter: 1000,
    exit: 1000,
  },
};


export default compose(connect(mapStateToProps))(PlayerHand);
