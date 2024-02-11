import React, { useEffect } from "react";
import {
  Container,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

// import { useHistory } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
// import logoImage from './ilchatu_hannah.png';

const Homepage = () => {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
     const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, []);



  return (
    <Container maxW="xl" centerContent>
      {/* <Box mb={3} textAlign="center">
        <img src={logoImage} alt="iLearnU Logo" class="logo"/>
  </Box> */}
      <Box
        bg="rgb(18, 172, 20);"
        w="auto"
        h="auto"
        p={4}
        borderRadius="30px"
        borderWidth="3px"
        mt={5}
        mb={30}
      >
        <Tabs variant="soft-rounded" isFitted>
          <TabList mb="1em">
            <Tab color="white" width="50%">
              Login
            </Tab>
            <Tab color="white" width="50%">
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {" "}
              <Login />{" "}
            </TabPanel>
            <TabPanel>
              {" "}
              <Signup />{" "}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
   
    </Container>
  );
}

export default Homepage;