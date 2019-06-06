import { useEffect, useState } from 'react';

import { ChatApi } from 'src/chat-api/ChatApi';
import { useChatApi } from '../chat-api/ChatApiContext';

// after providing an initial online status this hook will be notified if the user's online status changes
export default function useOnlineStatus({
  userId,
  online: initialOnlineStatus
}: {
  userId: string;
  online: boolean;
}) {
  const [onlineStatus, setOnlineStatus] = useState(
    Boolean(initialOnlineStatus)
  );
  const chatApi: ChatApi = useChatApi();

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
