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
import SnackBar from '../SnackBar/SnackBar';
import ComputerChips from '../ComputerChips/ComputerChips';
import PlayerChips from '../PlayerChips/PlayerChips';


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
    betSize: null,
    pot: null,
    showComputerCards: false,
    foldComputerCards: false,
    showPlayerCards: false,
    foldPlayerCards: false,
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
        showPlayerCards: true,
      });
    }
  }

  componentDidMount = () => {
    this.props.dispatch(checkGameStatus());
  }


  render() {

    const redux = this.props.table.state;

    return (
        <div>
          {this.state.showPlayerCards ? (
            <div>
              <div>
                <ComputerHand
                  showCards={this.state.showComputerCards}
                />
              </div>
              <div>
                <ComputerChips
                  chips={redux.computerChips}
                />
              </div>
              <div>
                <PlayerHand
                  cards={redux.playerCards}
                  showCards={this.state.showPlayerCards}
                />
              </div>
              <div>
                <PlayerChips
                  chips={redux.playerChips}
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
                  street={redux.street}
                />
              </div>
              <div>
                <Controller
                  betSize={this.state.betSize}
                  currentAction={redux.actions}
                  playerSb={redux.player_sb}
                  handleChange={this.handleChange}
                  fold={this.fold}
                  call={this.call}
                  raise={this.raise}
                />
              </div>
              <div>
                {redux.message.map((message, index) =>
                  <SnackBar
                    key={index}
                    message={message.message}
                  />
              )}

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
