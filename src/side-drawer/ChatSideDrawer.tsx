import PropTypes from 'prop-types';
import React from 'react';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import AddCircleOutline from '@material-ui/icons/AddCircleOutline';

const styles = theme => ({
  drawer: {
    width: theme.sideDrawer.width
  },
  header: {
    // textTransform: 'uppercase', // todo fix as it's breaking compilation
    fontWeight: 500,
    padding: theme.spacing(2)
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
  userBar,
  chatrooms,
  users,
  isLoggedIn,
  mobileDrawerOpen,
  onMobileDrawerToggle
}) {
  const handleCreateChatroom = () => {
    console.log('Create chatroom clicked!');
  };

  const sideDrawer = (
    <div>
      {userBar}
      <Divider />

      <TypoGraphy noWrap color="inherit" className={classes.header}>
        Chatrooms
        <IconButton
          color="secondary"
          className={classes.button}
          onClick={handleCreateChatroom}
        >
          <AddCircleOutline />
        </IconButton>
      </TypoGraphy>
      {chatrooms}
      <Divider />

      <TypoGraphy noWrap color="inherit" className={classes.header}>
        Direct Message
      </TypoGraphy>
      {users}
    </div>
  );

  return (
    <>
      {/* todo investigate material ui useMediaQuery. May not change dynamically tho...*/}
      <Hidden smUp implementation="js">
        <Drawer
          classes={{
            paper: classes.drawer
          }}
          variant="temporary"
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
