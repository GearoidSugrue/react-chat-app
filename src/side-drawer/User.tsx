import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import { useChatApi } from 'src/chat-api/ChatApiContext';
import useOnlineStatus from 'src/hooks/OnlineStatus.hook';
import useUserLogin from 'src/hooks/UserLogin.hook';

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
  unseenMessages: {
    fontWeight: 600
  }
});

function User({ classes, user, isSelected, onUserSelected }) {
  const chatApi = useChatApi();
  const { user: loggedInUser } = useUserLogin(); // todo remove?
  const isLoggedInUser = user.userId === loggedInUser.userId;
  const online = useOnlineStatus(user, isLoggedInUser);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);
  const highlightText: boolean = !!unseenMessagesCount || isSelected;

  useEffect(
    function listenForUnseenMessages() {
      const incrementUnseenMessages = () =>
        setUnseenMessagesCount(unseenMessagesCount + 1);

      const unseenMessagesSub = chatApi
        .directUserMessages$(loggedInUser.userId, user.userId)
        .subscribe(incrementUnseenMessages);

      return () => unseenMessagesSub.unsubscribe();
    },
    [chatApi, loggedInUser, user, unseenMessagesCount, setUnseenMessagesCount]
  );

  useEffect(
    function resetUnseenMessagesCount() {
      setUnseenMessagesCount(0);
    },
    [isSelected, setUnseenMessagesCount]
  );

  const onlineIconClasses = clsx(classes.circle, online && classes.online);
  const usernameClasses = clsx(
    classes.username,
    highlightText && classes.unseenMessages
  );

  const displayText = user.username + (isLoggedInUser ? ' (you)' : '');

  return (
    <ListItem button selected={isSelected} onClick={() => onUserSelected(user)}>
      <span className={onlineIconClasses} />

      <ListItemText
        classes={{ primary: usernameClasses }}
        primary={displayText}
      />

      {!!unseenMessagesCount && !isSelected && (
        <span className={classes.unseenMessages}>{unseenMessagesCount}</span>
      )}
    </ListItem>
  );
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(User);
