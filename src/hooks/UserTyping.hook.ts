import { useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';

import { useChatApi } from 'src/chat-api';
import { TypingChange } from 'src/types';
import { useOnlineStatus } from './OnlineStatus.hook';

export function useIsUserTyping(
  userId: string,
  loggedInUserId: string,
  toChatroomId?: string
) {
  const chatApi = useChatApi();
  const online = useOnlineStatus({ userId, online: true });

  const [isTyping, setIsTyping] = useState(false);
  const [name, setName] = useState('');

  useEffect(
    function setNotTypingWhenOffline() {
      console.log('setNotTypingWhenOffline effect');

      if (!online) {
        setIsTyping(false);
      }
    },
    [online, setIsTyping]
  );

  useEffect(
    function subscribeToUserTyping() {
      console.log('subscribeToUserTyping effect');

      let typingUpdate$: Observable<TypingChange>;
      let typingUpdateSub: Subscription;

      if (toChatroomId) {
        typingUpdate$ = chatApi.listenForChatroomTypingChange$(
          userId,
          toChatroomId
        );
      } else {
        typingUpdate$ = chatApi.listenForDirectTypingChange$(
          userId,
          loggedInUserId
        );
      }

      if (typingUpdate$) {
        typingUpdateSub = typingUpdate$.subscribe(
          (typingUpdate: TypingChange) => {
            setIsTyping(typingUpdate.typing);
            setName(typingUpdate.username);
          }
        );
      }

      return () => typingUpdateSub && typingUpdateSub.unsubscribe();
    },
    [chatApi, userId, toChatroomId, loggedInUserId, setName]
  );

  return { isTyping, name };
}
