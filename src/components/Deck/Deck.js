import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';


const mapStateToProps = state => ({
  user: state.user,
});

class Deck extends Component {

  render() {
    return (
      <div>
        <Typography variant="headline" style={{ color: 'white' }}>Deck Here</Typography>
      </div>
    )
  }
}

export default Deck;
