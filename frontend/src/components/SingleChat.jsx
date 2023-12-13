import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  Input,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./chatHelper/chatIde";
import ProfileModal from "./miscellaneous/ProfileModal";
import ViewUserProfile from "./miscellaneous/ViewUserProfile";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import "./styles.css";
import ScrollableMessage from "./ScrollableMessage";
import io from "socket.io-client";
import Lottie from "react-lottie";

import animation from "../components/animation/animations.json";

const ENDPOINT = "https://chatme-u7pb.onrender.com";
let socket;
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // const [roomId, setRoomId] = useState();
  const toast = useToast();

  const { token } = user;

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // socket.on("typing", (room) => setRoomId(room));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(notifications);
  useEffect(() => {
    // console.log(selectedChatCompare);
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }

        //give notifications
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const fetchMessages = async (req, res) => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      // console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      console.log(err);
      toast({
        title: "fetching message error occured",
        description: err.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      // console.log(e.target.value);
      socket.emit("stop typing", selectedChat._id);
      // setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chat: selectedChat._id,
          },
          config
        );
        // console.log(data);

        setNewMessage(" ");
        // console.log(` new message is ${newMessage}`);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        // setLoading(false);
      } catch (err) {
        console.log(err);
        toast({
          title: "sending message error occured",
          description: err.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        // setLoading(false);
      }
    }
  };

  const typeHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    // console.log(`last typing time ${lastTypingTime}`);
    let typingIndicatorLength = 3000;
    setTimeout(() => {
      let latestTime = new Date().getTime();
      // console.log(`latest typing time ${latestTime}`);

      let timeDifference = latestTime - lastTypingTime;
      // console.log(`time difference ${timeDifference}`);
      if (timeDifference >= typingIndicatorLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, typingIndicatorLength);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "18px", md: "20px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
            fontWeight={600}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
              icon={<ArrowBackIcon />}
            ></IconButton>

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ViewUserProfile
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            // pl={2}
            // pr={10}
            bg={"#E2E8F0"}
            w="100%"
            h="94%"
            // border={"1px"}
            borderRadius={"lg"}
            // overflowY={"scroll"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w="16"
                h="16"
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableMessage messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage}>
              {isTyping ? (
                <Lottie
                  options={defaultOptions}
                  height={50}
                  width={50}
                  style={{ marginBottom: "0", marginLeft: "0" }}
                />
              ) : (
                <></>
              )}
              <Input
                type="text"
                placeholder="type a message"
                variant={"filled"}
                width={"100%"}
                mt={2}
                bg={"#ffffff"}
                onChange={typeHandler}
                value={newMessage}
                border={"1px solid #E2E8F0"}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text
            fontSize={{ lg: "25px", md: "18px", base: "14px" }}
            fontFamily={"Poppins"}
          >
            Click on a user or group to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
