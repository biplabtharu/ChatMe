import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack } from "@chakra-ui/layout";

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";

import axios from "axios";

const Signin = () => {
  const toast = useToast();
  const navigateTo = useNavigate();
  const [show, setshow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setshow(!show);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Sign in error.",
        description: "all the fields are required",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/user/signin",
        { email, password },
        config
      );

      // console.log(data);
      if (data) {
        toast({
          title: "Sign in successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("signin-user-data", JSON.stringify(data));
        navigateTo("/chats");
      } else {
        toast({
          title: "Sign in error",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Sign in error.",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack spacing={"20px"}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="sm"
            name="email"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="sm"
              name="password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign in
        </Button>

        {/* <Button
          variant={"solid"}
          colorScheme="red"
          width="100%"
          onClick={() => {
            setEmail("guest@mesezeme.com");
            setPassword("123456");
          }}
        >
          Login as Guest user
        </Button> */}
      </VStack>
    </>
  );
};

export default Signin;
