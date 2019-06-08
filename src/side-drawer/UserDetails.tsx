import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
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
  },
  userBarMenu: {
    width: '100%'
  }
});

function UserDetails({ classes, username, onLogout }) {
  const [userMenuElement, setUserMenuElement] = useState();

  const handleLogout = () => {
    setUserMenuElement(null);
    onLogout();
  };

  return (
    <Toolbar disableGutters={true} className={classes.toolbar}>
      <Button
        className={classes.userBarButton}
        onClick={event => setUserMenuElement(event.currentTarget)}
      >
        <UserAvatar username={username} />
        <TypoGraphy noWrap className={classes.userBarElement}>
          {username}
        </TypoGraphy>
        <MoreVert className={classes.userBarElement} />

        <Popper
          transition
          disablePortal
          anchorEl={userMenuElement}
          className={classes.userBarMenu}
          open={Boolean(userMenuElement)}
          placement="bottom-start"
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={() => setUserMenuElement(null)}>
                  <MenuList>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Button>
    </Toolbar>
  );
}

UserDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserDetails);
