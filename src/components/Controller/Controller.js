import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { computerDecision } from '../../redux/actions/tableActions';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Controller extends Component {

  componentDidMount() {
    console.log(this.props.playerSb);
    console.log(this.props.playerAction);
    if (!this.props.playerAction) {
      console.log('penguin');
      this.props.dispatch(computerDecision());
    }
  }

  componentDidUpdate() {
    if (!this.props.playerAction) {
      console.log('dragon');
      this.props.dispatch(computerDecision())
    }
  }

  render() {
    return (
      <div>
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


export default compose(connect(mapStateToProps))(Controller);
