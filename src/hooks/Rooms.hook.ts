import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { ChatroomType } from 'src/types';

export const fetchRoomsStatus = fetchStatus;

// fetches the list of rooms and then updates the list whenever changes occur
export function useFetchRooms(
  roomFilterPredicate?: (room: ChatroomType) => boolean
) {
  const [rooms, setRooms] = useState([]);
  const { data: fetchedRooms, ...fetch } = useFetch('/rooms');
  const chatApi = useChatApi();

  useEffect(
    function setLoadedRooms() {
      console.log('chatApi in load rooms effect');
      const filteredRooms = roomFilterPredicate
        ? fetchedRooms.filter(roomFilterPredicate)
        : fetchedRooms;
      setRooms(filteredRooms);
    },
    [setRooms, roomFilterPredicate, fetchedRooms]
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
