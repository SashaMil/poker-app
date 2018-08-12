import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Log from '../Log/Log';
import Deck from '../Deck/Deck';
import PlayerHand from '../PlayerHand/PlayerHand';

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
  }

  handleShuffle = () => {
    this.setState({
      shuffle: !this.state.shuffle,
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.table !== prevProps.table) {
      console.log('Hello');
    }
  }

  componentDidMount = () => {
    this.props.dispatch(checkGameStatus());
    console.log(this.props.table);
  }

  render() {
    return (
      <div>
        <div className="wrapper">
          <div>
            <Log actions={this.props.actions} />
          </div>
          <div>
            <Deck shuffle={this.handleShuffle} />
          </div>
          <div>
            <PlayerHand />
          </div>
        </div>
      </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Table);
