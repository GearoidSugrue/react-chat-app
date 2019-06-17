import PropTypes from 'prop-types';
import React from 'react';
import FlexView from 'react-flexview';

import { Divider } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import { Theme, withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';

import MessageList from './MessageList';
import UserInput from './UserInput';

import { useChatApi } from 'src/chat-api/ChatApiContext';
import useMessages, { fetchMessagesStatus } from 'src/hooks/Messages.hook';

// todo: show online and offline users in a sub-toolbar?

const styles = (theme: Theme) => ({
  messagesList: {
    marginBottom: '14px',
    maxHeight: '100%', // todo check this works!
    overflow: 'auto' // todo fix not showing scroll bar issue
  },
  message: {
    padding: theme.spacing(0, 0, 1, 0)
  }
});

function Chat({ classes, userId, username, selectedChatroom, selectedUser }) {
  console.log('Chat:', { userId, selectedChatroom, selectedUser });
  const chatApi = useChatApi();
  const { messages, status: messagesStatus } = useMessages({
    userId,
    selectedChatroom,
    selectedUser
  });
  const recipientId = selectedChatroom.chatroomId || selectedUser.userId;

  function handleOnSendMessage(message: string) {
    if (selectedChatroom.chatroomId) {
      chatApi.sendMessageToChatroom({
        chatroomId: selectedChatroom.chatroomId,
        userId,
        message
      });
    } else if (selectedUser.userId) {
      chatApi.sendMessageToUser({
        message,
        toUserId: selectedUser.userId
      });
    }
  }

  return (
    <Fade in={true}>
      <>
        {!recipientId && (
          <TypoGraphy variant="h5" color="inherit">
            {`Hello ${username}, select a room or user to start chatting!`}
          </TypoGraphy>
        )}

        {recipientId && (
          <>
            <FlexView column grow basis="75%">
              {messagesStatus === fetchMessagesStatus.FETCHING && (
                <TypoGraphy color="inherit" style={{ margin: '8px' }}>
                  Loading messages...
                </TypoGraphy>
              )}
              {messagesStatus === fetchMessagesStatus.SUCCESS && (
                <MessageList messages={messages} />
              )}
            </FlexView>

            <Divider />

            <UserInput
              recipientId={recipientId}
              onSendMessage={handleOnSendMessage}
            />
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
