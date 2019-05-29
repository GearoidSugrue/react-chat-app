import React, { useState, useEffect } from 'react';

import { useChatApi } from '../chat-api/ChatApiContext';

// after providing an initial online status this hook will be notified if the user's online status changes
export default function useOnlineStatus({
  username,
  online: initialOnlineStatus
}) {
  const [onlineStatus, setOnlineStatus] = useState(
    Boolean(initialOnlineStatus)
  );
  const chatApi = useChatApi();

  useEffect(
    function subscribeToUserOnlineStatus() {
      console.log('chatApi in subscribe to user online status effect');

      const onlineStatusSub = chatApi
        .userOnlineStatus$({ username })
        .subscribe(setOnlineStatus);

      return () => onlineStatusSub.unsubscribe();
    },
    [chatApi, setOnlineStatus]
  );

  return onlineStatus; // todo check if this should be array
}
