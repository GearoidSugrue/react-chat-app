import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { OnlineStatusMessage, UserType } from 'src/types';

export const fetchUsersStatus = fetchStatus;

// fetches the list of users and then updates the list whenever changes occur
export function useFetchUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const { data: fetchedUsers, ...fetch } = useFetch('/users');
  const chatApi = useChatApi();

  useEffect(
    function setLoadedUsers() {
      setUsers(fetchedUsers);
    },
    [setUsers, fetchedUsers]
  );

  useEffect(
    function subscribeToUsersOnlineStatuses() {
      function updateUserOnlineStatus({ userId, online }: OnlineStatusMessage) {
        if (userId) {
          const userIndex = users.findIndex(user => user.userId === userId);

          if (userIndex) {
            const updatedUser = {
              ...users[userIndex],
              online
            };
            users[userIndex] = updatedUser;
            setUsers([...users]);
          }
        }
      }
      const usersOnlineStatusesSub = chatApi.onlineStatusUpdates$.subscribe(
        updateUserOnlineStatus
      );

      return () => usersOnlineStatusesSub.unsubscribe();
    },
    [chatApi, users, setUsers]
  );

  useEffect(
    function subscribeToUserList() {
      console.log('chatApi in subscribe to new users effect');

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
