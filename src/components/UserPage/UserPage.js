import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
    return (
      <div>
        <Link to="/game"></Link>
        <img src="/images/Icons/logout.png" />
      </div>


    )
  }
}


// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
