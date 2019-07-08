import { useEffect, useState } from 'react';

import { ChatApi, useChatApi } from 'src/chat-api';
import { OnlineStatusMessage } from 'src/types';

/**
 * A hook that listens for changes in a user's online status.
 *
 * @param onlineStatusUpdate - the userId of the user to listen for and their current online status
 * @param initialOnlineStatus - the user's current online status
 */
export function useOnlineStatus({
  userId,
  online
}: OnlineStatusMessage): boolean {
  const chatApi: ChatApi = useChatApi();
  const [onlineStatus, setOnlineStatus] = useState(Boolean(online));

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
