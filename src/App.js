
import React, { useState, useEffect } from 'react';

// useMediaQuery will be stable in the next material ui version. It was waiting for the Hooks API to be stable, which is now stable
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import PropTypes from 'prop-types';
import FlexView from 'react-flexview';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';

// import { useTheme } from '@material-ui/styles';

import openSocket from 'socket.io-client';

import Chat from './Chat';
import LoginPage from './login/LoginPage';


import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = theme => ({
  // dev css that gives a easy to see border around containers. Delete when dev complete.
  highlightBorders: {
    border: '3px solid blue'
  },
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  // todo create css class for mobile apppBar that doesn't shift
  appBarShift: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),

    // small screens won't show a side drawer so no need for a left margin on the toolbar
    marginLeft: 0,

    // adds a left margin to the toolbar so the side drawer doesn't overlap it
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  // drawer: {
  //   [theme.breakpoints.up('sm')]: {
  //     width: drawerWidth,
  //     flexShrink: 0,
  //   },
  // },
  menuButton: {
    marginRight: 20,

    // only very small screens need to toggle the side drawer so the menu button will be hidden on larger devices
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,

  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
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
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),

    // side drawer is not displayed on very small devices so no need for a left margin on the main content
    marginLeft: 0,

    // adds a left margin to the main content so the side drawer doesn't overlap it
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
  },
});

// todo move drawer into it's own sub directory and file
function App({ classes, theme }) {
  // const themes = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  console.log('isSmallScreen', isSmallScreen)


  const [mobileOpen, setMobileOpen] = useState(false);

  const [socket] = useState(() => openSocket('http://localhost:3001'));
  const [messages, setMessages] = useState([]);
  const [chatroom, setChatroom] = useState('');
  const [username, setUsername] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(
    function connectToSocketServer() {
      console.log('inside App useEffect')

      socket.on('message', message => setMessages(messages => [...messages, message]));
      return function closeSocket() {
        socket.close();
      }
    }, [socket]);

  useEffect(
    function joinChat() {
      console.log('Join chat effect', username, chatroom);

      if (socket && username && chatroom) {
        socket.emit('join chatroom', {
          chatroom,
          username
        });
      }

      return function leaveChat() {
        socket.emit('leave chatroom', {
          chatroom,
          username
        });
      }
    }, [socket, chatroom, username]);

  useEffect(
    function loginUser() {
      console.log('Login User effect', username);

      if (socket && username) { // todo addd isLoggedIn * setIsLoggedIn
        socket.emit('login', {
          username
        });
        setIsLoggedIn(true);
      }

      return function logout() {
        console.log('Login cleanUp - logged out...')
        socket.emit('login', { username });
        setIsLoggedIn(false);
      }
    }, [socket, username]);

  // const handleJoinChat = ({ chatroom, username }) => {
  //   setChatroom(chatroom);
  //   setUsername(username);
  // }

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  console.log('drawer', mobileOpen)

  const drawer = (
    <div>
      <div className={classes.toolbar} >
        <TypoGraphy noWrap>
          User: {username}
        </TypoGraphy>
      </div>

      <Divider />
      Rooms!
      <Divider />
      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
      <Divider />
      Users
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  );

  return (
    <FlexView column grow width='100%' height='100vh'>

      <Hidden smUp implementation="js">
        <Drawer
          classes={{
            paper: classes.drawer,
          }}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen && isLoggedIn}
          onClose={handleDrawerToggle}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="js">
        <Drawer
          classes={{
            paper: classes.drawer,
          }}
          variant="persistent"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={isLoggedIn}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <AppBar
        position="relative"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: isLoggedIn,
        })}
      >

        <Toolbar>
          <IconButton
            className={classNames(classes.menuButton, {
              [classes.hide]: !isLoggedIn,
            })}
            onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuIcon />
          </IconButton>
          <TypoGraphy variant="h5" color="inherit" noWrap>
            Very Basic Group Chat
          </TypoGraphy>
        </Toolbar>
      </AppBar>


      <FlexView column grow
        className={classNames(classes.highlightBorders, classes.content, {
          [classes.contentShift]: isLoggedIn,
        })}
      >
        {
          isLoggedIn ?
            <Chat chatroom={chatroom} username={username} messages={messages}></Chat> :
            <LoginPage onLogin={({ username }) => {
              setUsername(username);
              setIsLoggedIn(true);
            }}></LoginPage>
        }
      </FlexView>
    </FlexView >
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);

