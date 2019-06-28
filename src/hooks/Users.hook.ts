import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { OnlineStatusMessage, UserType } from 'src/types';

export const fetchUsersStatus = fetchStatus;

// fetches the list of users and then updates the list whenever changes occur

// todo: remove filter predicate if it's not used
export function useFetchUsers(
  usersFilterPredicate?: (user: UserType) => boolean,
  userIds?: string[]
) {
  const [users, setUsers] = useState<UserType[]>([]);

  // todo: if !!userIds, load just them instead of all users
  const { data: fetchedUsers, ...fetch } = useFetch('/users');
  const chatApi = useChatApi();

  // todo: add effect that runs on 'userIds' change that re-fetches users

  useEffect(
    function setLoadedUsers() {
      const filteredUsers = usersFilterPredicate
        ? fetchedUsers.filter(usersFilterPredicate)
        : fetchedUsers;

      setUsers(filteredUsers);
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

      // todo implement this correctly! Listen for new users!
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
