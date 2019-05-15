import { useState, useEffect } from 'react';
import axios from 'axios';

// export const fetchUsersStatus = {
//   FETCHING: 'FETCHING',
//   SUCCESS: 'SUCCESS',
//   ERROR: 'ERROR'
// }

const FETCHING = `FETCHING`;
const SUCCESS = `SUCCESS`;
const ERROR = `ERROR`;

export const fetchUsersStatus = {
  FETCHING,
  SUCCESS,
  ERROR
};

function useFetchUsers() { // todo add deafult users?
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(FETCHING);
  const [retryCount, setRetryCount] = useState(1);

  // I created this to enable the parent component to retry loading users if an error occurs 
  const retry = () => setRetryCount(retryCount + 1);

  useEffect(
    function loadUsers() {
      console.log('Loading users, count', retryCount)

      const fetchUsers = async () => {
        setStatus(FETCHING)

        try {
          const result = await axios('http://localhost:3001/users');
          // const allUsers = Object.values(result.data || {})
          const allUsers = result.data || [];
          console.log(allUsers)
          setUsers(allUsers);
          setStatus(SUCCESS)
        } catch (error) {
          console.log('Error loading users', error);
          setStatus(ERROR)
        }
      };

      fetchUsers();
    }, [retryCount]);

  return { users, status, retry, retryCount };
}

export default useFetchUsers;
