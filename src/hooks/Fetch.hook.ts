import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

const FETCHING = `FETCHING`;
const SUCCESS = `SUCCESS`;
const ERROR = `ERROR`;

export const fetchStatus = {
  FETCHING,
  SUCCESS,
  ERROR
};

export function useFetch(endpoint: string, fetchConfig?: AxiosRequestConfig) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(FETCHING);
  const [retryCount, setRetryCount] = useState(1);

  // I created this to enable the parent component to retry loading users if an error occurs
  const retry = () => setRetryCount(retryCount + 1);

  useEffect(
    function loadData() {
      console.log('Fetching data, count', retryCount);

      const fetchData = async () => {
        setStatus(FETCHING);

        try {
          const result = await axios({
            url: `http://${process.env.REACT_APP_API_HOST}${endpoint}`,
            ...fetchConfig
          });
          setData(result.data);
          setStatus(SUCCESS);
        } catch (error) {
          console.log('Error fetching data', endpoint, error);
          setStatus(ERROR);
        }
      };

      if (endpoint) {
        fetchData();
      }
    },
    [endpoint, fetchConfig, retryCount, setStatus, setData]
  );

  return { data, status, retry, retryCount };
}
