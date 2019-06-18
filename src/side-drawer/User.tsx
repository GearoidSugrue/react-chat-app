import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { ListItemText } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import { useChatApi } from 'src/chat-api/ChatApiContext';
import useOnlineStatus from 'src/hooks/OnlineStatus.hook';
import { ChatTheme } from 'src/types/ChatTheme.type';

const styles = (theme: ChatTheme) => ({
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
    color: theme.chatColors.online,
    paddingRight: '6px'
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
        selected: selectedClasses
      }}
    >
      <span className={onlineIconClasses} />

      <ListItemText>
        <TypoGraphy noWrap className={usernameClasses}>
          {displayText}
        </TypoGraphy>
      </ListItemText>

      {!!unseenMessagesCount && !isSelected && (
        <TypoGraphy noWrap className={counterClasses}>
          {unseenMessagesCount < 99 ? unseenMessagesCount : ':D'}
        </TypoGraphy>
      )}
    </ListItem>
  );
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(User);