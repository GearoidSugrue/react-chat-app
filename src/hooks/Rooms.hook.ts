import { useEffect, useState } from 'react';

import { useChatApi } from 'src/chat-api';
import { fetchStatus, useFetch } from 'src/hooks';
import { ChatroomType } from 'src/types';

export const fetchRoomsStatus = fetchStatus;

/**
 * A hook that fetches the list of rooms and then updates the list whenever a new room event occurs
 * @param roomFilterPredicate - A function used to filter the returned results
 */
export function useFetchRooms(
  roomFilterPredicate?: (room: ChatroomType) => boolean // TODO delete this if it's not gonna be used
) {
  const [rooms, setRooms] = useState([] as ChatroomType[]);
  const { data: fetchedRooms, ...fetch } = useFetch('/rooms');
  const chatApi = useChatApi();

  function addRooms(newRooms: ChatroomType[]) {
    if (newRooms) {
      setRooms([...rooms, ...newRooms]);
    }
  }

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
    rooms,
    addRooms
  };
}
