import { Button } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Theme, withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

import useUserLogin from 'src/hooks/UserLogin.hook';
import useFetchUsers, { fetchUsersStatus } from 'src/hooks/Users.hook';
import * as UserType from 'src/types/User.type';
import User from './User';

const styles = (theme: Theme) => ({
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

  const loggedInUserPredicate = (user: UserType.User) =>
    user.userId !== loggedInUser.userId;

  // logged in user should always be at the top of the list
  const formattedUsers: UserType.User[] = [
    loggedInUser,
    ...users.filter(loggedInUserPredicate)
  ];

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
