import React, { useEffect } from "react";
import Signin from "../components/Signin";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Signup from "../components/Signup";

// import { ChatState } from "../context/ChatProvider";

const HomePage = () => {
  const navigateTo = useNavigate();

  // const { user } = ChatState();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("signin-user-data"));

    if (user) {
      console.log(user);
      navigateTo("/chats");
    }
  }, [navigateTo]);

  return (
    <div className="home_container">
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent={"center"}
          p={3}
          w="100%"
          m={"40px 0 15px 0"}
        >
          <Text
            fontSize={"30px"}
            fontWeight={600}
            align={"center"}
            color="black"
            fontFamily={"'Poppins', sans-serif"}
          >
            ChatMe
          </Text>
        </Box>

        <Box
          bg={"white"}
          w={"100%"}
          p={4}
          boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
        >
          <Tabs variant="soft-rounded">
            <TabList mb={"1em"}>
              <Tab width={"50%"}>Signin</Tab>
              <Tab width={"50%"}>Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Signin />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
