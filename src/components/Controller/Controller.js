import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {Link} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { computerDecision } from '../../redux/actions/tableActions';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';


import './Controller.css';

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Controller extends Component {

  componentDidMount = () => {
    console.log(this.props.currentAction.bet);
  }
  componentDidUpdate = () => {
    console.log(this.props.currentAction);
  }

  render() {
    return (
      <div>
        <h1>Test page</h1>
        {this.props.currentAction.bet > 0 ? (
          <div>
            <div>
              <Button onClick={this.props.fold} disabled={!this.props.currentAction.player_act_next} variant="contained" color="secondary">
                Fold
              </Button>
            </div>
            <div>
              <Button onClick={this.props.call} disabled={!this.props.currentAction.player_act_next} variant="contained" color="default">
                Call
              </Button>
            </div>
            <div>
              <Button onClick={() => this.props.raise(this.props.value)} disabled={!this.props.currentAction.player_act_next} variant="contained" color="primary">
                Raise
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Button onClick={this.props.check} disabled={!this.props.currentAction.player_act_next} variant="contained" color="secondary">
                Check
              </Button>
            </div>
            <div>
              <Button onClick={() => this.props.bet(this.props.value)} disabled={!this.props.currentAction.player_act_next} variant="contained" color="secondary">
                Bet
              </Button>
            </div>
          </div>
        )
      }
        <div>
          <Slider value={this.props.value} min={10} max={2000} step={5} onChange={(event, value) => this.props.handleChange(event,value)} />
        </div>
        <Typography variant="headline" style={{ color: 'white' }}>Current Player Bet: {this.props.value}</Typography>

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
