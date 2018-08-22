import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Deck from '../Deck/Deck';
import PlayerHand from '../PlayerHand/PlayerHand';
import ComputerHand from '../ComputerHand/ComputerHand';
import Controller from '../Controller/Controller';
import Pot from '../Pot/Pot';
import Street from '../Street/Street';
import SnackBar from '../SnackBar/SnackBar';
import ComputerChips from '../ComputerChips/ComputerChips';
import PlayerChips from '../PlayerChips/PlayerChips';
import ActionsList from '../ActionsList/ActionsList';
import ComputerBet from '../ComputerBet/ComputerBet';
import PlayerBet from '../PlayerBet/PlayerBet';
import Alerts from '../Alerts/Alerts';
import PlayerHandRanking from '../PlayerHandRanking/PlayerHandRanking';
import ViewHistory from '../ViewHistory/ViewHistory';
import Button from '@material-ui/core/Button';



import './Table.css';
import Paper from '@material-ui/core/Paper';

import { checkGameStatus } from '../../redux/actions/tableActions';
import { playerFold } from '../../redux/actions/tableActions';
import { playerCall } from '../../redux/actions/tableActions';
import { playerCheck } from '../../redux/actions/tableActions';
import { playerBet } from '../../redux/actions/tableActions';
import { playerRaise } from '../../redux/actions/tableActions';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});


class Table extends Component {

  state = {
    value: 0,
    pot: null,
    showComputerCards: false,
    foldComputerCards: false,
    showPlayerCards: false,
    foldPlayerCards: false,
    alertOpen: false,
    historyOpen: false,
  };

  handleChange = (event, value) => {
    this.setState({
      value: value
    })
  }

  alertClose = () => {
    this.setState({ alertOpen: false });
  };

  historyOpen = () => {
    this.setState({ historyOpen: true });
  }

  historyClose = () => {
    this.setState({ historyOpen: false });
  }

  fold = () => {
    this.props.dispatch(playerFold());
  }

  call = () => {
    this.props.dispatch(playerCall());
  }

  check = () => {
    this.props.dispatch(playerCheck());
  }

  bet = (value) => {
    if (value === 0) {
      this.setState({ alertOpen: true });
    }
    else {
      this.props.dispatch(playerBet(this.state.value));
    }
  }

  raise = (value) => {
    console.log(value);
    console.log(this.props.table.state.actions.bet);
    if (value <= this.props.table.state.actions.bet) {
      this.setState({ alertOpen: true });
    }
    else {
      this.props.dispatch(playerRaise(value))
    }
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
      <div className="grid-2">
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
                <Pot
                  pot={redux.pot}
                  handleChange={this.handleChange}
                />
              </div>
              <div>
                <PlayerChips
                  chips={redux.playerChips}
                />
              </div>
              <div>
                <Street
                  street={redux.street}
                  currentAction={redux.actions}
                />
              </div>
              <div>
                <Controller
                  value={this.state.value}
                  currentAction={redux.actions}
                  playerSb={redux.player_sb}
                  handleChange={this.handleChange}
                  fold={this.fold}
                  call={this.call}
                  raise={this.raise}
                  check={this.check}
                  bet={this.bet}
                />
              </div>
              <div>
              </div>
              <div>
                <Alerts
                  open={this.state.alertOpen}
                  handleClose={this.alertClose}
                />
              </div>
            </div>
          ) : (
            null
          )
        }
        </div>
        <div>
          {this.state.showPlayerCards ? (
            <div>
              <div>
                <ActionsList
                  messages={redux.message}
                />
              </div>
              <div>
                <PlayerHandRanking
                  bestFiveCards={redux.actions.player_best_five_cards}
                />
              </div>
              <div>
                <ViewHistory
                  open={this.state.historyOpen}
                  historyClose={this.historyClose}
                />
              </div>
              <Button onClick={this.historyOpen}>
                View History
              </Button>
            </div>
          ) : (
            null
          )
        }
        </div>
      </div>

    )
  }
}

export default compose(connect(mapStateToProps))(Table);
