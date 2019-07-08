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

type UsersProps = Readonly<{
  classes: any;
  selectedUser: UserType;
  onUserSelected: (user: UserType) => void;
}>;

/**
 * Displays the list of users.
 * @param UsersProps
 */
function Users({ classes, selectedUser, onUserSelected }: UsersProps) {
  const { users, status: usersStatus, retry } = useFetchUsers();
  const { user: loggedInUser } = useUserLogin();

  const loggedInUserPredicate = (user: UserType) =>
    user.userId !== loggedInUser.userId;

  // logged in user should always be at the top of the list and is always online
  const formattedUsers: UserType[] = [
    {
      ...loggedInUser,
      online: true
    },
    ...users.filter(loggedInUserPredicate)
  ];

  return (
    <>
      {usersStatus === fetchUsersStatus.FETCHING && (
        // TODO add loading placeholders
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

export default withStyles(styles, { withTheme: true })(Users);
