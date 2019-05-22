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
import ChatSideDrawer from "./side-drawer/ChatSideDrawer";

import UserDetails from "./side-drawer/UserDetails";
import Chatrooms from "./side-drawer/Chatrooms";
import Users from "./side-drawer/Users";

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
      width: `calc(100% - ${theme.sideDrawer.width})`,
      marginLeft: theme.sideDrawer.width
    }
  },
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
      marginLeft: theme.sideDrawer.width
    }
  }
});

function App({ classes }) {
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

  const userDetails = (
    <UserDetails username={username} onLogout={() => setUsername("")} />
  );
  const rooms = <Chatrooms onChatroomSelected={room => setChatroom(room)} />;
  const users = (
    <Users onUserSelected={user => console.log("User selected:", user)} />
  );

  return (
    <FlexView column grow width="100%" height="100vh">
      <ChatSideDrawer
        userBar={userDetails}
        chatrooms={rooms}
        users={users}
        isLoggedIn={isLoggedIn}
        mobileDrawerOpen={mobileDrawerOpen}
        onMobileDrawerToggle={handleSideDrawerToggle}
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
