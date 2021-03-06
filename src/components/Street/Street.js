import React, { Component } from 'react';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

class Street extends Component {

  render() {
    return (
      <div>
        <Slide direction="right" in={this.props.flop[0] !== undefined} mountOnEnter unmountOnExit>
          <img width='80px' src={`images/Cards/${this.props.flop[0]}.png`} />
        </Slide>
        <Slide direction="right" in={this.props.flop[1] !== undefined} mountOnEnter unmountOnExit>
          <img width='80px' src={`images/Cards/${this.props.flop[1]}.png`} />
        </Slide>
        <Slide direction="right" in={this.props.flop[2] !== undefined} mountOnEnter unmountOnExit>
          <img width='80px' src={`images/Cards/${this.props.flop[2]}.png`} />
        </Slide>
        <Slide direction="right" in={this.props.turn !== ''} mountOnEnter unmountOnExit>
          <img width='80px' src={`images/Cards/${this.props.turn}.png`} />
        </Slide>
        <Slide direction="right" in={this.props.river !== ''} mountOnEnter unmountOnExit>
          <img width='80px' src={`images/Cards/${this.props.river}.png`} />
        </Slide>
        <Typography variant="subheading" style={{ color: 'white' }}>{this.props.playerHandValue}</Typography>
      </div>
    )
  }
}


export default Street;
