import { useState, useEffect } from 'react';
import axios from 'axios';

const FETCHING = `FETCHING`;
const SUCCESS = `SUCCESS`;
const ERROR = `ERROR`;

export const fetchRoomsStatus = {
    FETCHING,
    SUCCESS,
    ERROR
};

// useFetchRooms and useFetchUsers are practically the same so it might be worth further abstraction into a useFetchUrl or something like that
function useFetchRooms() {
    const [rooms, setRooms] = useState([]);
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
                    // todo get host from env file or react best practice equivalent 
                    const result = await axios('http://localhost:3001/rooms');
                    const allRooms = result.data || [];
                    console.log(allRooms)
                    setRooms(allRooms);
                    setStatus(SUCCESS)
                } catch (error) {
                    console.log('Error loading rooms', error);
                    setStatus(ERROR)
                }
            };

            fetchUsers();
        }, [retryCount]);

    return { rooms, status, retry, retryCount };
}

export default useFetchRooms;
