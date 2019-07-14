import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import {
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  withStyles
} from '@material-ui/core';

import { UserAvatar } from 'src/shared';
import { ChatTheme, Message } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    messagesList: {
      overflow: 'auto'
    },
    messageTime: {
      color: theme.chatColors.greyText
    }
  });

// TODO add date somewhere: MMMM Do, YYYY   e.g. June 10th, 2019
const TIME_FORMAT = ' - HH:mm A'; // - 14:18 PM

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
      console.log('scrollToBottom effect');
      if (messagesEndRef && messagesEndRef.scrollIntoView) {
        // TODO look into using behavior: 'auto' for first load of large lists.
        // Maybe diff y co-ord with messageEndRef to see if we are already near the bottom or not?
        messagesEndRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [messages, messagesEndRef]
  );

  // TODO investigate react-native ListView */
  return (
    <List dense={true} className={classes.messagesList}>
      {messages.map(({ username, message, timestamp }, i) => {
        return (
          <ListItem key={username + i} alignItems="flex-start">
            <ListItemAvatar>
              <UserAvatar username={username} fadeIn={false} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  <span>{username}</span>
                  <span className={classes.messageTime}>
                    {format(timestamp, TIME_FORMAT)}
                  </span>
                </div>
              }
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
  );
}

export default withStyles(styles, { withTheme: true })(MessageList);
