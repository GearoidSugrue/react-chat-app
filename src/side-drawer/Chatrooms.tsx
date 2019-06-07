import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import useFetchRooms, { fetchRoomsStatus } from '../hooks/Rooms.hook';

const styles = theme => ({
  chatroomList: {
    // todo check gutter prop on List
    padding: 0
  },
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
        <List className={classes.chatroomList}>
          {rooms.map(room => (
            <ListItem
              button
              key={room.chatroomId}
              selected={selectedChatroom.chatroomId === room.chatroomId}
              onClick={() => onChatroomSelected(room)}
            >
              <TypoGraphy noWrap>{room.name}</TypoGraphy>
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
