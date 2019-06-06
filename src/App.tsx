import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import FlexView from 'react-flexview';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import Chat from './chat/Chat';
import LoginPage from './login/LoginPage';
import ChatSideDrawer from './side-drawer/ChatSideDrawer';

import Chatrooms from './side-drawer/Chatrooms';
import UserDetails from './side-drawer/UserDetails';
import Users from './side-drawer/Users';

import { useChatApi } from './chat-api/ChatApiContext';
import { Chatroom } from './types/Chatroom.type';
import { User } from './types/User.type';

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

  // todo maybe combine username, userId, loggedIn into one or two custom hooks?
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [selectedChatroom, setChatroom] = useState({} as Chatroom);
  const [selectedUser, setSelectedUser] = useState({} as User);

  // const { selectedUser, selectedChatroom } = useSelectedRecpricant()

  // todo this should be replace with something better
  useEffect(
    function joinChat() {
      console.log('joinChat effect', userId, selectedChatroom);

      chatApi.joinChatroom({ chatroomId: selectedChatroom.chatroomId, userId });

      return function leaveChat() {
        chatApi.leaveChatroom({
          chatroomId: selectedChatroom.chatroomId,
          userId
        });
      };
    },
    [chatApi, selectedChatroom, userId]
  );

  useEffect(
    function closeMobileDrawerOnSelection() {
      setMobileDrawerOpen(false);
    },
    [setMobileDrawerOpen, selectedChatroom, selectedUser]
  );

  function handleLogin(user: User) {
    chatApi.login({ userId: user.userId });
    setIsLoggedIn(true);
    setUserId(user.userId);
    setUsername(user.username);
  }

  function handleLogout() {
    chatApi.logout();
    setIsLoggedIn(false);
    setUserId('');
    setUsername('');
    setChatroom({} as Chatroom);
    setSelectedUser({} as User);
  }

  function handleChatroomSelected(chatroom: Chatroom) {
    console.log('chatroom selected', chatroom);
    setChatroom(chatroom);
    setSelectedUser({} as User);
  }

  function handleUserSelected(user: User) {
    setSelectedUser(user);
    setChatroom({} as Chatroom);
  }

  function handleSideDrawerToggle() {
    setMobileDrawerOpen(!mobileDrawerOpen);
  }

  // todo can these be back into ChatSideDrawer? useLoggedInUser?
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
            {selectedChatroom.name || selectedUser.username || 'Group Chat'}
          </TypoGraphy>
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
