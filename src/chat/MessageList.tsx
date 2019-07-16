import { format } from 'date-fns';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import React, { useEffect, useState } from 'react';

import {
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';

import { UserAvatar } from 'src/shared';
import { ChatTheme, Message } from 'src/types';

const MAX_TIME_DIFFERENCE_MINS = 5;

function shouldMessageBeGrouped(
  curIndex: number,
  prevIndex: number,
  messages: Message[]
): boolean {
  if (prevIndex < 0) {
    return false;
  }

  const { userId: curUserId, timestamp: curTimestamp } = messages[curIndex];
  const { userId: prevUserId, timestamp: prevTimestamp } = messages[prevIndex];

  if (curUserId !== prevUserId) {
    return false;
  }

  const timeDifference = differenceInMinutes(curTimestamp, prevTimestamp);
  return timeDifference < MAX_TIME_DIFFERENCE_MINS;
}

const styles = (theme: ChatTheme) =>
  createStyles({
    messagesList: {
      overflow: 'auto'
    },
    messageUsername: {
      fontWeight: 500
    },
    messageTime: {
      marginLeft: theme.spacing(1),
      fontWeight: 400,
      fontSize: '14px',
      color: theme.chatColors.greyText
    },
    message: {
      fontWeight: 400,
      whiteSpace: 'pre-line'
    }
  });

// TODO add date somewhere: MMMM Do, YYYY   e.g. June 10th, 2019
const TIME_FORMAT = 'HH:mm A'; // 14:18 PM

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
        if (messages.length < 100) {
          messagesEndRef.scrollIntoView({ behavior: 'smooth' }); // scrolls top-to-bottom if the list isn't too big
        } else {
          messagesEndRef.scrollIntoView({ behavior: 'auto' }); // jumps straight to the bottom of the list if there are a lot of messages
        }
      }
    },
    [messages, messagesEndRef]
  );

  // TODO investigate react-native ListView */

  return (
    <List dense={true} className={classes.messagesList}>
      {messages.map(
        ({ username, message, timestamp }, index, messagesArray) => {
          return (
            <ListItem key={timestamp} alignItems="flex-start">
              {shouldMessageBeGrouped(index, index - 1, messagesArray) ? (
                <ListItemText inset>
                  <Typography className={classes.message}>{message}</Typography>
                </ListItemText>
              ) : (
                <>
                  <ListItemAvatar>
                    <UserAvatar username={username} fadeIn={false} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography className={classes.messageUsername}>
                        {username}
                        <span className={classes.messageTime}>
                          {format(timestamp, TIME_FORMAT)}
                        </span>
                      </Typography>
                    }
                    secondary={
                      <Typography className={classes.message}>
                        {message}
                      </Typography>
                    }
                  />
                </>
              )}
            </ListItem>
          );
        }
      )}
      <div
        style={{ float: 'left', clear: 'both', height: theme.spacing(2) }}
        ref={element => setMessagesEndRef(element)}
      />
    </List>
  );
}

export default withStyles(styles, { withTheme: true })(MessageList);
