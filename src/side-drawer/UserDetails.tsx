import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
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
import clsx from 'clsx';

const styles = (theme: Theme) => ({
  toolbar: {
    padding: theme.spacing(1, 2)
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
  },
  loading: {
    background: theme.palette.primary.main
  }
});

function UserDetails({ classes, username, onLogout }) {
  const [userMenuElement, setUserMenuElement] = useState();

  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const handleLogout = () => {
    setUserMenuElement(null);
    onLogout();
  };

  const avatarClasses = clsx(!isAvatarLoaded && classes.loading);

  const handleAvatarLoaded = () => {
    console.log('handleAvatarLoaded');
    setIsAvatarLoaded(true);
  };

  return (
    <Toolbar disableGutters={true} className={classes.toolbar}>
      <Button
        className={classes.userBarButton}
        onClick={event => setUserMenuElement(event.currentTarget)}
      >
        {/* make avatar it's own comp/hook?*/}
        {username && (
          <Avatar
            className={avatarClasses}
            src={`https://api.adorable.io/avatars/36/${username}.png`}
            onLoad={handleAvatarLoaded}
            style={{ borderRadius: '25%' }}
          />
        )}
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
