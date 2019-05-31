import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import List from '@material-ui/core/List';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TypoGraphy from '@material-ui/core/Typography';
// import Group from '@material-ui/icons/Group';

import useFetchRooms, { fetchRoomsStatus } from '../hooks/Rooms.hook';

const styles = theme => ({
  loading: {
    margin: theme.spacing(2)
  },
  errorText: {
    margin: theme.spacing(2)
  }
});
function Chatrooms({ classes, selectedChatroom, onChatroomSelected }) {
  const { rooms, status: roomsStatus, retry } = useFetchRooms();

  return (
    <>
      {roomsStatus === fetchRoomsStatus.FETCHING && (
        // todo add loading placeholders
        <TypoGraphy color="inherit" className={classes.loading}>
          Loading rooms...
        </TypoGraphy>
      )}
      {roomsStatus === fetchRoomsStatus.SUCCESS && (
        <List>
          {rooms.map((room, index) => (
            <ListItem
              button
              key={room}
              selected={Boolean(selectedChatroom === room)}
              onClick={() => onChatroomSelected(room)}
            >
              {/* <ListItemIcon>
                <Group />
              </ListItemIcon> */}
              <ListItemText primary={room} />
            </ListItem>
          ))}
        </List>
      )}
      {roomsStatus === fetchRoomsStatus.ERROR && (
        <TypoGraphy color="inherit" className={classes.errorText}>
          Error loading rooms!
          <Button color="secondary" onClick={retry}>
            Retry
          </Button>
        </TypoGraphy>
      )}
    </>
  );
}

Chatrooms.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Chatrooms);
