import React, { useState } from 'react';

import PropTypes from 'prop-types';
// import FlexView from "react-flexview";

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import TypoGraphy from '@material-ui/core/Typography';

import useFetchUsers, { fetchUsersStatus } from '../hooks/Users.hook';
import User from './User';

// todo add css for side drawer element margins
const styles = theme => ({});

function Users({ onUserSelected }) {
  // todo perhaps useFetchRooms should be replaced with a more generic Fetch Hook?
  const { users, status: usersStatus } = useFetchUsers();

  return (
    <>
      {usersStatus === fetchUsersStatus.FETCHING && (
        // todo move css out
        <TypoGraphy color="inherit" style={{ margin: '8px' }}>
          Loading users...
        </TypoGraphy>
      )}
      {usersStatus === fetchUsersStatus.SUCCESS && (
        <List>
          {users.map(user => (
            <User
              key={user.username}
              user={user}
              onUserSelected={onUserSelected}
            />
          ))}
        </List>
      )}
      {usersStatus === fetchUsersStatus.ERROR && '// Error 0_0 ...retry is WIP'}
    </>
  );
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Users);
