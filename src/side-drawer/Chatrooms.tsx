import React, { useState } from 'react';
import FlexView from 'react-flexview';

import {
  Button,
  Fade,
  List,
  ListItem,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import { AddCircle, Error } from '@material-ui/icons';

import { fetchRoomsStatus, useFetchRooms, useUserLogin } from 'src/hooks';
import { ChatroomType, ChatTheme } from 'src/types';
import BrowseChatroomsDialog from './browse-chatrooms/BrowseChatroomsDialog';
import Chatroom from './Chatroom';

const PLACEHOLDER_COUNT = 4;

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
    width: '66%',
    height: theme.typography.fontSize,
    background: theme.palette.primary.light,
    borderRadius: theme.spacing(0.5)
  },
  loadingPlaceholder: {
    minHeight: '48px'
  },
  errorElement: {
    margin: theme.spacing(1, 2)
  }
});

type ChatroomsProps = Readonly<{
  classes: any;
  theme: ChatTheme;
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
  theme,
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
    setJoinChatroomsOpen(true);
  }

  function handleCloseJoinChatrooms() {
    setJoinChatroomsOpen(false);
  }

  return (
    <>
      {roomsStatus === fetchRoomsStatus.FETCHING && (
        <Fade in={true} timeout={1000}>
          <List disablePadding={true}>
            {[...Array(PLACEHOLDER_COUNT)].map((_, index) => (
              <ListItem
                button
                key={index}
                className={classes.loadingPlaceholder}
              >
                <div className={classes.loading} />
              </ListItem>
            ))}
          </List>
        </Fade>
      )}

      {roomsStatus === fetchRoomsStatus.SUCCESS && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
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
        </Fade>
      )}

      {roomsStatus === fetchRoomsStatus.ERROR && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <FlexView column vAlignContent="center" hAlignContent="center">
            <Error color="error" className={classes.errorElement} />
            <TextField
              error
              variant="outlined"
              id="error-loading-chatrooms"
              value="Failed to load chatrooms!"
              inputProps={{
                readOnly: true,
                disabled: true
              }}
            />
            <Button
              color="secondary"
              className={classes.errorElement}
              onClick={retry}
            >
              Retry
            </Button>
          </FlexView>
        </Fade>
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

export default withStyles(styles, { withTheme: true })(Chatrooms);
