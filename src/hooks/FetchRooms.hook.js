import useFetch, { fetchStatus } from './Fetch.hook';

export const fetchRoomsStatus = fetchStatus;

function useFetchRooms() {
  const { data: rooms, ...fetch } = useFetch('rooms');

  return {
    ...fetch,
    rooms
  };
}

export default useFetchRooms;
