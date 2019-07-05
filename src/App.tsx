import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import FlexView from 'react-flexview';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { useChatApi } from 'src/chat-api';
import Chat from 'src/chat/Chat';
import { useUserLogin } from 'src/hooks';
import LoginPage from 'src/login/LoginPage';
import ChatSideDrawer from 'src/side-drawer/ChatSideDrawer';
import { ChatroomType, ChatTheme, UserType } from 'src/types';

const styles = (theme: ChatTheme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),

    // small screens won't show a side drawer so no need for a left margin on the toolbar
    marginLeft: 0,

    // adds a left margin to the toolbar so the side drawer doesn't overlap it
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${theme.sideDrawer.width})`,
      marginLeft: theme.sideDrawer.width
    }
  },
  menuButton: {
    marginRight: 20,

    // only very small screens need to toggle the side drawer so the menu button will be hidden on larger devices
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  hide: {
    display: 'none'
  },
  // todo delete if scrolling works as expected
  // drawerHeader: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   padding: '0 8px',
  //   ...theme.mixins.toolbar,
  //   justifyContent: 'flex-end',
  // },
  content: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),

    // side drawer is not displayed on very small devices so no need for a left margin on the main content
    marginLeft: 0,

    // adds a left margin to the main content so the side drawer doesn't overlap it
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.sideDrawer.width
    }
  }
});

function App({ classes }) {
  const chatApi = useChatApi();
  const { user, isLoggedIn } = useUserLogin();
  const { username, userId } = user;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedChatroom, setChatroom] = useState({} as ChatroomType);
  const [selectedUser, setSelectedUser] = useState({} as UserType);

  useEffect(
    function closeMobileDrawerOnSelection() {
      setMobileDrawerOpen(false);
    },
    [setMobileDrawerOpen, selectedChatroom, selectedUser]
  );

  function handleLogin(userLoggingIn: UserType) {
    chatApi.login(userLoggingIn);
  }

  function handleLogout() {
    chatApi.logout();
    setChatroom({} as ChatroomType);
    setSelectedUser({} as UserType);
  }

  function handleChatroomSelected(chatroom: ChatroomType) {
    console.log('chatroom selected', chatroom);
    setChatroom(chatroom);
    setSelectedUser({} as UserType);
  }

  function handleUserSelected(newlySelectedUser: UserType) {
    console.log('handleUserSelected', newlySelectedUser);
    setSelectedUser(newlySelectedUser);
    setChatroom({} as ChatroomType);
  }

  function handleSideDrawerToggle() {
    setMobileDrawerOpen(!mobileDrawerOpen);
  }

  const appBarClasses = clsx(classes.appBar, isLoggedIn && classes.appBarShift);
  const sideDrawerButtonClasses = clsx(
    classes.menuButton,
    !isLoggedIn && classes.hide
  );
  const mainContentClasses = clsx(
    classes.content,
    isLoggedIn && classes.contentShift
  );

  return (
    <FlexView column grow width="100%" height="100vh" className={classes.root}>
      <ChatSideDrawer
        selectedChatroom={selectedChatroom}
        selectedUser={selectedUser}
        mobileDrawerOpen={mobileDrawerOpen}
        onLogout={handleLogout}
        onChatroomSelected={handleChatroomSelected}
        onUserSelected={handleUserSelected}
        onMobileDrawerToggle={handleSideDrawerToggle}
      />

      <AppBar position="relative" className={appBarClasses}>
        <Toolbar>
          <IconButton
            className={sideDrawerButtonClasses}
            onClick={handleSideDrawerToggle}
          >
            <Menu />
          </IconButton>
          <Typography variant="h5" color="inherit" noWrap>
            {selectedChatroom.name
              ? `# ${selectedChatroom.name}`
              : selectedUser.username || 'Group Chat'}
          </Typography>
        </Toolbar>
      </AppBar>

      <FlexView column grow className={mainContentClasses}>
        {isLoggedIn && (
          <Chat
            userId={userId}
            username={username}
            selectedChatroom={selectedChatroom}
            selectedUser={selectedUser}
          />
        )}
        {!isLoggedIn && <LoginPage onLogin={handleLogin} />}
      </FlexView>
    </FlexView>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
