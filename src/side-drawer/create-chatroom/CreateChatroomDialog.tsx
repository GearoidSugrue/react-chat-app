import { OptionsObject, useSnackbar } from 'notistack';
import React, { useState } from 'react';

import {
  Button,
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
  Typography,
  withMobileDialog,
  withStyles
} from '@material-ui/core';
import { Clear, Close } from '@material-ui/icons';

import { useChatApi } from 'src/chat-api';
import { fetchUsersStatus, useFetchUsers, useUserLogin } from 'src/hooks';
import {
  ErrorMessage,
  PendingButton,
  SearchableOption,
  SearchableSelect
} from 'src/shared';
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
    },
    loading: {
      background: theme.palette.primary.light,
      minHeight: '56px',
      margin: theme.spacing(2, 0),
      borderRadius: theme.spacing(0.5)
    },
    retryButton: {
      marginLeft: theme.spacing(1)
    }
  });

type CreateChatroomProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  open: boolean;
  fullScreen: boolean;
  onChatroomCreate: () => void;
  onCancel: () => void;
}>;

/**
 * Dialog for creating new Chatrooms and adding users to it.
 * @param CreateChatroomProps
 */
function CreateChatroomDialog({
  classes,
  theme,
  open,
  fullScreen,
  onChatroomCreate,
  onCancel
}: CreateChatroomProps) {
  const chatApi = useChatApi();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user: loggedInUser } = useUserLogin();
  const { users, status: usersStatus, retry: retryUsers } = useFetchUsers();
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
    try {
      await chatApi.createChatroom(
        chatroomName,
        memberIds,
        loggedInUser.userId
      );
      showCreateSuccessSnackbar();
      setCreatePending(false);
      onChatroomCreate();
    } catch (err) {
      setCreateError(true);
      setCreatePending(false);
    }
  }

  function showCreateSuccessSnackbar() {
    const closeAction = (snackbarKey: string) => (
      <IconButton key="close" onClick={() => closeSnackbar(snackbarKey)}>
        <Close />
      </IconButton>
    );
    const messageFragment = <Typography>Created Chatroom!</Typography>;
    const snackbarConfig: OptionsObject = {
      variant: 'success',
      action: closeAction,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
      }
    };
    enqueueSnackbar(messageFragment, snackbarConfig);
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

  const createButtonFragment = (
    <Button
      variant="contained"
      disabled={!chatroomName || Boolean(nameErrorText) || createPending}
      onClick={handleCreateChatroom}
      color="secondary"
    >
      {createError ? 'Retry' : 'Create Chatroom'}
    </Button>
  );

  return (
    <Dialog fullWidth fullScreen={fullScreen} open={open} onClose={onCancel}>
      <DialogTitle id="browse-dialog-title">Create Chatroom</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Give your chatroom a name. You can also optionally add users to the
          chatroom.
        </DialogContentText>

        {chatroomNameFragment}

        <div className={classes.createChatroomElement}>
          {usersStatus === fetchUsersStatus.FETCHING && (
            <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
              <div className={classes.loading} />
            </Fade>
          )}

          {usersStatus === fetchUsersStatus.SUCCESS && (
            <SearchableSelect
              label="Add users to chatroom (Optional)"
              options={searchableUsers}
              selectedOptions={selectedUsers}
              onSelectedOptionsChange={handleSelectedUsersChange}
            />
          )}

          {usersStatus === fetchUsersStatus.ERROR && (
            <ErrorMessage
              errorMessage="Error: Failed to load users!"
              showError={true}
              action={
                <Button
                  color="secondary"
                  disabled={status === fetchUsersStatus.FETCHING}
                  onClick={retryUsers}
                >
                  Retry
                </Button>
              }
            />
          )}
        </div>

        <div className={classes.createChatroomElement}>
          <ErrorMessage
            errorMessage="Error: Failed to created chatroom!"
            showError={createError}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <PendingButton button={createButtonFragment} pending={createPending} />
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(CreateChatroomDialog)
);
