import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class ComputerHand extends Component {

  render() {
    return (
        <div>
          <Slide direction="right" in={this.props.table.state !== undefined} mountOnEnter unmountOnExit>
            <img width='120px' src={`images/Cards/purple_back.png`} />
          </Slide>
          <Slide direction="right" in={this.props.table.state !== undefined} mountOnEnter unmountOnExit>
            <img width='120px' src={`images/Cards/purple_back.png`} />
          </Slide>
          <p style={{color: 'white'}}>Computer Action</p>
        </div>
    )
  }
}

Slide.defaultProps = {
  timeout: {
    enter: 1000,
    exit: 1000,
  },
};


export default compose(connect(mapStateToProps))(ComputerHand);
