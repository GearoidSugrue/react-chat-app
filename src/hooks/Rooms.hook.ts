import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { ChatroomType } from 'src/types';

export const fetchRoomsStatus = fetchStatus;

// fetches the list of rooms and then updates the list whenever changes occur
export function useFetchRooms(
  roomFilterPredicate?: (room: ChatroomType) => boolean // todo delete this if it's not gonna be used
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
    [setRooms, fetchedRooms]
  );

  useEffect(
    function subscribeToNewChatrooms() {
      console.log('chatApi in subscribe to new chatrooms effect');

      function addRoom(newChatroom: ChatroomType) {
        const alreadyHasRoom: boolean = Boolean(
          rooms.find(room => room.chatroomId === newChatroom.chatroomId)
        );
        if (!alreadyHasRoom) {
          setRooms([...rooms, newChatroom]);
        }
      }

      const chatroomsSub = chatApi.newChatroom$.subscribe(addRoom);

      return () => chatroomsSub.unsubscribe();
    },
    [chatApi, rooms, setRooms]
  );

  return {
    ...fetch,
    rooms
  };
}
