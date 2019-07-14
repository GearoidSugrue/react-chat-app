import React from 'react';

import { Button, List, withStyles } from '@material-ui/core';

import { useUserLogin } from 'src/hooks';
import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import { VerticalErrorMessage } from 'src/shared';
import { UserType } from 'src/types';
import { UserPlaceholders } from './placeholders';
import User from './User';

const styles = () => ({});

type UsersProps = Readonly<{
  selectedUser: UserType;
  onUserSelected: (user: UserType) => void;
}>;

/**
 * Displays the list of users.
 * @param UsersProps
 */
function Users({ selectedUser, onUserSelected }: UsersProps) {
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
        <UserPlaceholders placeholderCount={10} />
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
        <VerticalErrorMessage
          errorMessage="Failed to load users!"
          showError={true}
          action={
            <Button color="secondary" onClick={retry}>
              Retry
            </Button>
          }
        />
      )}
    </>
  );
}

export default withStyles(styles)(Users);
