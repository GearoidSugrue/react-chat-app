import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';

export const fetchUsersStatus = fetchStatus;

// fetches the list of users and then updates the list whenever changes occur
export function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const { data: fetchedUsers, ...fetch } = useFetch('/users');
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

      // todo implement this correctly!
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
