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
import { ChatTheme, Message } from 'src/types';

const styles = (theme: ChatTheme) => ({
  messagesList: {
    overflow: 'auto' // todo fix not showing scroll bar issue,
  }
});

function MessageList({ theme, classes, messages = [] as Message[] }) {
  // todo perhaps this could use "useRef" instead?
  const [messagesEndRef, setMessagesEndRef] = useState({} as HTMLDivElement);

  // This effect Scrolls down to the newest message. Triggered by message change.
  useEffect(
    function scrollToBottom() {
      console.log('scrollToBottom effect', messagesEndRef);
      if (messagesEndRef && messagesEndRef.scrollIntoView) {
        // todo look into using behavior: 'auto' for first load of large lists.
        // Maybe diff y co-ord with messageEndRef to see if we are already near the bottom or not?
        messagesEndRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [messages, messagesEndRef]
  );

  return (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      {/* todo investigate react-native ListView */}
      <List dense={true} className={classes.messagesList}>
        {messages.map(({ username, message, timestamp }, i) => {
          return (
            <ListItem
              className={classes.message}
              key={username + i}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <UserAvatar username={username} />
              </ListItemAvatar>
              <ListItemText
                primary={`${username} - ${timestamp}`}
                secondary={message}
              />
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
