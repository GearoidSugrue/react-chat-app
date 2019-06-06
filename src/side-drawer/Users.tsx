import { Button } from '@material-ui/core';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

import useFetchUsers, { fetchUsersStatus } from '../hooks/Users.hook';
import User from './User';

const styles = theme => ({
  loading: {
    margin: theme.spacing(2)
  },
  errorText: {
    margin: theme.spacing(2)
  }
});

function Users({ classes, selectedUser, onUserSelected }) {
  const { users, status: usersStatus, retry } = useFetchUsers();

  return (
    <>
      {usersStatus === fetchUsersStatus.FETCHING && (
        // todo add loading placeholders
        <TypoGraphy color="inherit" className={classes.loading}>
          Loading users...
        </TypoGraphy>
      )}
      {usersStatus === fetchUsersStatus.SUCCESS && (
        <List>
          {users.map(user => (
            <User
              key={user.username}
              user={user}
              isSelected={Boolean(
                selectedUser && user.username === selectedUser.username
              )}
              onUserSelected={onUserSelected}
            />
          ))}
        </List>
      )}
      {usersStatus === fetchUsersStatus.ERROR && (
        <TypoGraphy color="inherit" className={classes.errorText}>
          Error loading users!
          <Button color="secondary" onClick={retry}>
            Retry
          </Button>
        </TypoGraphy>
      )}
    </>
  );
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Users);
