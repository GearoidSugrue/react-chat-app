import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { OnlineStatusMessage, UserType } from 'src/types';

export const fetchUsersStatus = fetchStatus;

/**
 * A hook that fetches the list of users and then updates the list whenever a new user is created or online status changes
 */
export function useFetchUsers() {
  const [users, setUsers] = useState<UserType[]>([]);

  // ? if !!userIds, load just them instead of all users
  const { data: fetchedUsers, ...fetch } = useFetch('/users');
  const chatApi = useChatApi();

  // ? maybe add effect that runs on 'userIds' change that re-fetches users

  useEffect(
    function setLoadedUsers() {
      // todo: only load provided user ids instead of this...
      const onlineStatusComparator = (
        { online: onlineA }: UserType,
        { online: onlineB }: UserType
      ) => (onlineA === onlineB ? 0 : onlineA ? -1 : 1);

      setUsers(fetchedUsers.sort(onlineStatusComparator));
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
    function subscribeToNewUsers() {
      console.log('subscribeToUserList effect');

      function addNewUser(newUser: UserType) {
        setUsers([...users, newUser]);
      }
      const usersSub = chatApi.usersUpdates$.subscribe(addNewUser);

      return () => usersSub.unsubscribe();
    },
    [chatApi, users, setUsers]
  );

  return {
    ...fetch,
    users
  };
}
