import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Log from '../Log/Log';
import Deck from '../Deck/Deck';

import './Table.css';
import Paper from '@material-ui/core/Paper';

import { shuffle } from '../../redux/actions/tableActions';
import { checkGameStatus } from '../../redux/actions/tableActions';


const mapStateToProps = state => ({
  user: state.user,
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

  componentDidMount = () => {
    // this.props.dispatch(shuffle());
    this.props.dispatch(checkGameStatus());
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
        </div>
      </div>
    )
  }
}

export default compose(connect(mapStateToProps))(Table);
