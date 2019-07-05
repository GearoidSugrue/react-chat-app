import React, { useState } from 'react';

import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  withMobileDialog,
  withStyles
} from '@material-ui/core';
import { Clear, Error } from '@material-ui/icons';

import { useChatApi } from 'src/chat-api';
import { fetchUsersStatus, useFetchUsers, useUserLogin } from 'src/hooks';
import SearchableSelect, {
  SearchableOption
} from 'src/searchable-select/SearchableSelect';
import { ChatTheme, UserType } from 'src/types';

const MAX_CHATROOM_NAME_LENGTH = 22;

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
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    createButtonWrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    buttonPending: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    }
  });

function CreateChatroom({ classes, theme, open, fullScreen, onClose }) {
  const chatApi = useChatApi();
  const { user: loggedInUser } = useUserLogin();
  const { users, status: usersStatus } = useFetchUsers();
  const [chatroomName, setChatroomName] = useState('');
  const [nameErrorText, setNameErrorText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [createPending, setCreatePending] = useState(false);
  const [createError, setCreateError] = useState(false);

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

  function handleSelectedUsersChange(updatedUsers: SearchableOption[]) {
    setSelectedUsers(updatedUsers || []);
  }

  async function handleCreateChatroom() {
    setCreatePending(true);

    const memberIds = selectedUsers.map((user: SearchableOption) => user.value);
    const newChatroom = await chatApi
      .createChatroom(chatroomName, memberIds, loggedInUser.userId)
      .catch(err => undefined);

    setCreatePending(false);

    if (newChatroom) {
      onClose({ success: true });
    } else {
      setCreateError(true);
    }
  }

  const chatroomNameFragment = (
    <TextField
      fullWidth
      required
      id="outlined-chatroom-name"
      className={classes.createChatroomElement}
      autoComplete="off"
      margin="normal"
      variant="outlined"
      label="Name"
      helperText={
        nameErrorText ||
        'Name must not have spaces or periods, and be shorter than 22 characters'
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

  const createErrorFragment = (
    <TextField
      fullWidth
      className={classes.createChatroomElement}
      error={true}
      variant="outlined"
      value="Error: Failed to created chatroom!"
      inputProps={{
        readOnly: true,
        disabled: true
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Error color="error" />
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

            {createError && (
              <Fade
                in={true}
                timeout={theme.transitions.duration.enteringScreen}
              >
                {createErrorFragment}
              </Fade>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Cancel
        </Button>
        <div className={classes.createButtonWrapper}>
          <Button
            variant="contained"
            disabled={!chatroomName || Boolean(nameErrorText) || createPending}
            onClick={handleCreateChatroom}
            color="secondary"
          >
            {createError ? 'Retry' : 'Create Chatroom'}
          </Button>
          {createPending && (
            <CircularProgress size={24} className={classes.buttonPending} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(CreateChatroom)
);
