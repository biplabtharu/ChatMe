import React from "react";
import { Box, Text, Avatar } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor={"pointer"}
        background={"#e6e6e6"}
        _hover={{ background: "#38B2AC", color: "white" }}
        w="100%"
        display={"flex"}
        alignItems={"center"}
        color={"black"}
        px={3}
        py={2}
        mb={2}
        mt={3}
        borderRadius={"lg"}
      >
        <Avatar
          mr={2}
          size={"sm"}
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />

        <Box>
          <Text>{user.name}</Text>
          <Text fontSize={"13px"}>
            <span style={{ fontWeight: "bold" }}>Email: </span>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
