import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
});

class ActionsList extends Component {


  render() {
    return (
      <div>
        {this.props.messages.map((message, index) =>
          <List className={styles.root}>
            <ListItem key={index}>
              <ListItemText primary={message.message} />
            </ListItem>
          </List>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ActionsList);
