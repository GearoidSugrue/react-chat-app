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
import { VerticalErrorMessage } from 'src/shared';
import { ChatroomType, ChatTheme } from 'src/types';
import BrowseChatroomsDialog from './browse-chatrooms/BrowseChatroomsDialog';
import Chatroom from './Chatroom';
import { ChatroomPlaceholders } from './placeholders';

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
  const { rooms, status: roomsStatus, addRooms, retry } = useFetchRooms(
    userRoomsPredicate
  );
  const [joinChatroomsOpen, setJoinChatroomsOpen] = useState(false);

  function userRoomsPredicate({ memberIds = [] }: ChatroomType): boolean {
    return memberIds.includes(user.userId);
  }

  function handleOpenJoinChatrooms() {
    setJoinChatroomsOpen(true);
  }

  function handleCloseJoinChatrooms(roomsJoined: ChatroomType[]) {
    if (roomsJoined) {
      addRooms(roomsJoined);
    }
    setJoinChatroomsOpen(false);
  }

  return (
    <>
      {/* // TODO placeholder count could be got from User if user still contains chatroomIds info after DB implementation. 
            Or else use store chatroom count in local storage and use it next time the user logs in. 
        */}
      {roomsStatus === fetchRoomsStatus.FETCHING && (
        <ChatroomPlaceholders placeholderCount={5} />
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
        <VerticalErrorMessage
          errorMessage="Failed to load chatrooms!"
          showError={true}
          action={
            <Button color="secondary" onClick={retry}>
              Retry
            </Button>
          }
        />
      )}

      {joinChatroomsOpen && (
        <BrowseChatroomsDialog
          open={joinChatroomsOpen}
          onClose={handleCloseJoinChatrooms}
        />
      )}
    </>
  );
}

export default withStyles(styles)(Chatrooms);
