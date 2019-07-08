/**
 * This wraps an instance of ChatApi in a Context and exposes a Provider and for it.
 * The Provider is used to wrap the App, this then enables any component to use the 'useChatApi' hook to get the same instance of ChatApi.
 */
import * as React from 'react';
import { createContext, useContext } from 'react';

import openSocket from 'socket.io-client';

import { ChatApi } from './ChatApi';

const chatApiInstance = new ChatApi(
  openSocket(`http://${process.env.REACT_APP_API_HOST}`)
);
export const ChatApiContext = createContext(chatApiInstance);

// chatApi can be provided if a different chatApi is wanted for some part of the app. Not really needed but ehh...
export const ChatApiProvider = ({ chatApi, children }: any) => (
  <ChatApiContext.Provider value={chatApi || chatApiInstance}>
    {children}
  </ChatApiContext.Provider>
);

/**
 * This convenance hook that allows all components to use the ChatApi instance without having to import both ChatApiContext and useContext.
 */
export const useChatApi = () => useContext(ChatApiContext);
