import clsx from 'clsx';
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
import { ChatTheme, UserType } from 'src/types';

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
    fontWeight: 500
  },
  unseenMessageCounter: {
    color: theme.chatColors.online
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`
  }
});

type UserProps = Readonly<{
  classes: any;
  user: UserType;
  loggedInUser: UserType;
  isSelected: boolean;
  onUserSelected: (user: UserType) => void;
}>;

/**
 * Displays a user's name appended with the number of new unseen messages.
 * If it's selected then the user is highlighted.
 * If it's not selected then it will listen for new messages and increment the unseen messages counter.
 * @param UserProps
 */
function User({
  classes,
  user,
  loggedInUser,
  isSelected,
  onUserSelected
}: UserProps) {
  const chatApi = useChatApi();
  const online = useOnlineStatus(user);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);
  const [displayText, setDisplayText] = useState(user.username);
  const isHighlighted: boolean = !!unseenMessagesCount || isSelected;

  const selectedClasses = clsx(isSelected && classes.selected);
  const onlineIconClasses = clsx(classes.circle, online && classes.online);
  const usernameClasses = clsx(
    classes.username,
    isHighlighted && classes.unseenMessages
  );
  const counterClasses = clsx(
    classes.unseenMessageCounter,
    isHighlighted && classes.unseenMessages
  );

  useEffect(
    function markLoggedInUser() {
      const isLoggedInUser = user.userId === loggedInUser.userId;

      if (isLoggedInUser) {
        setDisplayText(`${user.username} (you)`);
      }
    },
    [setDisplayText]
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

  function handleUserSelected() {
    onUserSelected(user);
  }

  return (
    <ListItem
      button
      selected={isSelected}
      onClick={handleUserSelected}
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
export default withStyles(styles)(User);
