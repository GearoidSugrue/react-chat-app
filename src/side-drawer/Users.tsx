import PropTypes from 'prop-types';
import React from 'react';

import { Button, List, Typography, withStyles } from '@material-ui/core';

import { useUserLogin } from 'src/hooks';
import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import { ChatTheme, UserType } from 'src/types';
import User from './User';

const styles = (theme: ChatTheme) => ({
  loading: {
    margin: theme.spacing(2)
  },
  errorText: {
    margin: theme.spacing(2)
  }
});

function Users({ classes, selectedUser, onUserSelected }) {
  const { users, status: usersStatus, retry } = useFetchUsers();
  const { user: loggedInUser } = useUserLogin();

  const loggedInUserPredicate = (user: UserType) =>
    user.userId !== loggedInUser.userId;

  // logged in user should always be at the top of the list
  const formattedUsers: UserType[] = [
    loggedInUser,
    ...users.filter(loggedInUserPredicate)
  ];

  return (
    <>
      {usersStatus === fetchUsersStatus.FETCHING && (
        // todo add loading placeholders
        <Typography color="inherit" className={classes.loading}>
          Loading users...
        </Typography>
      )}

      {usersStatus === fetchUsersStatus.SUCCESS && (
        <List disablePadding={true}>
          {formattedUsers.map(user => (
            <User
              key={user.userId}
              user={user}
              loggedInUser={loggedInUser}
              isSelected={Boolean(
                selectedUser && selectedUser.userId === user.userId
              )}
              onUserSelected={onUserSelected}
            />
          ))}
        </List>
      )}

      {usersStatus === fetchUsersStatus.ERROR && (
        <Typography color="inherit" className={classes.errorText}>
          Error loading users!
          <Button color="secondary" onClick={retry}>
            Retry
          </Button>
        </Typography>
      )}
    </>
  );
}

Users.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Users);
