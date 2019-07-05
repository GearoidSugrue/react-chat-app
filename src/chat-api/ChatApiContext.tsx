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

export const useChatApi = () => useContext(ChatApiContext);
