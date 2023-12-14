import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigateTo = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("signin-user-data"));
    if (!userInfo) {
      navigateTo("/");
      return;
    }
    setUser(userInfo);
  }, [navigateTo, user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
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
