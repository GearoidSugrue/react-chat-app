import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';

export const fetchRoomsStatus = fetchStatus;

// fetches the list of rooms and then updates the list whenever changes occur
export function useFetchRooms() {
  const [rooms, setRooms] = useState([]);
  const { data: fetchedRooms, ...fetch } = useFetch('/rooms');
  const chatApi = useChatApi();

  useEffect(
    function setLoadedRooms() {
      console.log('chatApi in load rooms effect');

      setRooms(fetchedRooms);
    },
    [setRooms, fetchedRooms]
  );

  useEffect(
    function subscribeToChatroomsList() {
      console.log('chatApi in subscribe to rooms effect');

      const chatroomsSub = chatApi.chatroomsUpdates$.subscribe(setRooms);

      return () => chatroomsSub.unsubscribe();
    },
    [chatApi, setRooms]
  );

  return {
    ...fetch,
    rooms
  };
}
