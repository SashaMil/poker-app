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

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
          <List className={classes.root} subheader={<li />}>
              <li className={classes.listSection}>
                <ul className={classes.ul}>
                  <ListSubheader></ListSubheader>
                  {this.props.messages.map((message, index) =>
                    <ListItem key={index}>
                      <ListItemText primary={message.message} />
                    </ListItem>
                  )}
                </ul>
              </li>
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
          </List>
      </div>
    );
  }
}

ActionsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActionsList);
