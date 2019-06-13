import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Fade, OutlinedInput } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Theme, withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import useFetchUsers, { fetchUsersStatus } from 'src/hooks/Users.hook';
import { User } from 'src/types/User.type';

const styles = (theme: Theme) => ({
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
    minWidth: '120px'
  },
  usersSelect: {
    minHeight: '56px'
  }
});

function LoginUser({ classes, onLogin }) {
  const [selectedUser, setSelectedUser] = useState({} as User);

  const { users, status, retry, retryCount } = useFetchUsers();

  const handleUserSelected = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => setSelectedUser(event.target.value as User);

  const loadingBar = (
    <Fade in={true} timeout={600}>
      <div className={classes.loading} />
    </Fade>
  );

  return (
    <>
      <TypoGraphy className={classes.loginUserElement} variant="h5">
        Login
      </TypoGraphy>

      {status === fetchUsersStatus.FETCHING && loadingBar}

      {status === fetchUsersStatus.SUCCESS && (
        <Fade in={true} timeout={300}>
          <FormControl className={classes.usersSelectBox} variant="outlined">
            <InputLabel htmlFor="users-select">Users</InputLabel>
            <Select
              className={classes.usersSelect}
              id="users-select"
              autoFocus={true}
              value={selectedUser}
              onChange={handleUserSelected}
              input={
                <OutlinedInput labelWidth={42} name="users" id="users-select" />
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {users
                .filter(user => !user.online)
                .map(user => (
                  <MenuItem key={user.username} value={user}>
                    {user.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Fade>
      )}

      {status === fetchUsersStatus.ERROR && (
        <TypoGraphy className={classes.loginUserElement} color="inherit">
          {retryCount < 3
            ? 'Hmm... I failed to load users ಠ~ಠ'
            : 'Well this is embarrassing... ⊙﹏⊙'}

          <Button
            className={classes.loginUserElement}
            color="secondary"
            disabled={status === fetchUsersStatus.FETCHING}
            onClick={retry}
          >
            Retry
          </Button>
        </TypoGraphy>
      )}
      <Button
        className={classes.loginUserElement}
        color="secondary"
        variant="contained"
        disabled={!selectedUser.userId}
        onClick={() => onLogin(selectedUser)}
      >
        Login
      </Button>
    </>
  );
}

LoginUser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginUser);
