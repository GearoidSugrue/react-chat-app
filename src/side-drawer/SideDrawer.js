import React, { useState } from "react";

// useMediaQuery will be stable in the next material ui version. It was waiting for the Hooks API to be stable, which is now stable
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import PropTypes from "prop-types";
import FlexView from "react-flexview";

import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Toolbar from "@material-ui/core/Toolbar";
import TypoGraphy from "@material-ui/core/Typography";
import MoreVert from "@material-ui/icons/MoreVert";
import Group from "@material-ui/icons/Group";

import useFetchRooms, { fetchRoomsStatus } from "../hooks/FetchRooms.hook";
import useFetchUsers, { fetchUsersStatus } from "../hooks/FetchUsers.hook";

const drawerWidth = 240; // this duplicated from App.js should probably find a better place for it! useTheme maybe?

// todo add css for side drawer element margins
const styles = theme => ({
  menuButton: {
    marginRight: 20,

    // only very small screens need to toggle the side drawer so the menu button will be hidden on larger devices
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar, // todo check if this does anything!
  drawer: {
    width: drawerWidth
  },
  userBar: {
    "justify-content": "space-between"
    // margin: 'auto'
  },
  userBarElement: {
    margin: "auto"
  }
});

// todo split this up more?
//    * Perhaps inversion of control could be applied? i.e. pass in user bar, rooms, users...
function SideDrawer({
  classes,
  theme,
  username,
  isLoggedIn,
  mobileDrawerOpen,
  onMobileDrawerToggle,
  onChatroomChange,
  onLogout
}) {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { rooms, status: roomsStatus } = useFetchRooms();
  const { users, status: usersStatus } = useFetchUsers();

  const [userMenuElement, setUserMenuElement] = useState();

  const handleLogout = () => {
    setUserMenuElement(null);
    onLogout();
  };

  const sideDrawer = (
    <div>
      <Toolbar className={classes.toolbar}>
        {/* todo do this better... */}

        <Button
          style={{ width: "100%" }}
          onClick={event => setUserMenuElement(event.currentTarget)}
        >
          <FlexView grow className={classes.userBar}>
            {/* make avatar it's own comp/hook? Also, add null/'' check for username, currently the avatar flickers with an incorrect place holder */}
            <Avatar
              src={`https://api.adorable.io/avatars/36/${username}.png`}
              style={{ borderRadius: "25%" }}
            />
            <TypoGraphy noWrap className={classes.userBarElement}>
              {username}
            </TypoGraphy>
            <MoreVert className={classes.userBarElement} />
          </FlexView>
        </Button>

        {/* todo look at ways to align menu to center of button rather than left align. See: https://material-ui.com/demos/menus/ */}
        <Menu
          id="user-menu"
          anchorEl={userMenuElement}
          open={Boolean(userMenuElement)}
          onClose={() => setUserMenuElement(null)}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      <Divider />

      <TypoGraphy color="inherit">Rooms</TypoGraphy>

      {roomsStatus === fetchRoomsStatus.FETCHING && (
        // todo move css out
        <TypoGraphy color="inherit" style={{ margin: "8px" }}>
          Loading rooms...
        </TypoGraphy>
      )}
      {roomsStatus === fetchRoomsStatus.SUCCESS && (
        <List>
          {rooms.map((room, index) => (
            <ListItem button key={room} onClick={() => onChatroomChange(room)}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary={room} />
            </ListItem>
          ))}
        </List>
      )}

      <Divider />

      <TypoGraphy color="inherit">Users</TypoGraphy>
      {usersStatus === fetchUsersStatus.FETCHING && (
        // todo move css out
        <TypoGraphy color="inherit" style={{ margin: "8px" }}>
          Loading users...
        </TypoGraphy>
      )}
      {usersStatus === fetchUsersStatus.SUCCESS && (
        <List>
          {users.map((user, index) => (
            <ListItem
              button
              key={user.username}
              onClick={() => console.log("selected user", user)}
            >
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );

  return (
    <>
      {/* todo try use isSmallScreen variable instead? May not change dynamically tho...*/}
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

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SideDrawer);
