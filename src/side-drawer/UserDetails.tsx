import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { Theme, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import MoreVert from '@material-ui/icons/MoreVert';

import UserAvatar from './UserAvatar';

const styles = (theme: Theme) => ({
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

function UserDetails({ classes, username, onLogout }) {
  const [userMenuElement, setUserMenuElement] = useState();
  const [menuWidth, setMenuWidth] = useState(0);

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

  const open = Boolean(userMenuElement);
  const id = open ? 'menu-popover' : null;

  return (
    <Toolbar disableGutters={true} className={classes.toolbar}>
      <Button
        aria-describedby={id}
        className={classes.userBarButton}
        onClick={handleOpen}
      >
        <UserAvatar username={username} />
        <TypoGraphy noWrap className={classes.userBarElement}>
          {username}
        </TypoGraphy>
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

UserDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserDetails);
