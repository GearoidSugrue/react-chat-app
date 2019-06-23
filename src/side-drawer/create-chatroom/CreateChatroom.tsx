import React, { useState } from 'react';

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  withMobileDialog,
  withStyles
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import SearchableSelect, {
  SearchableOption
} from 'src/searchable-select/SearchableSelect';
import { ChatTheme, UserType } from 'src/types';

const MAX_CHATROOM_NAME_LENGTH = 22;

function hasUpperCase(text: string) {
  return text !== text.toLowerCase();
}

function hasSpaces(text: string) {
  return text.includes(' ');
}

function hasPeriods(text: string) {
  return text.includes('.');
}

const styles = (theme: ChatTheme) =>
  createStyles({
    clearNameButton: {
      marginRight: '-10px'
    },
    createChatroomElement: {
      margin: theme.spacing(2, 0)
    }
  });

function CreateChatroom({ classes, open, fullScreen, onClose }) {
  const { users, status: usersStatus } = useFetchUsers();
  const [chatroomName, setChatroomName] = useState('');
  const [nameErrorText, setNameErrorText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const searchableUsers: SearchableOption[] = users.map((user: UserType) => ({
    value: user.userId,
    label: user.username
  }));

  function handleNameChange(event: React.ChangeEvent<{ value: string }>) {
    const name = event.target.value || '';
    let errorText = '';

    if (!name) {
      errorText = 'Name is required';
    } else if (name.length >= MAX_CHATROOM_NAME_LENGTH) {
      errorText = `Must be shorter than ${MAX_CHATROOM_NAME_LENGTH} characters`;
    }

    if (hasUpperCase(name)) {
      const currentErrorText = errorText ? `${errorText}. ` : '';
      errorText = `${currentErrorText}Must not contain uppercase characters`;
    }

    if (hasSpaces(name) || hasPeriods(name)) {
      const currentErrorText = errorText ? `${errorText}. ` : '';
      errorText = `${currentErrorText}Must not contain spaces or periods`;
    }

    setNameErrorText(errorText);
    setChatroomName(name);
  }

  function handleClearName() {
    setChatroomName('');
  }

  function handleSelectedUsersChange(updatedRooms: SearchableOption[]) {
    setSelectedUsers(updatedRooms);
  }

  function handleCreateChatroom() {
    // todo implement
    onClose();
  }

  const chatroomNameFragment = (
    <TextField
      fullWidth
      required
      id="outlined-chatroom-name"
      className={classes.createChatroomElement}
      margin="normal"
      variant="outlined"
      label="Name"
      helperText={
        nameErrorText ||
        'Name must be lowercase, without spaces or periods, and be shorter than 22 characters'
      }
      value={chatroomName}
      error={Boolean(nameErrorText)}
      onChange={handleNameChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">#</InputAdornment>,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className={classes.clearNameButton}
              onClick={handleClearName}
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );

  return (
    <Dialog fullWidth fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle id="browse-dialog-title">Create Chatroom</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Give your chatroom a name. You can also optionally add users to the
          chatroom.
        </DialogContentText>

        {usersStatus === fetchUsersStatus.FETCHING && 'Loading users...'}

        {usersStatus === fetchUsersStatus.SUCCESS && (
          <>
            {chatroomNameFragment}

            <div className={classes.createChatroomElement}>
              <SearchableSelect
                label="Add users to chatroom (Optional)"
                options={searchableUsers}
                selectedOptions={selectedUsers}
                onSelectedOptionsChange={handleSelectedUsersChange}
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!chatroomName || Boolean(nameErrorText)}
          onClick={handleCreateChatroom}
          color="secondary"
        >
          Create Chatroom
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(CreateChatroom)
);
