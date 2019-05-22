import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FlexView from "react-flexview";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import TypoGraphy from "@material-ui/core/Typography";

import MenuIcon from "@material-ui/icons/Menu";

import openSocket from "socket.io-client";

import Chat from "./Chat";
import LoginPage from "./login/LoginPage";
import SideDrawer from "./side-drawer/SideDrawer";

const drawerWidth = 240;

// todo add css for side drawer element margins

const styles = theme => ({
  // dev css that gives a easy to see border around containers. Delete when dev complete.
  highlightBorders: {
    border: "3px solid blue"
  },
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  // todo create css class for mobile apppBar that doesn't shift
  appBarShift: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),

    // small screens won't show a side drawer so no need for a left margin on the toolbar
    marginLeft: 0,

    // adds a left margin to the toolbar so the side drawer doesn't overlap it
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
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
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,

  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth
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
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),

    // side drawer is not displayed on very small devices so no need for a left margin on the main content
    marginLeft: 0,

    // adds a left margin to the main content so the side drawer doesn't overlap it
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth
    }
  },
  userBar: {
    "justify-content": "space-between"
  },
  userBarElement: {
    margin: "auto"
  }
});

function App({ classes, theme }) {
  const [socket] = useState(() => openSocket("http://localhost:3001"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatroom, setChatroom] = useState("");
  const [username, setUsername] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSideDrawerToggle = () => setMobileDrawerOpen(!mobileDrawerOpen);

  useEffect(
    function connectToSocketServer() {
      console.log("connectToSocketServer useEffect");

      socket.on("message", message =>
        setMessages(messages => [...messages, message])
      );
      return function closeSocket() {
        socket.close();
      };
    },
    [socket]
  );

  useEffect(
    function joinChat() {
      console.log("joinChat effect", username, chatroom);

      const validJoin = socket && username && chatroom;

      if (validJoin) {
        socket.emit("join chatroom", {
          chatroom,
          username
        });
      }

      return function leaveChat() {
        if (validJoin) {
          socket.emit("leave chatroom", {
            chatroom,
            username
          });
        }
      };
    },
    [socket, chatroom, username]
  );

  useEffect(
    function loginUser() {
      console.log("loginUser effect", username);

      const validLogin = socket && username;

      if (validLogin) {
        // username is only ever set after the user has clicked login so it's value changing can be used to login
        socket.emit("login", {
          username
        });
        setIsLoggedIn(true);
      }

      return function logout() {
        console.log("Login effect - cleanUp - logged out...");
        setChatroom("");
        setMessages([]);
        setIsLoggedIn(false);
        socket.emit("logout");
      };
    },
    [socket, username]
  );

  return (
    <FlexView column grow width="100%" height="100vh">
      {/* todo investigate Inversion of control */}
      <SideDrawer
        username={username}
        isLoggedIn={isLoggedIn}
        mobileDrawerOpen={mobileDrawerOpen}
        onMobileDrawerToggle={handleSideDrawerToggle}
        onChatroomChange={room => setChatroom(room)}
        onLogout={() => setUsername("")}
      />

      <AppBar
        position="relative"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: isLoggedIn
        })}
      >
        <Toolbar>
          <IconButton
            className={classNames(classes.menuButton, {
              [classes.hide]: !isLoggedIn
            })}
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          >
            <MenuIcon />
          </IconButton>
          <TypoGraphy variant="h5" color="inherit" noWrap>
            {chatroom || "Group Chat"}
          </TypoGraphy>
        </Toolbar>
      </AppBar>

      <FlexView
        column
        grow
        className={classNames(classes.highlightBorders, classes.content, {
          [classes.contentShift]: isLoggedIn
        })}
      >
        {isLoggedIn ? (
          <Chat chatroom={chatroom} username={username} messages={messages} />
        ) : (
          <LoginPage
            onLogin={({ username }) => {
              setUsername(username);
              setIsLoggedIn(true);
            }}
          />
        )}
      </FlexView>
    </FlexView>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
