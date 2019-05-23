import useFetch, { fetchStatus } from './Fetch.hook';

export const fetchUsersStatus = fetchStatus;

function useFetchUsers() {
  const { data: users, ...fetch } = useFetch('users');

  return {
    ...fetch,
    users
  };
}

export default useFetchUsers;
