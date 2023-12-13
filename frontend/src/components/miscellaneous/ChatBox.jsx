import React from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  // console.log(`chatbox fetchagain ${fetchAgain}`);
  // console.log(`again from chatbox ${setFetchAgain(!fetchAgain)}`);
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={5}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
