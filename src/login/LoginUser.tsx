import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Button,
  Fade,
  MenuItem,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';

import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import { ChatTheme, UserType } from 'src/types';

const styles = (theme: ChatTheme) => ({
  loginUserElement: {
    margin: theme.spacing(1),
    minWidth: '300px'
  },
  loading: {
    background: theme.palette.primary.main,
    minHeight: '56px',
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1)
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

function LoginUser({ classes, theme, onLogin }) {
  const [selectedUser, setSelectedUser] = useState({} as UserType);
  const { users, status, retry } = useFetchUsers();

  function handleUserSelected(event: React.ChangeEvent<{ value: any }>) {
    const user: UserType = event.target.value;
    setSelectedUser(user);
  }

  function handleLogin() {
    onLogin(selectedUser);
  }

  const loadingBar = (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <div className={classes.loading} />
    </Fade>
  );

  return (
    <>
      <Typography className={classes.loginUserElement} variant="h5">
        Login
      </Typography>
      {status === fetchUsersStatus.FETCHING && loadingBar}

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
        <Typography className={classes.loginUserElement} color="inherit">
          Hmm... I failed to load users ಠ~ಠ
          <Button
            className={classes.loginUserElement}
            color="secondary"
            disabled={status === fetchUsersStatus.FETCHING}
            onClick={retry}
          >
            Retry
          </Button>
        </Typography>
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

LoginUser.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LoginUser);
