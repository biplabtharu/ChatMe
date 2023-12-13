import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const SelectedUserForGroup = ({ user, handleFunction, admin }) => {
  return (
    <>
      <Box
        m={1}
        mb={2}
        variant={"solid"}
        fontSize={12}
        colorScheme="purple"
        bg={"#E2E8F0"}
        cursor={"pointer"}
        p={1}
        borderRadius={"2px"}
        onClick={handleFunction}
      >
        {user.name}
        {admin === user._id && <span>(Admin)</span>}
        <CloseIcon
          boxSize={3}
          d="flex"
          justifyContent={"center"}
          alignContent={"center"}
          pl={1}
        />
      </Box>
    </>
  );
};

export default SelectedUserForGroup;
