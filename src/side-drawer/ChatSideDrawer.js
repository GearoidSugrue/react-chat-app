import React, { useState } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import TypoGraphy from "@material-ui/core/Typography";

// todo add css for side drawer element margins
const styles = theme => ({
  drawer: {
    width: theme.sideDrawer.width
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
  const sideDrawer = (
    <div>
      {userBar}
      <Divider />

      <TypoGraphy color="inherit">Chatrooms</TypoGraphy>
      {chatrooms}
      <Divider />

      <TypoGraphy color="inherit">Users</TypoGraphy>
      {users}
      <Divider />
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
          anchor={theme.direction === "rtl" ? "right" : "left"}
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
          anchor={theme.direction === "rtl" ? "right" : "left"}
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
