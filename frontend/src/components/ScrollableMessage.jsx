import React from "react";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "./chatHelper/chatIde";
import { ChatState } from "../context/ChatProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableMessage = ({ messages }) => {
  // console.log(`message is `);
  // console.log(messages);
  const { user } = ChatState();
  const userId = user._id;
  // console.log(userId);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, userId) ||
              isLastMessage(messages, i, userId)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt={"10px"}
                  ml={1}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === userId ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, userId),
                marginTop: isSameUser(messages, m, i, userId) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableMessage;
