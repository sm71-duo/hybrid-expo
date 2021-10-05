import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Config } from "react-native-config";

const socket = io(Config.WEBSOCKET_URL);

export type SocketProps = {
  talking: boolean;
  websocketId: string;
  socket: typeof socket;
  currentChannel: string;
  joinRoom: (channel: string) => Promise<void>;
  leaveRoom: (channel: string) => Promise<void>;
  changeRoom: (oldChannel: string, newChannel: string) => Promise<void>;
};

export const socketContext = createContext<SocketProps>({
  talking: false,
  websocketId: "",
  socket: socket,
  currentChannel: "",
  joinRoom: async () => undefined,
  leaveRoom: async () => undefined,
  changeRoom: async () => undefined,
});

export const useWebsocket = () => {
  return useContext(socketContext);
};

const useWebsockets = () => {
  const [talking, setTalking] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<string>("");
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
      setCurrentChannel(payload.channel);
      setWebsocketId(payload.socketId);
    });

    return () => {
      if (socket.connected) socket.close();
    };
  }, [socket]);

  const joinRoom = async (channel: string) => {
    await socket.emit("join_room", channel);
  };

  const leaveRoom = async (channel: string) => {
    await socket.emit("leave_room", channel);
  };

  const changeRoom = async (oldChannel: string, newChannel: string) => {
    Promise.all([leaveRoom(oldChannel), joinRoom(newChannel)]).catch((err) => {
      console.log(err);
    });
  };

  return {
    talking,
    websocketId,
    socket,
    currentChannel,
    joinRoom,
    leaveRoom,
    changeRoom,
  };
};

export const WebsocketProvider: React.FC = ({ children }) => {
  const socket = useWebsockets();

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};
