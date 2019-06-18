import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  ListItem,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';

import { useChatApi } from 'src/chat-api';
import { ChatroomType, ChatTheme } from 'src/types';

// tslint:disable-next-line: interface-over-type-literal
type ChatroomClasses = {
  selected: any;
  name: any;
  namePrefix: any;
  unseenMessages: any;
  unseenMessageCounter: any;
};

// tslint:disable-next-line: interface-over-type-literal
type ChatroomProps = Readonly<{
  classes: ChatroomClasses;
  chatroom: ChatroomType;
  isSelected: boolean;
  onChatroomSelected: (chatroom: ChatroomType) => void;
}>;

const styles = (theme: ChatTheme): ChatroomClasses => ({
  // online: {
  //   background: '#2ecc71'
  // },

  name: {
    marginLeft: theme.spacing(2)
    // marginRight: theme.spacing(1)
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
    color: theme.chatColors.online,
    paddingRight: '6px' // the text over-flow pushes the counter slightly out of view. This counters it at the cost of losing some alignment. It'll do for now!
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`
  }
});

/*
 * TODO: Theres a lot of over lap with the User component in here.
 * There's is difference in what chatApi method to call.
 * Perhaps if the the resulting unseenMessagesSub get provided to a new external comp.
 * that subscribes to it in an effect and the increment along with hightlighting text,
 * the counter, css and html
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
    // todo info: createUnseenMessagesListener or something like that
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
        selected: selectedClasses
      }}
    >
      <Typography className={classes.namePrefix}>#</Typography>

      {/* <RecipientUnseenMessagesCounter
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
        <Typography noWrap className={counterClasses}>
          {unseenMessagesCount < 99 ? unseenMessagesCount : ':D'}
        </Typography>
      )}
    </ListItem>
  );
}

Chatroom.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Chatroom as Chatroom);
