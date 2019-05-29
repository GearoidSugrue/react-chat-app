import React, { createContext, useContext } from 'react';

import openSocket from 'socket.io-client';

import { ChatApi } from './ChatApi';

export const ChatApiContext = createContext();

// chatApi can be provided if a different chatApi is wanted for some part of the app. Not really needed but ehh...
export const ChatApiProvider = ({ chatApi, children }) => (
  <ChatApiContext.Provider
    value={chatApi || new ChatApi(openSocket('http://localhost:3001'))}
  >
    {children}
  </ChatApiContext.Provider>
);

// todo: should this be moved to hooks dir?
// custom hook to make it even easier for functions to use the ChatApi
export const useChatApi = () => useContext(ChatApiContext);
