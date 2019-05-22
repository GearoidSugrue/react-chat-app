import React, { useState } from "react";

import PropTypes from "prop-types";
// import FlexView from "react-flexview";

import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TypoGraphy from "@material-ui/core/Typography";
import Group from "@material-ui/icons/Group";

import useFetchRooms, { fetchRoomsStatus } from "../hooks/FetchRooms.hook";

// todo add css for side drawer element margins
const styles = theme => ({});

function Chatrooms({ onChatroomSelected }) {
  // todo perhaps useFetchRooms should be replaced with a more generic Fetch Hook?
  const { rooms, status: roomsStatus } = useFetchRooms();

  return (
    <>
      {roomsStatus === fetchRoomsStatus.FETCHING && (
        // todo move css out
        <TypoGraphy color="inherit" style={{ margin: "8px" }}>
          Loading rooms...
        </TypoGraphy>
      )}
      {roomsStatus === fetchRoomsStatus.SUCCESS && (
        <List>
          {rooms.map((room, index) => (
            <ListItem
              button
              key={room}
              onClick={() => onChatroomSelected(room)}
            >
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary={room} />
            </ListItem>
          ))}
        </List>
      )}
      {roomsStatus === fetchRoomsStatus.ERROR && "// Error 0_0 ...retry is WIP"}
    </>
  );
}

Chatrooms.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Chatrooms);
