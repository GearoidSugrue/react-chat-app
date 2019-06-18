import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { UserType } from 'src/types';

export function useUserLogin() {
  const chatApi = useChatApi();
  const [user, setUser] = useState({} as UserType);
  const isLoggedIn = Boolean(user.userId);

  useEffect(
    function updateLoggedInUser() {
      console.log('useLoggedInUser - updateLoggedInUser effect');
      const loggedInUserSub = chatApi.loggedInUser$.subscribe(setUser);
      return () => loggedInUserSub && loggedInUserSub.unsubscribe();
    },
    [chatApi, setUser]
  );

  return { user, isLoggedIn };
}
