import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Typography,
  withStyles
} from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

import { useUserLogin } from 'src/hooks';
import { ChatTheme } from 'src/types';
import Chatrooms from './Chatrooms';
import CreateChatroom from './create-chatroom/CreateChatroom';
import UserDetails from './UserDetails';
import Users from './Users';

const styles = (theme: ChatTheme) => ({
  sideDrawerFragment: {
    padding: theme.spacing(2, 0, 1, 0)
  },
  chatroomsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 500,
    padding: theme.spacing(1, 2)
  },
  directMessageHeader: {
    fontWeight: 500,
    padding: theme.spacing(1, 2)
  },
  drawer: {
    width: theme.sideDrawer.width
  }
});

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
  const [createChatroomOpen, setCreateChatroomOpen] = useState(false);

  function handleOpenCreateChatroom() {
    setCreateChatroomOpen(true);
  }

  function handleCloseCreateChatroom() {
    setCreateChatroomOpen(false);
  }

  const chatroomsFragment = (
    <div className={classes.sideDrawerFragment}>
      <Typography noWrap color="inherit" className={classes.chatroomsHeader}>
        Chatrooms
        <IconButton edge="end" size="small" onClick={handleOpenCreateChatroom}>
          <AddCircleOutline fontSize="small" />
        </IconButton>
      </Typography>

      {isLoggedIn && (
        <>
          <Chatrooms
            selectedChatroom={selectedChatroom}
            onChatroomSelected={onChatroomSelected}
          />
        </>
      )}
    </div>
  );

  const usersFragment = (
    <div className={classes.sideDrawerFragment}>
      <Typography
        noWrap
        color="inherit"
        className={classes.directMessageHeader}
      >
        Direct Message
      </Typography>
      {isLoggedIn && (
        <Users selectedUser={selectedUser} onUserSelected={onUserSelected} />
      )}
    </div>
  );

  const sideDrawerFragment = (
    <div>
      <UserDetails username={username} onLogout={onLogout} />
      <Divider />

      {chatroomsFragment}
      <Divider />
      {usersFragment}

      {createChatroomOpen && (
        <CreateChatroom
          open={createChatroomOpen}
          onClose={handleCloseCreateChatroom}
        />
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
          {sideDrawerFragment}
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
          {sideDrawerFragment}
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
