import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Controller extends Component {

  componentDidMount() {
    console.log(this.props.playerSb);
    console.log(this.props.playerAction);
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
