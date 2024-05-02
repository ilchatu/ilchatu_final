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
  if (!email || !password) {
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
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/user/login",
      { email, password },
      config
    );

    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);

    const redirectPath = data.isAdmin ? "/admin" : "/chats";
    toast({
      title: "Login Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    history.push(redirectPath);
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    toast({
      title: "Error Occurred!",
      description: errorMessage,
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
          <Box mb={2}>
                  <img
                    src={logoImage}
                    alt="iLearnU Logo"
                    className="logo2"
                    
                  />
                  <h2> Hi, aLUmni</h2>
                </Box>
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
            <div style={{ marginTop: "auto" }}>
                  {/* Contact Us text */}
                    <div className="contact-section2" onClick={openContactModal} 
                    style={{ textAlign: "center", cursor: "pointer", fontSize: "24px", color: "black", padding: "20px 0" }}>
                        <p>Contact Us!</p>
                    </div>
              </div>

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
