import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Nav from '../../components/Nav/Nav';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';


const mapStateToProps = state => ({
  user: state.user,
});

class UserPage extends Component {
  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }

  logout = () => {
    this.props.dispatch(triggerLogout());
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <h1 id="welcome">
            Welcome, { this.props.user.userName }!
          </h1>
          <p>Your ID is: {this.props.user.id}</p>
          <Link to="/game">
            <button>
              New Game
            </button>
          </Link>
          <Link to="/">
            <button onClick={this.logout}>Log Out</button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        <Nav />
        { content }
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
