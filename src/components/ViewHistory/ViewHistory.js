import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { getHandHistory } from '../../redux/actions/tableActions';
import { deleteHandHistory } from '../../redux/actions/tableActions';



const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

const mapStateToProps = state => ({
  user: state.user,
  table: state.table,
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ViewHistory extends React.Component {

  state = {
    handHistory: null,
  }

  componentDidMount() {
    this.props.dispatch(getHandHistory());
  }

  deleteHistory = () => {
    this.props.dispatch(deleteHandHistory());
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.props.table.state.handHistory ? (
          <div>
            <Dialog
              fullScreen
              open={this.props.open}
              onClose={this.props.historyClose}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton color="inherit" onClick={this.props.historyClose} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="title" color="inherit" className={classes.flex}>
                    All Hand History
                  </Typography>
                  <Button color="inherit" onClick={this.deleteHistory}>
                    Delete All History
                  </Button>
                </Toolbar>
              </AppBar>
              <h2>List of Actions, Street, and Bet Amount</h2>
              {this.props.table.state.handHistory.actions.map((action, index) =>
                <ListItem className="grid-2"key={index}>
                  <ListItemText primary={'Type of Action: ' +  action.type}/>
                  <ListItemText primary={'Street Type: ' + action.street}/>
                  <ListItemText primary={'Bet Amount: ' + action.bet}/>
                  <ListItemText primary={'ID: ' + action._id} />

                </ListItem>
              )}
              <br></br>
              <br></br>
              <h2>List of Player Cards</h2>
              {this.props.table.state.handHistory.playerCards.map((card, index) =>
                <ListItem className="grid-2" key={index}>
                  <ListItemText primary={'Player Card 1: ' + card.card1}/>
                  <ListItemText primary={'Player Card 2: ' + card.card2}/>
                  <ListItemText primary={'ID: ' + card._id} />
                </ListItem>
              )}
              <br></br>
              <br></br>
              <h2>List of Streets</h2>
              {this.props.table.state.handHistory.street.map((road, index) =>
                <ListItem className="grid-2" key={index}>
                  <ListItemText primary={'Flop Card 1: ' + road.flop1} />
                  <ListItemText primary={'Flop Card 2: ' + road.flop2} />
                  <ListItemText primary={'Flop Card 3: ' + road.flop3} />
                  <ListItemText primary={'Turn: ' + road.turn} />
                  <ListItemText primary={'River: ' + road.river} />
                  <ListItemText primary={'ID: ' + road._id} />
                </ListItem>
              )}
            </Dialog>
          </div>
    ) : (
      null
    )
  }
  </div>

    );
  }
}

ViewHistory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles),connect(mapStateToProps),)(ViewHistory);
