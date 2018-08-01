import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const mapStateToProps = state => ({
  user: state.user,
});

class Stats extends Component {
  render() {
    return (
      <div>
        <p style={{color: 'white'}}>Win Percentage: 57%</p>
        <p style={{color: 'white'}}>Games Played: 26</p>
        <p style={{color: 'white'}}>Games Played: 26</p>



      </div>
    );
  };
}













export default Stats;
