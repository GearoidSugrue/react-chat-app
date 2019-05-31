import React, { useState } from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import useOnlineStatus from '../hooks/OnlineStatus.hook';

const styles = theme => ({
  circle: {
    width: '12px',
    height: '12px',
    transition: 'background-color 0.5s ease',
    background: '#bdc3c7',
    borderRadius: '50%',
    display: 'inline-block'
  },
  online: {
    background: '#2ecc71'
  },
  username: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    margin: theme.spacing(1, 2)
  },
  // unseenMessagesUsername: {
  //   fontWeight: 500
  // },
  unseenMessages: {
    background: 'blue'
  }
});

function User({ classes, user, isSelected, onUserSelected }) {
  const online = useOnlineStatus(user);
  const [unseenMessages, setUnseenMessages] = useState(false);
  // todo add hook userMessage/userActivity that listens for messages from a user
  // update unseenMessages in effect if on new message and isSelected is false

  // todo: should a unseenMessage counter be better?

  const onlineIconClasses = clsx(classes.circle, online && classes.online);
  const usernameClasses = clsx(
    classes.username
    // unseenMessages && classes.unseenMessagesUsername
  );
  const unseenMessagesIconClasses = clsx(classes.circle, classes.newActivity);

  return (
    <ListItem button selected={isSelected} onClick={() => onUserSelected(user)}>
      <span className={onlineIconClasses} />

      <ListItemText className={usernameClasses} primary={user.username} />

      {unseenMessages && !isSelected && (
        <span className={unseenMessagesIconClasses} />
      )}
    </ListItem>
  );
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(User);
