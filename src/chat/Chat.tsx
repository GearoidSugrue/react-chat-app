import React, { useEffect, useState } from 'react';
import FlexView from 'react-flexview';
import { Subscription } from 'rxjs';

import {
  Button,
  Divider,
  Fade,
  Typography,
  withStyles
} from '@material-ui/core';

import { useChatApi } from 'src/chat-api';
import { fetchMessagesStatus, useIsUserTyping, useMessages } from 'src/hooks';
import { VerticalErrorMessage } from 'src/shared';
import { ChatroomType, ChatTheme, UserType } from 'src/types';
import MessageList from './MessageList';
import { MessagePlaceholders } from './placeholders';
import UserInput from './UserInput';

// TODO: show online and offline users in a sub-toolbar?

const styles = (theme: ChatTheme) => ({
  landingPageText: {
    margin: theme.spacing(2)
  },
  errorMessage: {
    minWidth: '250px'
  }
});

type ChatProps = Readonly<{
  classes: any;
  userId: string;
  username: string;
  selectedChatroom: ChatroomType;
  selectedUser: UserType;
}>;

function Chat({
  classes,
  userId,
  username,
  selectedChatroom,
  selectedUser
}: ChatProps) {
  const chatApi = useChatApi();
  const {
    messages,
    status: messagesStatus,
    retry: retryMessages
  } = useMessages({
    userId,
    selectedChatroom,
    selectedUser
  });
  const recipientId = selectedChatroom.chatroomId || selectedUser.userId;

  const [participantsIds, setParticipantsIds] = useState([] as string[]);

  useEffect(
    function updateParticipantsOnChange() {
      if (selectedChatroom.chatroomId) {
        return setParticipantsIds(selectedChatroom.memberIds);
      } else if (selectedUser.userId) {
        return setParticipantsIds([selectedUser.userId]);
      }
    },
    [selectedChatroom, selectedUser, setParticipantsIds]
  );

  useEffect(
    function subscribeToNewChatroomMembers() {
      console.log('subscribeToNewChatroomMembers effect');
      let newChatroomMembersSub: Subscription;

      if (selectedChatroom.chatroomId) {
        function addNewMember(newMemberId: string) {
          setParticipantsIds([...participantsIds, newMemberId]);
        }

        newChatroomMembersSub = chatApi
          .listenForNewChatroomMembers(selectedChatroom.chatroomId)
          .subscribe(addNewMember);
      }
      return () => newChatroomMembersSub && newChatroomMembersSub.unsubscribe();
    },

    [selectedChatroom, selectedUser, participantsIds, setParticipantsIds]
  );

  useEffect(
    function clearTypingUsers() {
      // TODO this might not be needed
      return function setThisUserNotTyping() {
        if (selectedChatroom.chatroomId) {
          chatApi.sendTypingInChatroomChange(
            selectedChatroom.chatroomId,
            false
          );
        } else if (selectedUser.userId) {
          chatApi.sendTypingDirectChange(selectedUser.userId, false);
        }
      };
    },
    [selectedChatroom, selectedUser]
  );

  // tslint:disable-next-line: no-shadowed-variable
  function TypingUserFragment({ userId, chatroomId, loggedInUser }) {
    const { isTyping, name } = useIsUserTyping(
      userId,
      loggedInUser,
      chatroomId
    );

    // TODO implement nicer looking UI for showing what users are typing
    // ? would making it's positioning absolute solve the jittering scrollbar issue
    return (
      <>
        {isTyping && (
          <Fade in={true}>
            <span>{name} is typing...</span>
          </Fade>
        )}
      </>
    );
  }

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

  function handleTypingChange(typing: boolean) {
    if (selectedChatroom.chatroomId) {
      chatApi.sendTypingInChatroomChange(selectedChatroom.chatroomId, typing);
    } else if (selectedUser.userId) {
      chatApi.sendTypingDirectChange(selectedUser.userId, typing);
    }
  }

  return (
    <Fade in={true}>
      <>
        {!recipientId && (
          <FlexView column grow vAlignContent="center" hAlignContent="center">
            <Typography
              variant="h5"
              color="inherit"
              className={classes.landingPageText}
            >
              {`Hello ${username}, select a chatroom or user to start chatting!`}
            </Typography>
          </FlexView>
        )}

        {recipientId && (
          <>
            <FlexView column grow basis="75%">
              {messagesStatus === fetchMessagesStatus.FETCHING && (
                <MessagePlaceholders placeholderCount={4} />
              )}
              {messagesStatus === fetchMessagesStatus.SUCCESS && (
                <MessageList messages={messages} />
              )}
              {messagesStatus === fetchMessagesStatus.ERROR && (
                <FlexView
                  column
                  grow
                  vAlignContent="center"
                  hAlignContent="center"
                >
                  <VerticalErrorMessage
                    className={classes.errorMessage}
                    errorMessage="Error: Failed to load messages!"
                    showError={true}
                    action={
                      <Button color="secondary" onClick={retryMessages}>
                        Retry
                      </Button>
                    }
                  />
                </FlexView>
              )}
            </FlexView>

            <Divider />

            <Typography>
              {participantsIds
                .filter(id => id !== userId)
                .map(id => (
                  <TypingUserFragment
                    key={id}
                    userId={id}
                    chatroomId={selectedChatroom.chatroomId}
                    loggedInUser={userId}
                  />
                ))}
            </Typography>

            <UserInput
              recipientId={recipientId}
              onTyping={handleTypingChange}
              onSendMessage={handleOnSendMessage}
            />
          </>
        )}
      </>
    </Fade>
  );
}

export default withStyles(styles)(Chat);
