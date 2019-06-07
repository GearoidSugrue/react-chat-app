import { useEffect, useMemo, useState } from 'react';
import useFetch, { fetchStatus } from './Fetch.hook';

import { Observable, Subscription } from 'rxjs';
import { useChatApi } from '../chat-api/ChatApiContext';

export const fetchMessagesStatus = fetchStatus;

// todo type this properly

// fetches the message history and then adds new messages whenever they occur
export default function useMessages({
  userId,
  selectedChatroom,
  selectedUser
}) {
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
      return () => setMessages([]); // todo is this needed?
    },
    [setMessages, fetchedMessages]
  );

  useEffect(
    function subscribeToNewMessages() {
      console.log('messages hook - subscribeToNewMessages', { selectedUserId });
      let newMessage$: Observable<any>; // todo add Message type
      let newMessageSub: Subscription;

      if (selectedChatroomId) {
        newMessage$ = chatApi.listenForChatroomMessages(selectedChatroomId);
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
