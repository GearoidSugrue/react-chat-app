import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Fade, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { Theme, withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import useFetchUsers, { fetchUsersStatus } from 'src/hooks/Users.hook';
import { UserType } from 'src/types/User.type';

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
    minWidth: '120px',
    minHeight: '56px'
  },
  usersSelect: {
    minHeight: '19px' // + padding = 56px
  }
});

function LoginUser({ classes, onLogin }) {
  const [selectedUser, setSelectedUser] = useState({} as UserType);
  const { users, status, retry } = useFetchUsers();

  const handleUserSelected = (event: React.ChangeEvent<{ value: any }>) =>
    setSelectedUser(event.target.value as UserType);

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
                <MenuItem key={user.username} value={user}>
                  {user.username}
                </MenuItem>
              ))}
          </TextField>
        </Fade>
      )}

      {status === fetchUsersStatus.ERROR && (
        <TypoGraphy className={classes.loginUserElement} color="inherit">
          Hmm... I failed to load users ಠ~ಠ
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
