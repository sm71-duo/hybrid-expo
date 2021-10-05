import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Config } from "react-native-config";

const socket = io(Config.WEBSOCKET_URL);
export const socketContext = createContext({
  talking: false,
  websocketId: "",
  socket: socket,
});

export const useWebsocket = () => {
  return useContext(socketContext);
};

const useWebsockets = () => {
  const [talking, setTalking] = useState<boolean>(false);
  const [websocketId, setWebsocketId] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      setWebsocketId(socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log(err.message);
    });

    socket.on("talking", (payload) => {
      setTalking(payload.talking);
      setWebsocketId(payload.socketId);
    });

    return () => {
      if (socket.connected) socket.close();
    };
  }, [socket]);

  return {
    talking,
    websocketId,
    socket,
  };
};

export const WebsocketProvider: React.FC = ({ children }) => {
  const socket = useWebsockets();

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};
