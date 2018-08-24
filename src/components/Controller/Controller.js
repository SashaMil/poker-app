import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { computerDecision } from '../../redux/actions/tableActions';
import Slider from '@material-ui/lab/Slider';

import './Controller.css';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Controller extends Component {

  render() {
    return (
      <div>
        {this.props.currentAction.bet > 0 ? (
          <div>
            <div>
              <Button onClick={this.props.fold} variant="contained" color="secondary">
                Fold
              </Button>
            </div>
            <div>
              <Button onClick={this.props.call} variant="contained" color="default">
                Call
              </Button>
            </div>
            <div>
              <Button onClick={() => this.props.raise(this.props.value)} variant="contained" color="primary">
                Raise
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Button onClick={this.props.check} variant="contained" color="secondary">
                Check
              </Button>
            </div>
            <div>
              <Button onClick={() => this.props.bet(this.props.value)} variant="contained" color="secondary">
                Bet
              </Button>
            </div>
          </div>
        )
      }
        <div>
          <Slider value={this.props.value} min={10} max={2000} step={5} onChange={(event, value) => this.props.handleChange(event,value)} />
        </div>
        <h3 className="controllerH3">{'Current Player Bet ' + this.props.value}</h3>

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
