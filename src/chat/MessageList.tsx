import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import {
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  withStyles
} from '@material-ui/core';

import UserAvatar from 'src/shared/UserAvatar';
import { ChatTheme, Message } from 'src/types';

const styles = () => ({
  messagesList: {
    overflow: 'auto'
  }
});

const DATE_FORMAT = 'MMMM Do, YYYY - HH:mm A'; // e.g. June 10th, 2019 - 14:18 PM

type MessageListProps = {
  classes: any;
  theme: ChatTheme;
  messages?: Message[];
};

function MessageList({ theme, classes, messages = [] }: MessageListProps) {
  // TODO perhaps this could use "useRef" instead?
  const [messagesEndRef, setMessagesEndRef] = useState({} as HTMLDivElement);

  // This effect Scrolls down to the newest message. Triggered by message change.
  useEffect(
    function scrollToBottom() {
      console.log('scrollToBottom effect', messagesEndRef);
      if (messagesEndRef && messagesEndRef.scrollIntoView) {
        // TODO look into using behavior: 'auto' for first load of large lists.
        // Maybe diff y co-ord with messageEndRef to see if we are already near the bottom or not?
        messagesEndRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [messages, messagesEndRef]
  );

  return (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      {/* // TODO investigate react-native ListView */}
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
                primary={`${username} - ${format(timestamp, DATE_FORMAT)}`}
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

export default withStyles(styles, { withTheme: true })(MessageList);
