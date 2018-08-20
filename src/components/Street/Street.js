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
    if (this.props.currentAction.next_street) {
      this.props.dispatch(getStreet());
    }
  }

  componentDidUpdate() {
    if (this.props.currentAction.next_street) {
      this.props.dispatch(getStreet())
    }
  }

  render() {
    return (
      <div>
        {this.props.street ? (
          <div>
            <Slide direction="right" in={this.props.street[0] !== undefined} mountOnEnter unmountOnExit>
              <img width='120px' src={`images/Cards/${this.props.street[0]}.png`} />
            </Slide>
            <Slide direction="right" in={this.props.street[2] !== undefined} mountOnEnter unmountOnExit>
              <img width='120px' src={`images/Cards/${this.props.street[1]}.png`} />
            </Slide>
            <Slide direction="right" in={this.props.street[2] !== undefined} mountOnEnter unmountOnExit>
              <img width='120px' src={`images/Cards/${this.props.street[2]}.png`} />
            </Slide>
            <Slide direction="right" in={this.props.street[4] !== undefined} mountOnEnter unmountOnExit>
              <img width='120px' src={`images/Cards/${this.props.street[3]}.png`} />
            </Slide>
            <Slide direction="right" in={this.props.street[5] !== undefined} mountOnEnter unmountOnExit>
              <img width='120px' src={`images/Cards/${this.props.street[4]}.png`} />
            </Slide>
          </div>
        ) : (
          null
        )
      }

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
