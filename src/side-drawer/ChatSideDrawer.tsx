import React, { useState } from 'react';

import {
  createStyles,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Typography,
  withStyles
} from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

import { useUserLogin } from 'src/hooks';
import { ChatroomType, ChatTheme, UserType } from 'src/types';
import Chatrooms from './Chatrooms';
import CreateChatroomDialog from './create-chatroom/CreateChatroomDialog';
import UserDetails from './UserDetails';
import Users from './Users';

const styles = (theme: ChatTheme) =>
  createStyles({
    sideDrawerFragment: {
      padding: theme.spacing(2, 0, 1, 0)
    },
    chatroomsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 500,
      padding: theme.spacing(1, 2),
      textTransform: 'uppercase',
      letterSpacing: '0.01px'
    },
    directMessageHeader: {
      fontWeight: 500,
      padding: theme.spacing(1, 2),
      textTransform: 'uppercase',
      letterSpacing: '0.01px'
    },
    drawer: {
      width: theme.sideDrawer.width,
      boxShadow: '0 65px 4px -1px black'
    }
  });

type ChatSideDrawerProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  selectedChatroom: ChatroomType;
  selectedUser: UserType;
  mobileDrawerOpen: boolean;
  onLogout: () => void;
  onChatroomSelected: (chatroom: ChatroomType) => void;
  onUserSelected: (user: UserType) => void;
  onMobileDrawerToggle: () => void;
}>;

/**
 * A container component that encapsulates the use details bar, chatroom list and users list.
 * It contains fragments for small screen and large screen devices.
 * @param ChatSideDrawerProps
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
}: ChatSideDrawerProps) {
  const { user, isLoggedIn } = useUserLogin();
  const { username } = user;
  const [createChatroomOpen, setCreateChatroomOpen] = useState(false);

  function handleOpenCreateChatroom() {
    setCreateChatroomOpen(true);
  }

  function handleChatroomCreated() {
    setCreateChatroomOpen(false);
  }

  function handleCancelCreateChatroom() {
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
        <Chatrooms
          selectedChatroom={selectedChatroom}
          onChatroomSelected={onChatroomSelected}
        />
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
        <CreateChatroomDialog
          open={createChatroomOpen}
          onChatroomCreate={handleChatroomCreated}
          onCancel={handleCancelCreateChatroom}
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
          elevation={12}
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
          elevation={12}
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

export default withStyles(styles, { withTheme: true })(ChatSideDrawer);
