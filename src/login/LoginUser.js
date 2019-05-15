
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TypoGraphy from '@material-ui/core/Typography';

import useFetchUsers, { fetchUsersStatus } from '../hooks/FetchUsers.hook'

const styles = theme => ({
  // todo move inline css here
});

function LoginUser({ onLogin }) {
  const [selectedUser, setSelectedUser] = useState('');

  const { users, status, retry, retryCount } = useFetchUsers();

  return (
    <>
      <TypoGraphy variant="h5" style={{ margin: '8px' }}>
        Select a user
      </TypoGraphy>

      {
        status === fetchUsersStatus.FETCHING &&
        <TypoGraphy color="inherit" style={{ margin: '8px' }}>
          Loading users...

          // todo something different here?
        </TypoGraphy>
      }
      {
        status === fetchUsersStatus.SUCCESS &&
        <FormControl style={{
          margin: '8px',
          minWidth: '120px'
        }}>
          <InputLabel htmlFor="filled-users-select">Users</InputLabel>
          <Select
            // style={{ margin: '8px' }}
            value={selectedUser}
            onChange={event => setSelectedUser(event.target.value)}
            inputProps={{
              name: 'users',
              id: 'filled-users-select',
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {
              users.filter(user => !user.online).map(user => (<MenuItem value={user.username}>{user.username}</MenuItem>))
            }
          </Select>
        </FormControl>
      }
      {
        status === fetchUsersStatus.ERROR &&
        <TypoGraphy color="inherit" style={{ margin: '8px' }}>
          {retryCount < 3 ? 'Hmm... I failed to load users ಠ~ಠ' : 'Well this is embarrassing... ⊙﹏⊙'}

          <Button
            style={{ margin: '8px' }}
            color="secondary"
            disabled={status === fetchUsersStatus.FETCHING}
            onClick={retry}
          >
            Retry
          </Button>
        </TypoGraphy>
      }
      <Button
        style={{ margin: '8px' }}
        color="secondary"
        variant="contained"
        disabled={!selectedUser}
        onClick={() => onLogin({ username: selectedUser })}
      >
        Login
      </Button>
    </>
  )
}

LoginUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginUser);