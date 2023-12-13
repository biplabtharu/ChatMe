import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";

import axios from "axios";

const Signup = () => {
  const navigateTo = useNavigate();
  const [show, setshow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleClick = () => {
    setshow(!show);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Upload image",
        description: "Please, upload an image",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mesezme");
      data.append("cloud_name", "dc73d4fcl");

      fetch("https://api.cloudinary.com/v1_1/dc73d4fcl/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.url.toString());
          setPic(data.url.toString());
          setLoading(false);
        });
    } else {
      toast({
        title: "Upload image",
        description: "Please, upload an image",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Sign up error.",
        description: "all the fields are required",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password not matching.",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "/api/user/signup",
          { name, email, password, pic },
          config
        );

        // console.log(data);
        toast({
          title: "Sign up successfull.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem("signin-user-data", JSON.stringify(data));
        navigateTo("/chats");
      } catch (err) {
        toast({
          title: "Error occurred",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  };
  return (
    <>
      <VStack spacing={"20px"}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="your name"
            onChange={(e) => setName(e.target.value)}
            size="sm"
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="your email"
            onChange={(e) => setEmail(e.target.value)}
            size="sm"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="your password"
              onChange={(e) => setPassword(e.target.value)}
              size="sm"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" mb={2} onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="sm"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                mb={2}
                size="sm"
                onClick={handleClick}
                borderRadius={"1px"}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel>Picture</FormLabel>
          <Input
            type="file"
            accept="/image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            size={"sm"}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default Signup;
