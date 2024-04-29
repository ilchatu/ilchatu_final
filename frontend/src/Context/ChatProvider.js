import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client"

const ENDPOINT = "https://ilchatu.com";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState (null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("onlineUsers", onlineUsers);

  const history = useHistory();

  useEffect(() => {
    const newSocket = socketIOClient (ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect ();
    }
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res)=> {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);


  useEffect(() => {
    setIsLoading(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    setIsLoading(false);
    if (!userInfo) history.push("/");
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        isLoading,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
