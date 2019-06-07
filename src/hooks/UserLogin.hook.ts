import { useEffect, useState } from 'react';

import { User } from 'src/types/User.type';
import { useChatApi } from '../chat-api/ChatApiContext';

export default function useUserLogin() {
  const chatApi = useChatApi();
  const [user, setUser] = useState({} as User);
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
