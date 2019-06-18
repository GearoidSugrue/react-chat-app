import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  withStyles
} from '@material-ui/core';

import UserAvatar from 'src/side-drawer/UserAvatar';
import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  messagesList: {
    overflow: 'auto' // todo fix not showing scroll bar issue,
  }
});

function MessageList({ theme, classes, messages = [] }) {
  const [messagesEndRef, setMessagesEndRef] = useState({} as HTMLDivElement);

  // This effect Scrolls down to the newest message. Triggered by message change.
  useEffect(
    function scrollToBottom() {
      console.log('scrollToBottom effect', messagesEndRef);
      if (messagesEndRef && messagesEndRef.scrollIntoView) {
        messagesEndRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [messages, messagesEndRef]
  );

  return (
    <Fade in={true} timeout={300}>
      {/* todo investigate react-native ListView */}
      <List dense={true} className={classes.messagesList}>
        {messages.map(({ username, message }, i) => {
          return (
            <ListItem
              className={classes.message}
              key={username + i}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <UserAvatar username={username} />
              </ListItemAvatar>
              <ListItemText primary={username} secondary={message} />
            </ListItem>
          );
        })}
        <div
          style={{ float: 'left', clear: 'both', height: theme.spacing(2) }}
          ref={element => setMessagesEndRef(element)}
        />
      </List>
    </Fade>
  );
}

MessageList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MessageList);
