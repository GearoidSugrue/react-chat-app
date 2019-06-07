import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import { User } from 'src/types/User.type';
import useFetchUsers, { fetchUsersStatus } from '../hooks/Users.hook';

const styles = theme => ({
  // todo move inline css here
});

function LoginUser({ classes, onLogin }) {
  const [selectedUser, setSelectedUser] = useState({} as User);

  const { users, status, retry, retryCount } = useFetchUsers();

  const handleUserSelected = event =>
    setSelectedUser(event.target.value as User);

  return (
    <>
      <TypoGraphy variant="h5" style={{ margin: '8px' }}>
        Select a user
      </TypoGraphy>

      {status === fetchUsersStatus.FETCHING && (
        <TypoGraphy color="inherit" style={{ margin: '8px' }}>
          Loading users...
        </TypoGraphy>
      )}

      {status === fetchUsersStatus.SUCCESS && (
        <FormControl
          style={{
            margin: '8px',
            minWidth: '120px'
          }}
        >
          <InputLabel htmlFor="filled-users-select">Users</InputLabel>
          <Select
            // style={{ margin: '8px' }}
            value={selectedUser}
            onChange={handleUserSelected}
            inputProps={{
              name: 'users',
              id: 'filled-users-select'
            }}
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
      )}

      {status === fetchUsersStatus.ERROR && (
        <TypoGraphy color="inherit" style={{ margin: '8px' }}>
          {retryCount < 3
            ? 'Hmm... I failed to load users ಠ~ಠ'
            : 'Well this is embarrassing... ⊙﹏⊙'}

          <Button
            style={{ margin: '8px' }}
            color="secondary"
            disabled={status === fetchUsersStatus.FETCHING}
            onClick={retry}
          >
            Retry
          </Button>
        </TypoGraphy>
      )}
      <Button
        style={{ margin: '8px' }}
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
