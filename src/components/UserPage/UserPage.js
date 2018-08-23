import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

import './UserPage.css';



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
    return (
      <div>
        <div>
          <h1 className="header">POKERBOT</h1>
        </div>
        <div className="grid-3">
          <Link to="/game"><img className="images" src="/images/Icons/startGame.png" /></Link>
          <Link to="/statistics"><img className="images" src="/images/Icons/statistics.png" /></Link>
          <Link to="/settings"><img className ="images" src="/images/Icons/settings.png" /></Link>
          <Link to="/preferences"><img className="images" src="/images/Icons/preferences.png" /></Link>
          <Link to="/account"><img className="images" src="/images/Icons/account.png" /></Link>
          <Link to="/game"><img className="images" src="/images/Icons/logout.png" /></Link>
        </div>
      </div>


    )
  }
}


// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
