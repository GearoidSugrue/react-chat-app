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

import { useFetchRooms } from 'src/hooks';
import { ChatroomType, ChatTheme } from 'src/types';
import SearchableSelect, { SearchableOption } from './SearchableSelect';

const styles = (theme: ChatTheme) => createStyles({});

function BrowseChatroomDialog({ open, onCancel, fullScreen }) {
  const { rooms } = useFetchRooms();
  const [selectedRooms, setSelectedRooms] = useState();

  const searchableRooms: SearchableOption[] = rooms.map(
    (room: ChatroomType) => ({
      value: room.chatroomId,
      label: room.name
    })
  );

  function handleSelectedRoomsChange(updatedRooms: SearchableOption[]) {
    setSelectedRooms(updatedRooms);
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
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(BrowseChatroomDialog)
);
