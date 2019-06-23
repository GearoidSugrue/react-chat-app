import React, { useState } from 'react';

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

import { useFetchRooms, useUserLogin } from 'src/hooks';
import SearchableSelect, {
  SearchableOption
} from 'src/searchable-select/SearchableSelect';
import { ChatroomType, ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => createStyles({});

function createSearchableRoom(room: ChatroomType): SearchableOption {
  return {
    value: room.chatroomId,
    label: room.name
  };
}

function BrowseChatroomDialog({ open, onCancel, fullScreen }) {
  const { user } = useUserLogin();
  const { rooms } = useFetchRooms(nonUserRoomsPredicate);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const searchableRooms: SearchableOption[] = rooms.map(createSearchableRoom);

  function nonUserRoomsPredicate({ memberIds = [] }: ChatroomType): boolean {
    return !memberIds.includes(user.userId);
  }

  function handleSelectedRoomsChange(updatedRooms: SearchableOption[]) {
    setSelectedRooms(updatedRooms || []);
  }

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
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={onCancel} color="secondary">
          Join {selectedRooms.length > 1 ? 'Chatrooms' : 'Chatroom'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(BrowseChatroomDialog)
);
