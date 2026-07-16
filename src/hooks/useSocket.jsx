import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (sessionId) => {
  const [socket, setSocket] = useState(null);
  const [liveAttendance, setLiveAttendance] = useState([]);

  useEffect(() => {
    if (!sessionId) return;

    // Connect to the backend
    const socketInstance = io(import.meta.env.VITE_API_HOST);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to realtime server');
      socketInstance.emit('joinSession', sessionId);
    });

    socketInstance.on('newAttendance', (data) => {
      console.log('Realtime attendance received:', data);
      setLiveAttendance((prev) => [data, ...prev]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [sessionId]);

  return { socket, liveAttendance };
};

export default useSocket;
