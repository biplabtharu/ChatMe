import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Box,
  FormControl,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import SelectedUserForGroup from "./SelectedUserForGroup";
import axios from "axios";
import UserListItem from "../userProfile/UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();
  const [searchResult, setSearchResult] = useState([]);

  const toast = useToast();

  const { token } = user;

  const handleSearch = async (query) => {
    // console.log(fetchAgain);
    // setFetchAgain(!fetchAgain);
    // console.log(fetchAgain);

    // console.log(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      //   console.log(token);
      //   console.log(data);
      setSearchResult(data);
      //   console.log(`searchResult is ${searchResult}`);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Write something to search.",
        status: "warning",
        duration: 3000000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/renamegroup`,
        { chatName: groupChatName, chatId: selectedChat._id },
        config
      );

      // console.log(data);
      // console.log(selectedChat);
      setSelectedChat(data);
      // setGroupChatName("");
      // console.log(fetchAgain);
      // setFetchAgain(!fetchAgain);
      // console.log(fetchAgain);
      setFetchAgain(!fetchAgain);
      // console.log(fetchAgain);
      // console.log(selectedChat);

      setRenameLoading(false);
    } catch (err) {
      toast({
        title: "Failed to update group name.",
        description: err.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((elem) => elem._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.put(
        `/api/chat/addtogroup`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      // console.log(fetchAgain);
      setFetchAgain(!fetchAgain);
      // setFetchAgain(!fetchAgain);
      //
      // console.log(fetchAgain);

      setLoading(false);
    } catch (err) {
      toast({
        title: "Error adding user",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (usertobedeleted) => {
    // console.log(selectedChat);
    if (
      selectedChat.groupAdmin._id !== user._id &&
      usertobedeleted._id !== user._id
    ) {
      toast({
        title: "Only admin can remove someone",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.put(
        `/api/chat/removefromgroup`,
        {
          chatId: selectedChat._id,
          userId: usertobedeleted._id,
        },
        config
      );

      usertobedeleted._id === user._id
        ? setSelectedChat()
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      // console.log(fetchAgain);
      // console.log(fetchAgain);

      setLoading(false);
    } catch (err) {
      toast({
        title: "Error occured",
        description: err.message,
        status: "danger",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users.map((user) => (
                <SelectedUserForGroup
                  key={user._id}
                  user={user}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>

            <FormControl display={"flex"} gap={"10px"} mb={"10px"}>
              <Input
                type="text"
                placeholder="Rename your group"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                isLoading={renameLoading}
                onClick={handleRename}
                variant={"solid"}
                colorScheme="teal"
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add  users eg: John, Smith"
                onChange={(e) => handleSearch(e.target.value)}
              />

              {loading ? (
                <Spinner size={"lg"} />
              ) : (
                searchResult?.map((elem) => (
                  <UserListItem
                    key={elem._id}
                    user={elem}
                    handleFunction={() => handleAddUser(elem)}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
