import { useState, useEffect } from 'react';
import useFetch, { fetchStatus } from './Fetch.hook';

import { useChatApi } from '../chat-api/ChatApiContext';

export const fetchRoomsStatus = fetchStatus;

// fetches the message history and then adds new messages whenever they occur
export default function useMessages({ username, chatroom, selectedUser }) {
  const [messages, setMessages] = useState([]);

  // todo this should be made simpler..
  const fetchMessagesEndpoint = Boolean(chatroom)
    ? 'rooms/:chatroom/messages'
    : 'users/:username/messages';

  const fetchMessagesConfig = Boolean(chatroom)
    ? {
        params: {
          chatroom
        }
      }
    : {
        params: {
          username: selectedUser.username
        },
        headers: {
          RequesterUsername: username
        }
      };

  const { data: fetchedMessages, ...fetch } = useFetch(
    fetchMessagesEndpoint,
    fetchMessagesConfig
  );
  const chatApi = useChatApi();

  useEffect(
    function setLoadedMessages() {
      console.log('chatApi in set loaded messages effect', fetchedMessages);

      setMessages(fetchedMessages);
    },
    [setMessages, fetchedMessages]
  );

  useEffect(
    function subscribeToNewMessages() {
      console.log('chatApi in subscribe to rooms effect');

      // todo change to function that takes in chatroom and/or selectedUser?
      const newMessageSub = chatApi.messages$.subscribe(message =>
        setMessages([...messages, message])
      );

      return () => newMessageSub.unsubscribe();
    },
    [chatApi, setMessages]
  );

  return {
    ...fetch,
    messages
  };
}
