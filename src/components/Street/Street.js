import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { getStreet } from '../../redux/actions/tableActions';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Street extends Component {

  componentDidMount() {
    if (!this.props.playerAction) {
      this.props.dispatch(getStreet());
    }
  }

  componentDidUpdate() {
    if (!this.props.playerAction) {
      console.log('dragon');
      this.props.dispatch(getStreet())
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


export default compose(connect(mapStateToProps))(Street);
