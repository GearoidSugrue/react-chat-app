import { useState, useEffect, useMemo } from 'react';
import useFetch, { fetchStatus } from './Fetch.hook';

import { useChatApi } from '../chat-api/ChatApiContext';

export const fetchMessagesStatus = fetchStatus;

// fetches the message history and then adds new messages whenever they occur
export default function useMessages({ username, chatroom, selectedUser }) {
  const selectedUsername = selectedUser.username;
  const [messages, setMessages] = useState([]);
  const chatApi = useChatApi();

  const messagesEndpoint = useMemo(
    () =>
      (chatroom && `/rooms/${chatroom}/messages`) ||
      (selectedUsername && `/users/${selectedUsername}/messages`),
    [chatroom, selectedUsername]
  );

  const messagesConfig = useMemo(() => {
    if (selectedUsername) {
      console.log('in useMemo - selectedUser', selectedUsername);
      return {
        headers: {
          RequesterUsername: username
        }
      };
    }
  }, [chatroom, selectedUsername, username]);

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
      console.log('messages hook - subscribeToNewMessages');

      // todo change to function that takes in chatroom and/or selectedUser?
      const newMessageSub = chatApi.messages$.subscribe(message =>
        setMessages([...messages, message])
      );

      return () => newMessageSub.unsubscribe();
    },
    [chatApi, messages, setMessages]
  );

  return {
    ...fetch,
    messages
  };
}
