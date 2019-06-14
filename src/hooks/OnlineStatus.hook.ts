import { useEffect, useState } from 'react';

import { ChatApi } from 'src/chat-api/ChatApi';
import { useChatApi } from 'src/chat-api/ChatApiContext';
import { OnlineStatusMessage } from 'src/types/OnlineStatusMessage.type';

// after providing an initial online status this hook will be notified if the user's online status changes
export default function useOnlineStatus(
  {
    userId,
    online
  }: OnlineStatusMessage,
  initialOnlineStatus?: boolean
) {
  const chatApi: ChatApi = useChatApi();
  const [onlineStatus, setOnlineStatus] = useState(
    Boolean(online || initialOnlineStatus)
  );

  useEffect(
    function subscribeToUserOnlineStatus() {
      console.log('chatApi in subscribe to user online status effect');

      const onlineStatusSub = chatApi
        .userOnlineStatus$({ userId })
        .subscribe(setOnlineStatus);

      return () => onlineStatusSub.unsubscribe();
    },
    [chatApi, setOnlineStatus]
  );

  return onlineStatus;
}
