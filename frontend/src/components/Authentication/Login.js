import React, { useState } from 'react'; 
import {
  Button,
  Box,
  Checkbox,
  Stack,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import logoImage from "./ilchatu_hannah.png";
import { Link } from "react-router-dom";
import ContactForm from './ContactForm';


const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  const handleClick = () => setShow(!show);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || /*!studentnumber ||*/ !password) {
      toast({
        title: "Please Fill in all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "api/user/login",
        { email, /*studentnumber,*/ password },
        config
      );
      debugger;
      console.log(data);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      if (isAdmin) {
        const is_admin = data.isAdmin;
        if (is_admin) {
          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          history.push("/admin");
        } else {
          localStorage.removeItem("userInfo");
          history.push("/");
          toast({
            title: "You are not an admin",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      } else if (isUser) {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        history.push("/chats");
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5" align="center">
      <div class="container-auth" id="container-auth">
        <div class="form-container sign-in">
          <form>
            <div class="loginContainer">
              <h1 id="loginHeading">Login</h1>
            </div>
            <FormControl id="email" isRequired>
              {/* <FormLabel>Email</FormLabel> */}
              <Input
                value={email}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4rem">
                  <Button
                    h="1.8rem"
                    size="sm"
                    onClick={handleClick}
                    className="showhide"
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {/* two checkbox to define as user or admin */}
            <FormControl
              id="type"
              style={{
                margin: "15px 0",
              }}
            >
              {/* deal with checkbox with chakra ui but with react state */}

              <Stack direction="row" align="center">
                <Checkbox
                  isChecked={isUser}
                  onChange={(e) => {
                    setIsUser(e.target.checked);
                    setIsAdmin(false);
                  }}
                >
                  User
                </Checkbox>
                <Checkbox
                  isChecked={isAdmin}
                  onChange={(e) => {
                    setIsAdmin(e.target.checked);
                    setIsUser(false);
                  }}
                >
                  Admin
                </Checkbox>
              </Stack>
            </FormControl>
            <FormControl id="ForgetPassword">
              <Link to={`/forgetPassword`}>Forgot Password?</Link>
            </FormControl>

            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: "15px" }}
              onClick={submitHandler}
              isLoading={loading}
            >
              Login
            </Button>

            {/* <Link
              to={`Admin/AdminManagement`}
              style={{ marginTop: "10px", color: "black" }}
            >
              Admin Page
            </Link> */}
          </form>
        </div>
        
        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-right">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "40%",
                  transform: "translateX(-40%)",
                }}
              >
                <Box mb={2}>
                  <img
                    src={logoImage}
                    alt="iLearnU Logo"
                    className="logo"
                    style={{ width: "180px", height: "auto" }}
                  />
                </Box>
              </div>
              <div>
                <h1>Hi, aLUmni</h1>
                <p>
                  Please Enter your personal details to Connect with
                  iLchatUsers!
                </p>
                <div>
                <div style={{ marginTop: "auto" }}>
                  {/* Contact Us text */}
                    <div className="contact-section" onClick={openContactModal} 
                    style={{ textAlign: "center", cursor: "pointer", fontSize: "24px", color: "white", padding: "20px 0" }}>
                        <p>Contact Us!</p>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactForm isOpen={isContactModalOpen} onClose={closeContactModal} />
    </VStack>
  );
};

export default Login;
