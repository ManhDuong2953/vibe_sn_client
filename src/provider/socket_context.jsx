import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Tạo context
const SocketContext = createContext();

// URL server của bạn, thay đổi nếu cần
const SOCKET_URL = process.env.REACT_APP_PORT_SOCKET;

// Tạo Provider để quản lý kết nối socket
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    setSocket(newSocket);

    
    // Cleanup khi component bị unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Hook để dùng socket ở các component khác
export const useSocket = () => {
  return useContext(SocketContext);
};
