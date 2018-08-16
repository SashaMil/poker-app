import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { computerDecision } from '../../redux/actions/tableActions';
import Slider from '@material-ui/lab/Slider';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Controller extends Component {

  componentDidMount() {
    if (!this.props.currentAction.player_act_next) {
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
        {this.props.currentAction.bet > 0 ? (
          <div>
            <div>
              <Button onClick={this.fold} variant="contained" color="secondary">
                Fold
              </Button>
            </div>
            <div>
              <Button onClick={this.call} variant="contained" color="default">
                Call
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={this.bet}>
                Raise
              </Button>
            </div>
          </div>
        ) : (
          null
        )
      }
        <div>
          <Slider value={this.props.value} min={10} max={1500} step={1} onChange={(event, value) => this.props.handleChange(event,value)} />
        </div>

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
