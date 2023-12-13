import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";

import ChatLoading from "./ChatLoading";
import UserListItem from "../userProfile/UserListItem";
import { getSender } from "../chatHelper/chatIde";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure([]);
  const btnRef = React.useRef();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const { token } = user;
  //   const { _id } = user.data.userExists._id;

  const navigateTo = useNavigate();

  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState();

  const logOutHandler = () => {
    localStorage.removeItem("signin-user-data");
    navigateTo("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Write something to search.",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      // console.log(data);
      setSearchResult(data);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Unable to get results",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      console.log(`error in search handling ${err}`);
    }
  };

  const accessChats = async (userId) => {
    try {
      setChatLoading(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      // console.log(`access chat data ${data}`);
      // console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(chats);

      setSelectedChat(data);
      setChatLoading(false);
      onClose();
    } catch (err) {
      console.log(`error accessing chat ${err}`);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="10px"
        borderWidth={"1px"}
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button ref={btnRef} onClick={onOpen} variant={"ghost"}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="26px" fontFamily="Poppins" fontWeight={"600"}>
          ChatMe
        </Text>

        <div>
          <Menu>
            <MenuButton mr={3}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" />
            </MenuButton>

            <MenuList pl={3}>
              {!notifications.length && `No new messages`}
              {notifications.map((notf) => (
                <MenuItem
                  key={notf._id}
                  onClick={() => {
                    setSelectedChat(notf.chat);
                    setNotifications(notifications.filter((n) => n !== notf));
                  }}
                >
                  {notf.chat.isGroupChat
                    ? `Message from ${notf.chat.chatName}`
                    : `Message from ${getSender(user, notf.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
              <ChevronDownIcon m={1} />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            Search Users
          </DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} gap={"5px"}>
              <Input
                placeholder="search by name or email"
                fontSize={"15px"}
                // value={search}
                pl={"10px"}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading === true ? (
              <ChatLoading />
            ) : (
              searchResult.map((elem) => {
                return (
                  <UserListItem
                    key={elem._id}
                    user={elem}
                    handleFunction={() => accessChats(elem._id)}
                  />
                );
              })
            )}
          </DrawerBody>

          {chatLoading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
