import clsx from 'clsx';
import React, { useState } from 'react';

import {
  Button,
  createStyles,
  Fade,
  MenuItem,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';

import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import { ErrorMessage } from 'src/shared';
import { ChatTheme, UserType } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    loginUserElement: {
      margin: theme.spacing(1),
      minWidth: '320px'
    },
    loadUsersFailedContainer: {
      minHeight: '56px'
    },
    retryButton: {
      marginLeft: theme.spacing(1)
    },
    loading: {
      background: theme.palette.primary.light,
      minHeight: '56px',
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.5)
    },
    usersSelectBox: {
      margin: theme.spacing(1),
      minWidth: '120px',
      minHeight: '56px'
    },
    usersSelect: {
      minHeight: '19px' // + padding = 56px which is the same as the min-height of it's parent
    }
  });

type LoginUserProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  onLogin: (user: UserType) => void;
}>;

/**
 * A component for user login.
 * @param LoginUserProps
 */
function LoginUser({ classes, theme, onLogin }: LoginUserProps) {
  const [selectedUser, setSelectedUser] = useState({} as UserType);
  const { users, status, retry } = useFetchUsers();

  function handleUserSelected(event: React.ChangeEvent<{ value: any }>) {
    const user: UserType = event.target.value;
    setSelectedUser(user);
  }

  function handleLogin() {
    onLogin(selectedUser);
  }

  const loadingBarFragment = (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <div className={classes.loading} />
    </Fade>
  );

  const loadErrorClasses = clsx(
    classes.loginUserElement,
    classes.loadUsersFailedContainer
  );

  return (
    <>
      <Typography className={classes.loginUserElement} variant="h5">
        Login
      </Typography>
      {status === fetchUsersStatus.FETCHING && loadingBarFragment}

      {status === fetchUsersStatus.SUCCESS && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <TextField
            select
            className={classes.usersSelectBox}
            id="users-select"
            variant="outlined"
            label="Users"
            autoFocus={true}
            value={selectedUser}
            onChange={handleUserSelected}
            InputProps={{ classes: { input: classes.usersSelect } }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {users
              .filter(user => !user.online)
              .map(user => (
                <MenuItem key={user.username} value={user as any}>
                  {user.username}
                </MenuItem>
              ))}
          </TextField>
        </Fade>
      )}

      {status === fetchUsersStatus.ERROR && (
        <div className={loadErrorClasses}>
          <ErrorMessage
            errorMessage="Error: Failed to load users!"
            showError={true}
            action={
              <Button
                className={classes.retryButton}
                color="secondary"
                disabled={status === fetchUsersStatus.FETCHING}
                onClick={retry}
              >
                Retry
              </Button>
            }
          />
        </div>
      )}

      <Button
        className={classes.loginUserElement}
        color="secondary"
        variant="contained"
        disabled={!selectedUser.userId}
        onClick={handleLogin}
      >
        Login
      </Button>
    </>
  );
}

export default withStyles(styles, { withTheme: true })(LoginUser);
