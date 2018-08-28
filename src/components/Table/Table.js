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
import PlayerBet from '../PlayerBet/PlayerBet';
import Alerts from '../Alerts/Alerts';
import PlayerHandRanking from '../PlayerHandRanking/PlayerHandRanking';
import Button from '@material-ui/core/Button';
import ComputerAction from '../ComputerAction/ComputerAction';
import PlayerPrompt from '../PlayerPrompt/PlayerPrompt';

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
    showComputerHand: this.props.table.cards.showComputerHand,
    dealComputerHand: this.props.table.cards.dealComputerHand,
    dealPlayerHand: this.props.table.cards.dealPlayerHand,
    showComputerAction: false,
    showPlayerPrompt: false,
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

  componentDidMount = () => {
    this.props.dispatch(checkGameStatus());
  }


  render() {

    const actions = this.props.table.actions;
    const cards = this.props.table.cards;
    const chips = this.props.table.chips;

    return (
      <div>
       <div>
         {this.props.table ? (
           <div className="grid">
             <div>
               <ComputerChips
                 chips={chips.computerChips}
               />
             </div>
             <div>
               <ComputerHand
                 showCards={cards.showComputerHand}
                 dealComputerHand={cards.dealPlayerHand}
               />
             </div>
             <div>
               {actions.lastAction.player ? (
                 <ComputerAction
                 />
                 ) : (
                   null
                 )
               }
             </div>
             <div>
               <Deck
               />
             </div>
             <div>
               <Street
                 street={cards.street}
                 currentAction={actions.lastAction}
               />
             </div>
             <div>
               <Pot
                 pot={chips.pot}
                 handleChange={this.handleChange}
               />
             </div>
             <div>
               <PlayerChips
                 chips={chips.playerChips}
               />
             </div>
             <div>
               <div>
                 <PlayerHand
                   card1={cards.playerCard1}
                   card2={cards.playerCard2}
                   dealPlayerHand={cards.dealPlayerHand}
                 />
                 <br></br>
                 <br></br>
                 <br></br>
                 <div>
                   <PlayerPrompt
                   />
                 </div>
               </div>
             </div>
             <div>
               <Controller
                 value={this.state.value}
                 currentAction={actions.lastAction}
                 playerSb={actions.playerButton}
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
     </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Table);
