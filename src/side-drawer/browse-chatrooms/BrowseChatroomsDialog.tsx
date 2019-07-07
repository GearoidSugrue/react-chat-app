import React, { useEffect, useState } from 'react';

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
  withStyles
} from '@material-ui/core';

import { useChatApi } from 'src/chat-api';
import { useFetchRooms, useUserLogin } from 'src/hooks';
import SearchableSelect, {
  SearchableOption
} from 'src/searchable-select/SearchableSelect';
import ErrorMessage from 'src/shared/ErrorMessage';
import PendingButton from 'src/shared/PendingButton';
import { ChatroomType, ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => createStyles({});

function createSearchableRoom(room: ChatroomType): SearchableOption {
  return {
    value: room.chatroomId,
    label: room.name
  };
}

function BrowseChatroomDialog({ open, fullScreen, onClose, onCancel }) {
  const chatApi = useChatApi();
  const { user } = useUserLogin();
  const { rooms } = useFetchRooms(nonUserRoomsPredicate);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [joinButtonText, setJoinButtonText] = useState('Join Chatroom');

  const [joinPending, setJoinPending] = useState(false);
  const [joinError, setJoinError] = useState(false);

  const searchableRooms: SearchableOption[] = rooms.map(createSearchableRoom);

  useEffect(
    function updateJoinButtonText() {
      if (joinError) {
        setJoinButtonText('Retry');
      } else if (selectedRooms.length > 1) {
        setJoinButtonText('Join Chatrooms');
      } else {
        setJoinButtonText('Join Chatroom');
      }
    },
    [selectedRooms, joinError, setJoinButtonText]
  );

  function nonUserRoomsPredicate({ memberIds = [] }: ChatroomType): boolean {
    return !memberIds.includes(user.userId);
  }

  function handleSelectedRoomsChange(updatedRooms: SearchableOption[]) {
    setSelectedRooms(updatedRooms || []);
  }

  async function handleJoinChatrooms() {
    setJoinPending(true);
    const chatroomIds = selectedRooms.map(
      (room: SearchableOption) => room.value
    );
    try {
      const result = await chatApi.joinChatrooms(chatroomIds, user.userId);
      console.log('Join chatroom results:', result);
      onClose();
    } catch (err) {
      setJoinError(true);
    } finally {
      setJoinPending(false);
    }
  }

  const joinButtonFragment = (
    <Button
      variant="contained"
      disabled={!selectedRooms.length || joinPending}
      onClick={handleJoinChatrooms}
      color="secondary"
    >
      {joinButtonText}
    </Button>
  );

  return (
    <Dialog fullWidth fullScreen={fullScreen} open={open} onClose={onCancel}>
      <DialogTitle id="browse-dialog-title">Join Chatrooms</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a Chatroom below. Start typing to narrow down the chatrooms.
        </DialogContentText>

        <SearchableSelect
          label="Chatrooms"
          options={searchableRooms}
          selectedOptions={selectedRooms}
          onSelectedOptionsChange={handleSelectedRoomsChange}
        />

        <ErrorMessage
          errorMessage="Error: Failed to join chatrooms!"
          showError={joinError}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onCancel} color="secondary">
          Cancel
        </Button>

        <PendingButton button={joinButtonFragment} pending={joinPending} />
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(BrowseChatroomDialog)
);
