import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FlexView from 'react-flexview';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import Chat from './chat/Chat';
import LoginPage from './login/LoginPage';
import ChatSideDrawer from './side-drawer/ChatSideDrawer';

import UserDetails from './side-drawer/UserDetails';
import Chatrooms from './side-drawer/Chatrooms';
import Users from './side-drawer/Users';

import { useChatApi } from './chat-api/ChatApiContext';

const styles = theme => ({
  root: {
    display: 'flex'
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
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [selectedChatroom, setChatroom] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // todo this should be replace with something better
  useEffect(
    function joinChat() {
      console.log('joinChat effect', username, selectedChatroom);

      chatApi.joinChatroom({ chatroom: selectedChatroom, username });

      return function leaveChat() {
        chatApi.leaveChatroom({ chatroom: selectedChatroom, username });
      };
    },
    [chatApi, selectedChatroom, username]
  );

  useEffect(
    function closeMobileDrawerOnSelection() {
      setMobileDrawerOpen(false);
    },
    [setMobileDrawerOpen, selectedChatroom, selectedUser]
  );

  function handleLogin({ username }) {
    chatApi.login({ username });
    setIsLoggedIn(true);
    setUsername(username);
  }

  function handleLogout() {
    chatApi.logout({ username });
    setIsLoggedIn(false);
    setUsername('');
    setChatroom('');
    setSelectedUser('');
  }

  function handleChatroomSelected(selectedChatroom) {
    setChatroom(selectedChatroom);
    setSelectedUser('');
  }

  function handleUserSelected(user) {
    setSelectedUser(user);
    setChatroom('');
  }

  function handleSideDrawerToggle() {
    setMobileDrawerOpen(!mobileDrawerOpen);
  }

  const userDetailsFragment = (
    <UserDetails username={username} onLogout={handleLogout} />
  );
  const roomsFragment = (
    <Chatrooms
      selectedChatroom={selectedChatroom}
      onChatroomSelected={handleChatroomSelected}
    />
  );
  const usersFragment = (
    <Users selectedUser={selectedUser} onUserSelected={handleUserSelected} />
  );

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
    <FlexView column grow width="100%" height="100vh">
      <ChatSideDrawer
        userBar={userDetailsFragment}
        chatrooms={roomsFragment}
        users={usersFragment}
        isLoggedIn={isLoggedIn}
        mobileDrawerOpen={mobileDrawerOpen}
        onMobileDrawerToggle={handleSideDrawerToggle}
      />

      <AppBar position="relative" className={appBarClasses}>
        <Toolbar>
          <IconButton
            className={sideDrawerButtonClasses}
            onClick={handleSideDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <TypoGraphy variant="h5" color="inherit" noWrap>
            {selectedChatroom || selectedUser.username || 'Group Chat'}
          </TypoGraphy>
        </Toolbar>
      </AppBar>

      <FlexView column grow className={mainContentClasses}>
        {isLoggedIn && (
          <Chat
            username={username}
            chatroom={selectedChatroom}
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
