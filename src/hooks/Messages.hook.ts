import { useEffect, useMemo, useState } from 'react';
import { Observable, Subscription } from 'rxjs';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { ChatroomType, Message, UserType } from 'src/types';

export const fetchMessagesStatus = fetchStatus;

type UseMessagesProps = {
  userId: string;
  selectedChatroom: ChatroomType;
  selectedUser: UserType;
};

/**
 *  Fetches messages and listens for new messages
 */
export function useMessages({
  userId,
  selectedChatroom,
  selectedUser
}: UseMessagesProps) {
  const selectedChatroomId = selectedChatroom.chatroomId;
  const selectedUserId = selectedUser.userId;
  const [messages, setMessages] = useState([]);
  const chatApi = useChatApi();

  const messagesEndpoint = useMemo(
    () =>
      (selectedChatroomId && `/rooms/${selectedChatroomId}/messages`) ||
      (selectedUserId && `/users/${selectedUserId}/messages`),
    [selectedChatroomId, selectedUserId]
  );

  const messagesConfig = useMemo(() => {
    if (selectedChatroomId || selectedUserId) {
      console.log('in useMemo - selectedUserId', selectedUserId);
      return {
        headers: {
          RequesterUserId: userId
        }
      };
    }
    return undefined;
  }, [selectedChatroomId, selectedUserId, userId]);

  const { data: fetchedMessages, ...fetch } = useFetch(
    messagesEndpoint,
    messagesConfig
  );

  useEffect(
    function setLoadedMessages() {
      console.log('messages hook - setLoadedMessages effect', fetchedMessages);
      setMessages(fetchedMessages);
      return () => setMessages([]); // ? is this needed?
    },
    [setMessages, fetchedMessages]
  );

  useEffect(
    function subscribeToNewMessages() {
      console.log('messages hook - subscribeToNewMessages', { selectedUserId });
      let newMessage$: Observable<Message>;
      let newMessageSub: Subscription;

      if (selectedChatroomId) {
        newMessage$ = chatApi.listenForChatroomMessages$(selectedChatroomId);
      } else if (selectedUserId) {
        newMessage$ = chatApi.listenForUserMessages({ userId, selectedUserId });
      }

      if (newMessage$) {
        newMessageSub = newMessage$.subscribe(message =>
          setMessages([...messages, message])
        );
      }
      return () => newMessageSub && newMessageSub.unsubscribe();
    },
    [chatApi, messages, setMessages, userId, selectedChatroomId, selectedUserId]
  );

  return {
    ...fetch,
    messages
  };
}
