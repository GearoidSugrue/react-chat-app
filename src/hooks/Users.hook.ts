import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { OnlineStatusMessage, UserType } from 'src/types';

export const fetchUsersStatus = fetchStatus;

/**
 * A hook that fetches the list of users and then updates the list whenever a new user is created or online status changes
 */
export function useFetchUsers(
  usersFilterPredicate?: (user: UserType) => boolean, // TODO: remove filter predicate if it's not used
  userIds?: string[]
) {
  const [users, setUsers] = useState<UserType[]>([]);

  // ? if !!userIds, load just them instead of all users
  const { data: fetchedUsers, ...fetch } = useFetch('/users');
  const chatApi = useChatApi();

  // ? maybe add effect that runs on 'userIds' change that re-fetches users

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

      // TODO implement this correctly! Listen for new users!
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
