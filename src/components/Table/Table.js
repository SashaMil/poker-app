import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Log from '../Log/Log';
import Deck from '../Deck/Deck';
import PlayerHand from '../PlayerHand/PlayerHand';
import ComputerHand from '../ComputerHand/ComputerHand';
import Controller from '../Controller/Controller';
import Pot from '../Pot/Pot';
import Street from '../Street/Street';

import './Table.css';
import Paper from '@material-ui/core/Paper';

import { shuffle } from '../../redux/actions/tableActions';
import { checkGameStatus } from '../../redux/actions/tableActions';
import { playerFold } from '../../redux/actions/tableActions';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});


class Table extends Component {

  state = {
    value: 0,
    currentAction: null,
    playerAction: null,
    playerHasActed: null,
    playerSb: null,
    playerCards: null,
    pot: null,
    street: null,
  };

  handleChange = (name) => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  fold = () => {
    this.props.dispatch(playerFold());
  }

  call = () => {

  }

  raise = () => {

  }

  componentDidUpdate(prevProps) {
    if (this.props.table.state !== prevProps.table.state) {
      this.setState({
        currentAction: this.props.table.state.actions,
        playerAction: this.props.table.state.actions.player_act_next,
        playerHasActed: this.props.table.state.actions.player_has_acted,
        playerSb: this.props.table.state.player_sb,
        playerCards: this.props.table.state.playerCards,
        pot: this.props.table.state.pot,
        street: this.props.table.state.actions.street
      });
    }
  }

  componentDidMount = () => {
    this.props.dispatch(checkGameStatus());
  }


  render() {
    return (
        <div>
          {this.state.playerCards ? (
            <div>
              <div>
                <ComputerHand
                />
              </div>
              <div>
                <PlayerHand
                  cards={this.state.playerCards}
                />
              </div>
              <div>
                <Pot
                  pot={this.state.pot}
                  handleChange={this.handleChange}
                />
              </div>
              <div>
                <Street
                  street={this.state.street}
                />
              </div>
              <div>
                <Controller
                  value={this.state.value}
                  currentAction={this.state.currentAction}
                  playerSb={this.state.playerSb}
                  handleChange={this.handleChange}
                  fold={this.fold}
                />
              </div>
            </div>
          ) : (
            null
          )
        }
        </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Table);
