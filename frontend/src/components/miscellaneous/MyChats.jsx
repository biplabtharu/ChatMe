import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { Box, Button, Text, useToast, Stack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import GroupChatModel from "./GroupChatModel";

import ChatLoading from "./ChatLoading";
import { getSender } from "../chatHelper/chatIde";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, chats, setChats, user, setUser } =
    ChatState();
  const { token } = user;

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(chats);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);

      setChats(data);
    } catch (err) {
      console.log(`fetching chats error ${err}`);
      toast({
        title: "Error occured",
        description: "failed to load the chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("signin-user-data")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection={"column"}
        p={3}
        bg={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          px={3}
          fontFamily={"Poppins"}
          display={"flex"}
          w={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={{ base: "24px", md: "20px", lg: "24px" }}>
            My chats
          </Text>
          <GroupChatModel>
            <Button
              fontSize={{ base: "17px", md: "13px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group chat
            </Button>
          </GroupChatModel>
        </Box>

        <Box
          display={"flex"}
          flexDir={"column"}
          p={3}
          // bg={"#F8F8F8"}
          w={"100%"}
          h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"hidden"}>
              {chats.map((chat) => {
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor={"pointer"}
                    bg={selectedChat === chat ? "#c77dff" : "#E2E8F0"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(user, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
