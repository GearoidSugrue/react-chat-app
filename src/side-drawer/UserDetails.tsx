import React, { useState } from 'react';

import {
  Button,
  MenuItem,
  MenuList,
  Popover,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import { UserAvatar } from 'src/shared';
import { ChatTheme, UserType } from 'src/types';

const styles = (theme: ChatTheme) => ({
  toolbar: {
    padding: theme.spacing(0, 2)
  },
  userBarButton: {
    width: '100%',
    justifyContent: 'space-between'
  },
  userBarElement: {
    marginLeft: theme.spacing(1)
  }
});

type UserDetailsProps = Readonly<{
  classes: any;
  user: UserType;
  onLogout: () => void;
}>;

/**
 * Displays the logged in user's username and profile and contains a menu for logging out.
 * @param UserDetailsProps
 */
function UserDetails({ classes, user, onLogout }: UserDetailsProps) {
  const { username, imageUrl } = user;
  const [userMenuElement, setUserMenuElement] = useState();
  const [menuWidth, setMenuWidth] = useState(0);

  const open = Boolean(userMenuElement);
  const id = open ? 'menu-popover' : null;

  function handleOpen(event: React.ChangeEvent<any>) {
    setUserMenuElement(event.currentTarget);
    setMenuWidth(event.currentTarget.scrollWidth);
  }

  function handleClose() {
    setUserMenuElement(null);
  }

  function handleLogout() {
    setUserMenuElement(null);
    onLogout();
  }

  return (
    <Toolbar disableGutters={true} className={classes.toolbar}>
      <Button
        aria-describedby={id}
        className={classes.userBarButton}
        onClick={handleOpen}
      >
        <UserAvatar username={username} imageUrl={imageUrl} variant="circle" />
        <Typography noWrap className={classes.userBarElement}>
          {username}
        </Typography>
        <MoreVert className={classes.userBarElement} />
      </Button>

      <Popover
        id={id}
        className={classes.userBarMenu}
        anchorEl={userMenuElement}
        open={Boolean(userMenuElement)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          style: {
            width: menuWidth
          }
        }}
      >
        <MenuList className={classes.userBarMenu}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Popover>
    </Toolbar>
  );
}

export default withStyles(styles)(UserDetails);
