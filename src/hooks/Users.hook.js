import { useState, useEffect } from 'react';

import useFetch, { fetchStatus } from './Fetch.hook';
import { useChatApi } from '../chat-api/ChatApiContext';

export const fetchUsersStatus = fetchStatus;

// fetches the list of users and then updates the list whenever changes occur
export default function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const { data: fetchedUsers, ...fetch } = useFetch('users');
  const chatApi = useChatApi();

  useEffect(
    function setLoadedUsers() {
      console.log('chatApi in load users effect');

      setUsers(fetchedUsers);
    },
    [setUsers, fetchedUsers]
  );

  useEffect(
    function subscribeToUserList() {
      console.log('chatApi in subscribe to users effect');

      const usersSub = chatApi.usersUpdates$.subscribe(setUsers);

      return () => usersSub.unsubscribe();
    },
    [chatApi, setUsers]
  );

  return {
    ...fetch,
    users
  };
}