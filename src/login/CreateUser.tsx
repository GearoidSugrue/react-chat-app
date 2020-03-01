import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  createStyles,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  withStyles
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import { useChatApi } from 'src/chat-api';
import { ErrorMessage, PendingButton } from 'src/shared';
import { ChatTheme, UserType } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    createUserElement: {
      margin: theme.spacing(1),
      minWidth: '320px'
    },
    inputLabel: {
      margin: theme.spacing(1)
    },
    createUserButton: {
      minWidth: '320px'
    },
    clearButton: {
      marginRight: '-10px'
    }
  });

type CreateUserProps = Readonly<{
  classes: any;
  onCreateUser: (username: UserType) => void;
}>;

/**
 * A component for creating new users.
 * @param CreateUserProps
 */
function CreateUser({ classes, onCreateUser }: CreateUserProps) {
  const chatApi = useChatApi();
  const [username, setUsername] = useState('');
  const [createUserPending, setCreateUserPending] = useState(false);
  const [createUserError, setCreateUserError] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = useRef(null);

  useEffect(function setUsernameLabelWidth() {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  function handleUsernameChange(event: React.ChangeEvent<{ value: string }>) {
    setUsername(event.target.value);
  }

  function handleClearUsername() {
    setUsername('');
  }

  async function handleCreateUser() {
    setCreateUserPending(true);
    try {
      const user = await chatApi.createUser(username);
      setCreateUserPending(false);
      setCreateUserError(false);
      onCreateUser(user);
    } catch (error) {
      setCreateUserPending(false);
      setCreateUserError(true);
    }
  }

  const createUserButtonFragment = (
    <Button
      className={classes.createUserButton}
      color="secondary"
      variant="contained"
      disabled={!username || createUserPending}
      onClick={handleCreateUser}
    >
      {createUserError ? 'Retry' : 'Create User'}
    </Button>
  );

  return (
    <>
      <Typography
        className={classes.createUserElement}
        variant="h5"
        color="inherit"
      >
        Create New Guest User
      </Typography>

      <FormControl variant="outlined">
        <InputLabel
          className={classes.inputLabel}
          ref={labelRef}
          htmlFor="username-input"
        >
          Username
        </InputLabel>
        <OutlinedInput
          className={classes.createUserElement}
          id="username-input"
          autoComplete="off"
          autoFocus={true}
          value={username}
          onChange={handleUsernameChange}
          labelWidth={labelWidth}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                className={classes.clearButton}
                onClick={handleClearUsername}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      {createUserError && (
        <div className={classes.createUserElement}>
          <ErrorMessage
            errorMessage="Error: Failed to create user!"
            showError={createUserError}
          />
        </div>
      )}

      <PendingButton
        button={createUserButtonFragment}
        pending={createUserPending}
      />
    </>
  );
}

export default withStyles(styles, { withTheme: true })(CreateUser);
