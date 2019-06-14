import PropTypes from 'prop-types';
import React from 'react';

// import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import AddCircle from '@material-ui/icons/AddCircle'; // AddCircleOutlne
import useUserLogin from 'src/hooks/UserLogin.hook';
import Chatrooms from './Chatrooms';
import UserDetails from './UserDetails';
import Users from './Users';

const styles = theme => ({
  joinChatroomButton: {
    margin: theme.spacing(1)
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

  const handleCreateChatroom = () => {
    console.log('Create chatroom clicked!');
  };

  const sideDrawer = (
    <div>
      <UserDetails username={username} onLogout={onLogout} />
      <Divider />

      <TypoGraphy noWrap color="inherit" className={classes.header}>
        CHATROOMS
        <IconButton
          // color="secondary"
          // className={classes.button}
          onClick={handleCreateChatroom}
        >
          <AddCircle />
        </IconButton>
      </TypoGraphy>

      {isLoggedIn && (
        <Chatrooms
          selectedChatroom={selectedChatroom}
          onChatroomSelected={onChatroomSelected}
        />
      )}
      <Divider />

      <TypoGraphy noWrap color="inherit" className={classes.header}>
        DIRECT MESSAGE
      </TypoGraphy>
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
