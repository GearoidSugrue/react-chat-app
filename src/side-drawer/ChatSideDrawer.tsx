import PropTypes from 'prop-types';
import React from 'react';

import {
  Divider,
  Drawer,
  Hidden,
  Typography,
  withStyles
} from '@material-ui/core';

import { useUserLogin } from 'src/hooks';
import { ChatTheme } from 'src/types';
import Chatrooms from './Chatrooms';
import UserDetails from './UserDetails';
import Users from './Users';

const styles = (theme: ChatTheme) => ({
  joinChatroomButton: {
    margin: theme.spacing(1, 2)
  },
  drawer: {
    width: theme.sideDrawer.width
  },
  header: {
    fontWeight: 500,
    padding: theme.spacing(1, 2)
  }
});

/**
 * ChatSideDrawer uses inversion of control to provide the user details, chatrooms and users.
 * This pushes complexity out to the parent component but it simplifies this one.
 * ChatSideDrawer is already complicated enough with it's different screen size shenanigans so it's a worthwhile trade.
 */
function ChatSideDrawer({
  classes,
  theme,
  selectedChatroom,
  selectedUser,
  mobileDrawerOpen,
  onLogout,
  onChatroomSelected,
  onUserSelected,
  onMobileDrawerToggle
}) {
  const { user, isLoggedIn } = useUserLogin();
  const { username } = user;

  const sideDrawer = (
    <div>
      <UserDetails username={username} onLogout={onLogout} />
      <Divider />

      {/* todo stop being lazy and do upper-case transform in css */}
      <Typography noWrap color="inherit" className={classes.header}>
        CHATROOMS
      </Typography>

      {isLoggedIn && (
        <>
          <Chatrooms
            selectedChatroom={selectedChatroom}
            onChatroomSelected={onChatroomSelected}
          />
        </>
      )}
      <Divider />

      <Typography noWrap color="inherit" className={classes.header}>
        DIRECT MESSAGE
      </Typography>
      {isLoggedIn && (
        <Users selectedUser={selectedUser} onUserSelected={onUserSelected} />
      )}
    </div>
  );

  return (
    <>
      {/* todo: investigate material ui useMediaQuery. May not change dynamically tho...*/}
      <Hidden smUp implementation="js">
        {/* 
          todo: investigate if triggering slide out animation can be delayed a 100ms or so. 
          This would give the drawer a chance to start loading data and rendering and then start sliding rather than doing it all at once.
        */}
        <Drawer
          classes={{
            paper: classes.drawer
          }}
          variant="temporary"
          transitionDuration={{
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen
          }}
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileDrawerOpen && isLoggedIn}
          onClose={onMobileDrawerToggle}
        >
          {sideDrawer}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="js">
        <Drawer
          classes={{
            paper: classes.drawer
          }}
          variant="persistent"
          transitionDuration={{
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen
          }}
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={isLoggedIn}
        >
          {sideDrawer}
        </Drawer>
      </Hidden>
    </>
  );
}

ChatSideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ChatSideDrawer);
