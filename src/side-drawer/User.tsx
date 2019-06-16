import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import { useChatApi } from 'src/chat-api/ChatApiContext';
import useOnlineStatus from 'src/hooks/OnlineStatus.hook';
import { ChatTheme } from 'src/types/ChatTheme.type';

const styles = (theme: ChatTheme) => ({
  circle: {
    width: '12px',
    height: '12px',
    transition: 'background-color 0.5s ease',
    background: theme.chatColors.offline,
    borderRadius: '50%',
    display: 'inline-block'
  },
  online: {
    background: theme.chatColors.online
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

function User({ classes, user, loggedInUser, isSelected, onUserSelected }) {
  const chatApi = useChatApi();
  const isLoggedInUser = user.userId === loggedInUser.userId;
  const online = useOnlineStatus(user, isLoggedInUser);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);

  const highlightText: boolean = !!unseenMessagesCount || isSelected;
  const displayText = user.username + (isLoggedInUser ? ' (you)' : '');

  const onlineIconClasses = clsx(classes.circle, online && classes.online);
  const usernameClasses = clsx(
    classes.username,
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
