import React, { useEffect, useState } from 'react';

import {
  createStyles,
  Fade,
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
      paddingLeft: theme.spacing(1),
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
  chatroomId?: string;
};

function MessageList({
  theme,
  classes,
  messages = [],
  chatroomId
}: MessageListProps) {
  // TODO perhaps this could use "useRef" instead?
  const [messagesEndRef, setMessagesEndRef] = useState({} as HTMLDivElement);
  const [messageListRef, setMessageListRef] = useState({} as HTMLUListElement);

  useEffect(
    function scrollToBottomOnChatroomChange() {
      const { scrollHeight } = messageListRef;

      const shouldSmoothScroll = scrollHeight < 4000; // only smooth scrolls if the list is small so it doesn't take too long
      const smoothScrollDelay = shouldSmoothScroll
        ? theme.transitions.duration.enteringScreen
        : 0;

      const scrollToBottom = () => {
        if (messagesEndRef && messagesEndRef.scrollIntoView) {
          messagesEndRef.scrollIntoView({
            behavior: shouldSmoothScroll ? 'smooth' : 'auto',
            block: 'end'
          }); // scrolls top-to-bottom of the list when the chatroom has changed
        }
      };
      setTimeout(scrollToBottom, smoothScrollDelay);
    },
    [messagesEndRef, messageListRef, chatroomId]
  );

  // This effect Scrolls down to the newest message. Triggered by message change.
  useEffect(
    function scrollToBottomOnNewMessage() {
      const { scrollTop, scrollHeight } = messageListRef;
      const shouldScroll = scrollHeight - scrollTop < 1000;

      if (messagesEndRef && messagesEndRef.scrollIntoView && shouldScroll) {
        messagesEndRef.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        }); // scrolls top-to-bottom if the list on new messages
      }
    },
    [messages, messagesEndRef, messageListRef]
  );

  // TODO investigate react-native ListView */

  const fadeDuration = theme.transitions.duration.enteringScreen * 2;

  return (
    <Fade in={true} timeout={fadeDuration}>
      <List
        dense={true}
        className={classes.messagesList}
        ref={element => setMessageListRef(element)}
      >
        {/* ref={element => setMessageListRef(element)} */}
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
                        <UserAvatar
                          username={username}
                          fadeIn={false}
                          variant="circle"
                        />
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
          style={{ height: theme.spacing(4) }}
          ref={element => setMessagesEndRef(element)}
        />
      </List>
    </Fade>
  );
}

export default withStyles(styles, { withTheme: true })(MessageList);
