import React, { useState } from 'react';

import {
  Button,
  List,
  ListItem,
  Typography,
  withStyles
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';

import { fetchRoomsStatus, useFetchRooms, useUserLogin } from 'src/hooks';
import { ChatroomType, ChatTheme } from 'src/types';
import BrowseChatroomsDialog from './browse-chatrooms/BrowseChatroomsDialog';
import Chatroom from './Chatroom';

const styles = (theme: ChatTheme) => ({
  joinChatroomsButton: {
    padding: theme.spacing(1.5, 2)
  },
  joinChatroomsCircle: {
    fontSize: '14px',
    // the add circle svg size is based on font-size and is slightly shifted to the right, this helps counter it
    marginLeft: '-1px'
  },
  joinChatroomsText: {
    // the add circle svg size is based on font-size which is throwing off the Join Chatroom text, this is to counter it
    marginLeft: theme.spacing(2) - 1
  },
  loading: {
    margin: theme.spacing(2)
  },
  errorText: {
    margin: theme.spacing(2)
  }
});

type ChatroomsProps = Readonly<{
  classes: any;
  selectedChatroom: ChatroomType;
  onChatroomSelected: (chatroom: ChatroomType) => void;
}>;

/**
 * Displays a list of chatrooms the logged in user is a member of.
 * A 'Join Chatrooms' button at the end of the list pops open a dialog.
 * @param ChatroomsProps
 */
function Chatrooms({
  classes,
  selectedChatroom,
  onChatroomSelected
}: ChatroomsProps) {
  const { user } = useUserLogin();
  const { rooms, status: roomsStatus, retry } = useFetchRooms(
    userRoomsPredicate
  );
  const [joinChatroomsOpen, setJoinChatroomsOpen] = useState(false);

  function userRoomsPredicate({ memberIds = [] }: ChatroomType): boolean {
    return memberIds.includes(user.userId);
  }

  function handleOpenJoinChatrooms() {
    // TODO show join chatrooms success snackbar
    setJoinChatroomsOpen(true);
  }

  function handleCloseJoinChatrooms() {
    setJoinChatroomsOpen(false);
  }

  return (
    <>
      {roomsStatus === fetchRoomsStatus.FETCHING && (
        // TODO add loading placeholders
        <Typography color="inherit" className={classes.loading}>
          Loading rooms...
        </Typography>
      )}

      {roomsStatus === fetchRoomsStatus.SUCCESS && (
        <List disablePadding={true}>
          {rooms.map(chatroom => (
            <Chatroom
              key={chatroom.chatroomId}
              chatroom={chatroom}
              isSelected={selectedChatroom.chatroomId === chatroom.chatroomId}
              onChatroomSelected={onChatroomSelected}
            />
          ))}

          <ListItem
            button
            key="join-chatroom"
            className={classes.joinChatroomsButton}
            onClick={handleOpenJoinChatrooms}
          >
            <AddCircle className={classes.joinChatroomsCircle} />
            <Typography noWrap className={classes.joinChatroomsText}>
              Join Chatrooms
            </Typography>
          </ListItem>
        </List>
      )}

      {roomsStatus === fetchRoomsStatus.ERROR && (
        <Typography color="inherit" className={classes.errorText}>
          Error loading rooms!
          <Button color="secondary" onClick={retry}>
            Retry
          </Button>
        </Typography>
      )}

      {joinChatroomsOpen && (
        <BrowseChatroomsDialog
          open={joinChatroomsOpen}
          onCancel={handleCloseJoinChatrooms}
          onClose={handleCloseJoinChatrooms}
        />
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(Chatrooms);
