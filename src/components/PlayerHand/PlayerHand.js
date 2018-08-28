import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class PlayerHand extends Component {

  render() {
    return (
        <div>
          <Slide direction="right" in={this.props.dealPlayerHand} mountOnEnter>
            <img width='80px' src={`images/Cards/${this.props.card1}.png`} />
          </Slide>
          <Slide direction="right" in={this.props.dealPlayerHand} mountOnEnter>
            <img width='80px' src={`images/Cards/${this.props.card2}.png`} />
          </Slide>
        </div>
    )
  }
}

Slide.defaultProps = {
  timeout: {
    enter: 4000,
  },
};


export default compose(connect(mapStateToProps))(PlayerHand);
