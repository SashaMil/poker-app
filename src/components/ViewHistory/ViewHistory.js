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
                  <Button color="inherit" onClick={this.deleteAllHistory}>
                    Delete All History
                  </Button>
                </Toolbar>
              </AppBar>
              {this.props.table.state.handHistory.actions.map((action, index) =>
                <ListItem key={index}>
                  <ListItemText primary={action.street} />
                </ListItem>
              )}
              {this.props.table.state.handHistory.messages.map((message, index) =>
                <ListItem key={index}>
                  <ListItemText primary={message.message} />
                </ListItem>
              )}
              {this.props.table.state.handHistory.playerCards.map((card, index) => {
                <ListItem key={index}>
                  <ListItemText primary={card.card1} />
                  <ListItemText primary={card.card2} />
                </ListItem>
              })}
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
