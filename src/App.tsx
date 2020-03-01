import clsx from 'clsx';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';
import FlexView from 'react-flexview';
// @ts-ignore - https://github.com/anthonyjgrove/react-google-login/issues/303
import { useGoogleLogout } from 'react-google-login';

import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { amber } from '@material-ui/core/colors';
import { Menu } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';

import { Chat, ChatroomMembersToolbar } from 'src/chat';
import { useChatApi } from 'src/chat-api';
import { useUserLogin } from 'src/hooks';
import { LoginPage } from 'src/login';
import { ChatSideDrawer } from 'src/side-drawer';
import { ChatroomType, ChatTheme, UserType } from 'src/types';

const CLIENT_ID: string =
  '846000660038-gd5uokfllcrj421o1c9e2dh3qd0edcsb.apps.googleusercontent.com';

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
  mainToolbar: {
    boxShadow: '0 0 4px -1px black'
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
  // TODO delete if scrolling works as expected
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
  },
  snackbarSuccess: {
    backgroundColor: theme.chatColors.success,
    color: theme.palette.secondary.contrastText
  },
  snackbarError: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.secondary.contrastText
  },
  snackbarWarning: {
    backgroundColor: amber[700], // TODO add this to ChatTheme
    color: theme.palette.secondary.contrastText
  },
  snackbarInfo: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
});

type AppProps = {
  classes: any;
  theme: ChatTheme;
};

/**
 * Parent container for the rest of the chat app container components.
 * Displays the login page for users not logged in.
 * Displays the sideDrawer and chat container for logged in users.
 * @param AppProps
 */
function App({ theme, classes }: AppProps) {
  const chatApi = useChatApi();
  const { user, isLoggedIn } = useUserLogin();
  const { username, userId } = user;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedChatroom, setChatroom] = useState({} as ChatroomType);
  const [selectedUser, setSelectedUser] = useState({} as UserType);
  const isChatroomSelected = !!selectedChatroom.name;

  const { signOut } = useGoogleLogout({
    clientId: CLIENT_ID,
    onLogoutSuccess: () => console.log('User logged out'),
    onFailure: () => console.warn('Failed to logout...')
  });

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
    if (!user.isGuestUser) {
      signOut();
    }
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
    <SnackbarProvider
      maxSnack={1}
      autoHideDuration={3000}
      classes={{
        variantSuccess: classes.snackbarSuccess,
        variantError: classes.snackbarError,
        variantWarning: classes.snackbarWarning,
        variantInfo: classes.snackbarInfo
      }}
    >
      <FlexView
        column
        grow
        width="100%"
        height="100vh"
        className={classes.root}
      >
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
          <Toolbar className={classes.mainToolbar}>
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
          <ChatroomMembersToolbar
            isChatroomSelected={isChatroomSelected}
            membersIds={selectedChatroom.memberIds}
          />
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
    </SnackbarProvider>
  );
}

export default withStyles(styles as any, { withTheme: true })(App);
