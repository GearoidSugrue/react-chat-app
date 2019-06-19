import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';

import { useChatApi } from 'src/chat-api';
import { useOnlineStatus } from 'src/hooks';
import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  gutterPadding: {
    paddingRight: '42px' // material ui default of 48px is just a bit too large. The name combined with ellipse is too far away from message counter.
  },
  circle: {
    width: '12px',
    height: '12px',
    minWidth: '12px', // adding this prevent the circle from been squished when the username is really long
    transition: 'background-color 0.5s ease',
    background: theme.chatColors.offline,
    borderRadius: '50%',
    display: 'inline-block'
  },
  online: {
    background: theme.chatColors.online
  },
  username: {
    margin: theme.spacing(0, 1, 0, 2)
  },
  unseenMessages: {
    fontWeight: 600
  },
  unseenMessageCounter: {
    color: theme.chatColors.online
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`
  }
});

function User({ classes, user, loggedInUser, isSelected, onUserSelected }) {
  const chatApi = useChatApi();
  const isLoggedInUser = user.userId === loggedInUser.userId;
  const online = useOnlineStatus(user, isLoggedInUser);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);

  const highlightText: boolean = !!unseenMessagesCount || isSelected;
  const displayText = user.username + (isLoggedInUser ? ' (you)' : '');

  const selectedClasses = clsx(isSelected && classes.selected);
  const onlineIconClasses = clsx(classes.circle, online && classes.online);
  const usernameClasses = clsx(
    classes.username,
    highlightText && classes.unseenMessages
  );
  const counterClasses = clsx(
    classes.unseenMessageCounter,
    highlightText && classes.unseenMessages
  );

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

  return (
    <ListItem
      button
      selected={isSelected}
      onClick={() => onUserSelected(user)}
      classes={{
        selected: selectedClasses,
        gutters: classes.gutterPadding
      }}
    >
      <span className={onlineIconClasses} />

      <ListItemText>
        <Typography noWrap className={usernameClasses}>
          {displayText}
        </Typography>
      </ListItemText>

      {!!unseenMessagesCount && !isSelected && (
        <ListItemSecondaryAction>
          <Typography noWrap className={counterClasses}>
            {unseenMessagesCount < 99 ? unseenMessagesCount : ':D'}
          </Typography>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(User);
