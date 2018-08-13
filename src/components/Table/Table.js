import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Log from '../Log/Log';
import Deck from '../Deck/Deck';
import PlayerHand from '../PlayerHand/PlayerHand';
import ComputerHand from '../ComputerHand/ComputerHand';
import Controller from '../Controller/Controller';
import Pot from '../Pot/Pot';

import './Table.css';
import Paper from '@material-ui/core/Paper';

import { shuffle } from '../../redux/actions/tableActions';
import { checkGameStatus } from '../../redux/actions/tableActions';


const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

class Table extends Component {

  state = {
    shuffle: false,
    bet: 0,
  }

  handleShuffle = () => {
    this.setState({
      shuffle: !this.state.shuffle,
    })
  }

  playerAction = () => {
    console.log('Hey there!');
  }

  handleChange = (name) => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.table !== prevProps.table) {
      console.log(this.props.table);
    }
  }

  componentDidMount = () => {
    this.props.dispatch(checkGameStatus());
    console.log(this.props.table.state);
  }

  render() {
    return (
        <div>
          {this.props.table.state ? (
            <div>
              <div>
                <ComputerHand
                />
              </div>
              <div>
                <PlayerHand
                  cards={this.props.table.state.playerCards}
                />
              </div>
              <div>
                <Pot
                  pot={this.props.table.state.pot}
                />
              </div>
              <div>
                <Controller
                  playerSb={this.props.table.state.player_sb}
                  handleBet={this.handleChange}
                  playerAction={this.playerAction}
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
