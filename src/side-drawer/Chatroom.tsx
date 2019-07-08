import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import {
  createStyles,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';

import { useChatApi } from 'src/chat-api';
import { ChatroomType, ChatTheme } from 'src/types';

type ChatroomClasses = {
  gutterPadding: any;
  name: any;
  namePrefix: any;
  unseenMessages: any;
  unseenMessageCounter: any;
  selected: any;
};

const styles = (theme: ChatTheme) =>
  createStyles({
    // online: {
    //   background: '#2ecc71'
    // },
    gutterPadding: {
      paddingRight: '42px' // material ui default of 48px is just a bit too large. The name combined with ellipse is too far away from message counter.
    },
    name: {
      marginLeft: theme.spacing(2)
    },
    namePrefix: {
      color: '#bdc3c7', // darker: #2b2e30 // lighter: #bdc3c7'
      fontWeight: 500,
      margin: '0 1px'
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

type ChatroomProps = {
  classes: ChatroomClasses;
  chatroom: ChatroomType;
  isSelected: boolean;
  onChatroomSelected: (chatroom: ChatroomType) => void;
};

/*
 * // TODO Theres a lot of over lap with the User component in here. Try simplify it.
 * There is difference in what chatApi method to call.
 * Perhaps if the the resulting unseenMessagesSub get provided to a new external comp.
 * that subscribes to it in an effect and the increment along with highlighting text,
 * the counter, css and html
 */

/**
 * Displays the chatroom's name post-fixed with the number of unseen messages.
 * If it's selected then it is highlighted.
 * If it's not selected then it will listen for new messages and increment the unseen messages counter.
 * @param ChatroomProps
 */
function Chatroom({
  classes,
  chatroom,
  isSelected,
  onChatroomSelected
}: ChatroomProps) {
  const chatApi = useChatApi();
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);

  const highlightText: boolean = !!unseenMessagesCount || isSelected;

  const selectedClasses = clsx(isSelected && classes.selected);
  const nameClasses = clsx(
    classes.name,
    highlightText && classes.unseenMessages
  );
  const counterClasses = clsx(
    classes.unseenMessageCounter,
    highlightText && classes.unseenMessages
  );

  useEffect(
    // TODO info: createUnseenMessagesListener or something like that
    function listenForUnseenMessages() {
      function incrementUnseenMessages() {
        setUnseenMessagesCount(unseenMessagesCount + 1);
      }

      const unseenMessagesSub = chatApi
        .listenForChatroomMessages$(chatroom.chatroomId)
        .subscribe(incrementUnseenMessages);

      return () => unseenMessagesSub.unsubscribe();
    },
    [chatApi, chatroom, unseenMessagesCount, setUnseenMessagesCount]
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
      key={chatroom.chatroomId}
      selected={isSelected}
      onClick={() => onChatroomSelected(chatroom)}
      classes={{
        selected: selectedClasses,
        gutters: classes.gutterPadding
      }}
    >
      <Typography className={classes.namePrefix}>#</Typography>

      {/* 
      // TODO unseen message logic is almost a duplicate of user unseen messages - investigate if a pattern can be extracted and abstracted  
      <RecipientUnseenMessagesCounter
        name={chatroom.name}
        isSelected={isSelected}
        unseenMessages$={ 
          result of: chatApi.listenForChatroomMessages$(chatroom.chatroomId)
      }
      > </...> */}

      <ListItemText>
        <Typography noWrap className={nameClasses}>
          {chatroom.name}
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

export default withStyles(styles, { withTheme: true })(Chatroom);
