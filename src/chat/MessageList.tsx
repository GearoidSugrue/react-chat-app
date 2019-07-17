import React, { useEffect, useState } from 'react';

import {
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  withStyles
} from '@material-ui/core';

import { UserAvatar } from 'src/shared';
import { ChatTheme, Message } from 'src/types';
import {
  getDateHeaderText,
  getTimeText,
  shouldDisplayDateHeader,
  shouldMessageBeGrouped
} from './MessageListDateHelpers';

const styles = (theme: ChatTheme) =>
  createStyles({
    messagesList: {
      paddingTop: 0,
      overflow: 'auto'
    },
    messageDateHeader: {
      backgroundColor: theme.palette.background.default
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
        messagesEndRef.scrollIntoView({ behavior: 'smooth' }); // scrolls top-to-bottom if the list on new messages
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
            <React.Fragment key={timestamp}>
              {shouldDisplayDateHeader(index, index - 1, messagesArray) && (
                <ListSubheader className={classes.messageDateHeader}>
                  {getDateHeaderText(timestamp)}
                </ListSubheader>
              )}

              <ListItem alignItems="flex-start">
                {shouldMessageBeGrouped(index, index - 1, messagesArray) ? (
                  <ListItemText inset>
                    <Typography className={classes.message}>
                      {message}
                    </Typography>
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
                            {getTimeText(timestamp)}
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
            </React.Fragment>
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
