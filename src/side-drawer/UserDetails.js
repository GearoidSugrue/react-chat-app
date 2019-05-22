import React, { useState } from "react";

import PropTypes from "prop-types";
import FlexView from "react-flexview";

import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Toolbar from "@material-ui/core/Toolbar";
import TypoGraphy from "@material-ui/core/Typography";
import MoreVert from "@material-ui/icons/MoreVert";

const styles = theme => ({
  toolbar: theme.mixins.toolbar, // todo check if this does anything!
  userBar: {
    "justify-content": "space-between"
  },
  userBarElement: {
    margin: "auto"
  }
});

function UserDetails({ classes, username, onLogout }) {
  const [userMenuElement, setUserMenuElement] = useState();

  const handleLogout = () => {
    setUserMenuElement(null);
    onLogout();
  };
  return (
    <Toolbar className={classes.toolbar}>
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
  );
}

UserDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserDetails);
