import { useEffect } from 'react';
import {io} from 'socket.io-client';


const socket = io('https://code-meet-socket-server.vercel.app:3000', {
    transports: ['websocket'], // Specify WebSocket transport,
  });

const useSocket = (collab: boolean) => {
  if (collab) {
    console.log(collab)
    useEffect(() => {
      socket.on('connect', () => {
          console.log('Connected to server');
        });
    
        socket.on('disconnect', () => {
          console.log('Disconnected from server');
      });
      return () => {
          // if (socket.connected) {
          //     socket.disconnect();
          //   }      
      };
    }, []);

    return socket;
  }
};

export default useSocket;