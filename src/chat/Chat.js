import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FlexView from 'react-flexview';

import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import TypoGraphy from '@material-ui/core/Typography';

import MessageList from './MessageList';
import UserInput from './UserInput';

import { useChatApi } from '../chat-api/ChatApiContext';
import useMessages from '../hooks/Messages.hook';

// todo: show online and offline users in a sub-toolbar?

const styles = theme => ({
  messagesList: {
    marginBottom: '14px',
    maxHeight: '100%', // todo check this works!
    overflow: 'auto' // todo fix not showing scroll bar issue
  },
  message: {
    padding: `0 0 ${theme.spacing.unit}px 0`
  }
});

function Chat({ classes, username, chatroom, selectedUser }) {
  console.log('Chat:', { username, chatroom, selectedUser });

  const chatApi = useChatApi();
  const { messages } = useMessages({ username, chatroom, selectedUser });

  function handleOnSendMessage(message) {
    if (chatroom) {
      chatApi.sendMessageToChatroom({ chatroom, username, message });
    } else if (selectedUser) {
      chatApi.sendMessageToUser({
        toUsername: selectedUser.username,
        username,
        message
      });
    }
  }

  const showChat = chatroom || selectedUser.username;

  return (
    <Fade in={true}>
      <>
        {!showChat && (
          <TypoGraphy variant="h5" color="inherit">
            {`Hello ${username}, select a room or user to start chatting!`}
          </TypoGraphy>
        )}

        {showChat && (
          <>
            <FlexView column grow vAlignContent="top">
              <MessageList messages={messages} />
            </FlexView>

            <FlexView column vAlignContent="bottom">
              <UserInput onSendMessage={handleOnSendMessage} />
            </FlexView>
          </>
        )}
      </>
    </Fade>
  );
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
