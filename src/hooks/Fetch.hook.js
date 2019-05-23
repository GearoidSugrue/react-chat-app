import { useState, useEffect } from 'react';
import axios from 'axios';

const FETCHING = `FETCHING`;
const SUCCESS = `SUCCESS`;
const ERROR = `ERROR`;

export const fetchStatus = {
  FETCHING,
  SUCCESS,
  ERROR
};

function useFetch(endpoint) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(FETCHING);
  const [retryCount, setRetryCount] = useState(1);

  // I created this to enable the parent component to retry loading users if an error occurs
  const retry = () => setRetryCount(retryCount + 1);

  useEffect(
    function loadData() {
      console.log('Fetching data, count', retryCount);

      const fetchUsers = async () => {
        setStatus(FETCHING);

        try {
          const result = await axios(`http://localhost:3001/${endpoint}`);
          setData(result.data);
          setStatus(SUCCESS);
        } catch (error) {
          console.log('Error fetching data', endpoint, error);
          setStatus(ERROR);
        }
      };

      fetchUsers();
    },
    [retryCount]
  );

  return { data, status, retry, retryCount };
}

export default useFetch;
