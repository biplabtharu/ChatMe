import React from "react";
import {
  Stack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

const ChatLoadingSmall = () => {
  return (
    <>
      <Stack mt={"14px"}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </>
  );
};

export default ChatLoadingSmall;
