import React, { useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../userProfile/UserListItem";
import ChatLoadingSmall from "./ChatLoadingSmall";
import SelectedUserForGroup from "./SelectedUserForGroup";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();

  const { user, chats, setChats } = ChatState();
  const { token } = user;

  const toast = useToast();

  const handleSearch = async (query) => {
    // console.log(query);
    setLoading(true);
    if (!query) {
      return;
    }
    try {
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
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "plz, fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast({
        title: "users in group should be more than two",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `/api/chat/creategroup`,
      {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((elem) => elem._id)),
      },
      config
    );

    setChats([data, ...chats]);
    console.log(chats);
    onClose();

    toast({
      title: "New group chat added",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  const handleDelete = (deluserId) => {
    setSelectedUsers(
      selectedUsers.filter((curElem) => curElem._id !== deluserId)
    );
  };

  return (
    <>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                type="text"
                placeholder="Group name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                type="text"
                placeholder="Add  users eg: John, Smith"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box
              w={"100%"}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              {selectedUsers.map((user) => (
                <SelectedUserForGroup
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user._id)}
                />
              ))}
            </Box>
            {loading ? (
              <ChatLoadingSmall />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((elem) => (
                  <UserListItem
                    key={elem._id}
                    user={elem}
                    handleFunction={() => handleAddUser(elem)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
