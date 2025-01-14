import React, { useEffect, useState } from 'react';
import { getConfig } from "../config";

function PPPClientStatus({ serviceName }) {
  const [status, setStatus] = useState('inactive');

  useEffect(() => {
    const websocketURL = process.env.REACT_APP_WEBSOCKET_URL
    // const websocketURL = getConfig("REACT_APP_WEBSOCKET_URL")
    const socket = new WebSocket(`${websocketURL}ppp/service-status/`);

    socket.onopen = () => {
      // Send the client service name to the server
      socket.send(JSON.stringify({ service_name: serviceName }));
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);  // Update the status whenever the server sends a message
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, [serviceName]);

  return status === "online" ? (
    <h1 className='text-blue-400'>{status}</h1>
  ) :
  status === "offline" ?
  (
    <h1 className='text-orange-400'>{status}</h1>
  ) :
  (
    <h1>{status}</h1>
  );
}

export default PPPClientStatus;
