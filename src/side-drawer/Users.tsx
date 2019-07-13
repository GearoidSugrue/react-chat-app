import React from 'react';
import FlexView from 'react-flexview/lib';

import {
  Button,
  Fade,
  List,
  ListItem,
  TextField,
  withStyles
} from '@material-ui/core';
import { Error } from '@material-ui/icons';

import { useUserLogin } from 'src/hooks';
import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import { ChatTheme, UserType } from 'src/types';
import User from './User';

const PLACEHOLDER_COUNT = 4;

const styles = (theme: ChatTheme) => ({
  loading: {
    width: '66%',
    height: theme.typography.fontSize,
    background: theme.palette.primary.light,
    borderRadius: theme.spacing(0.5)
  },
  loadingPlaceholder: {
    minHeight: '48px'
  },
  errorElement: {
    margin: theme.spacing(1, 2)
  }
});

type UsersProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  selectedUser: UserType;
  onUserSelected: (user: UserType) => void;
}>;

/**
 * Displays the list of users.
 * @param UsersProps
 */
function Users({ classes, theme, selectedUser, onUserSelected }: UsersProps) {
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
        <Fade in={true} timeout={1000}>
          <List disablePadding={true}>
            {[...Array(PLACEHOLDER_COUNT)].map((_, index) => (
              <ListItem
                button
                key={index}
                className={classes.loadingPlaceholder}
              >
                <div className={classes.loading} />
              </ListItem>
            ))}
          </List>
        </Fade>
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
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <FlexView column vAlignContent="center" hAlignContent="center">
            <Error color="error" className={classes.errorElement} />
            <TextField
              error
              variant="outlined"
              id="error-loading-users"
              value="Failed to load users!"
              inputProps={{
                readOnly: true,
                disabled: true
              }}
            />
            <Button
              color="secondary"
              className={classes.errorElement}
              onClick={retry}
            >
              Retry
            </Button>
          </FlexView>
        </Fade>
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(Users);
