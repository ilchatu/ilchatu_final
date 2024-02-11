import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import { Button, IconButton } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";

import { FormControl } from "@chakra-ui/form-control";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

const ChangePassword = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState('');
  const [newPassword,SetNewPassword]=useState('');
  const [ConfirmPassword,SetConfirmPassWord]=useState('');
  const [userId, setUserId] = useState('');
  const history = useHistory('');
  const toast = useToast();
  const [picLoading, setPicLoading] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleClick = () => setShow(!show);


  function isSequentialPassword(newPassword) {
    for (let i = 0; i < password.length - 2; i++) {
      const charCode1 = password.charCodeAt(i);
      const charCode2 = password.charCodeAt(i + 1);
      const charCode3 = password.charCodeAt(i + 2);
  
      // Check for sequential characters (you can customize this logic)
      if (charCode1 === charCode2 - 1 && charCode2 === charCode3 - 1) {
        return true;
      }
      if (charCode1 === charCode2 + 1 && charCode2 === charCode3 + 1) {
        return true;
      }
    }
  
    return false;
  }




  const handleSubmit = async() => {
    if (newPassword.length < 8) {
      toast({
       title: "Password is too short (min 8 characters)",
        status: "warning",
       duration: 5000,
       isClosable: true,
        position: "bottom",

      });
      setPicLoading(false);
      return;
    }

    if (isSequentialPassword(newPassword)) {
      toast({
        title: "Password must not contain sequential characters",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }


        if (!/[A-Z]/.test(newPassword)) {
      toast({
        title: "Password must contain atleast one Uppercase Letter",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      setPicLoading(false);
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      toast({
        title: "Password must contain atleast one Lowercase Letter",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      setPicLoading(false);
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      toast({
        title: "Password must contain atleast one number",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      setPicLoading(false);
      return;
    }

if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(newPassword)) {
      toast({
        title: "Password must contain atleast one Special Character",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      setPicLoading(false);
      return;
    }
    

    if (newPassword !== ConfirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    toast({
      title: "Your Password is Successfully Updated",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    
    setConfirmationModalOpen(false) 
    localStorage.removeItem("userInfo");
    history.push("/");
    
    try {
             const config = {
               headers: {
                 "Content-type": "application/json",
               },
             };
             const { data } = await axios.post(
               "api/auth/Newpassword",
               {
                userId: user._id 
                ,newPassword},
               config
             );
             console.log(data);
             
             toast({
              title: "Your Password is Successfully Updated",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            
            await history.push("/"); 
            localStorage.removeItem("userInfo");
           } catch (error) {
             console.error('Error fetching email token:', error);
           }
         };

  const submitHandler = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
  
    console.log("Submitting Password...");
    try {
      const response = await axios.post(
        "/api/auth/matchPassword",
        {
          currentpassword: user.password,
          UserId: user._id,
          password,
        },
        config
      );
      const data = response.data;
      if (!data) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      localStorage.setItem("userInfo", JSON.stringify(data));
     
  
      toast({
        title: "Password Match",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      onClose();
      setConfirmationModalOpen(true);

    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  
    
  };
  
  

  return (
    <>
      {children ? (
        <span onClick={onOpen}> {children} </span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ChatIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent minW={{ base: "80%", md: "400px" }} maxW={{ base: "100%", md: "400px" }} h=""
        borderRadius="16px" boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)">
        <ModalHeader marginTop="10px" fontSize="28px" fontFamily="'Montserrat', sans-serif" display="flex" justifyContent="center" color="rgb(12, 91, 9)">           
         Change your Password
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <FormControl id="password" isRequired>
              <InputGroup bg="#eee" style={{ marginTop: 10, marginBottom: 15}}>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Old Password"
                  onChange={(e) => setPassword(e.target.value)}
                  padding={"3"}
                />
                <InputRightElement width="3rem">
                  <Button h="3rem" size="sm" 
                  onClick={handleClick} width="45px"
                  colorScheme="green"
                  height="35px">
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
                
              </InputGroup>
             
            </FormControl>

            <Button 
            colorScheme="green" 
            mr={1} 
            
            h="40px" 
             w="360px"
             fontSize={15}
             fontFamily="'Montserrat', sans-serif"
             marginBottom={"10px"}
            onClick={() => {
              submitHandler();
            }}
            isLoading={picLoading}
            >
              Confirm Password
            </Button>
          </ModalBody>
<ModalFooter >

</ModalFooter>
          
        </ModalContent>
      </Modal>

<Modal
size="lg"
isOpen={confirmationModalOpen}
onClose={() => setConfirmationModalOpen(false)}
isCentered
>
<ModalOverlay />
<ModalContent minW={{ base: "80%", md: "400px" }} maxW={{ base: "100%", md: "400px" }} h=""
  borderRadius="16px" boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)">
  <ModalHeader marginTop="10px" fontSize="28px" fontFamily="'Montserrat', sans-serif" display="flex" justifyContent="center" color="rgb(12, 91, 9)">
    Create New Password
  </ModalHeader>

  <ModalCloseButton />

  <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
    Your New Password should be different from your old password

    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="form1">
      <FormControl id="password" isRequired>
        <label htmlFor="NewPassword"></label>
        <InputGroup bg="#eee" style={{ marginTop: 10, marginBottom: 15 }}>
          <input
          style={{ height: "35px" }}
            
            padding={"2"}
            type={show ? "text" : "password"}
            id="newpassword"
           
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => SetNewPassword(e.target.value)}
            required
          />

          <InputRightElement width="3rem">
            <Button h="3rem" size="sm"
              onClick={handleClick} width="45px"
              colorScheme="green"
              height="35px">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>

          <InputLeftElement>
              <Box 
              as={InfoOutlineIcon} 
              color="gray.500"
              onClick={() => setShowPasswordInfo(!showPasswordInfo)}
              cursor="pointer"
              marginRight="58"
              marginTop="4  "
              width="13px"  
              height="13px" 
/>
</InputLeftElement>
        </InputGroup>

      </FormControl>

      {showPasswordInfo && (
          <Box mt={2} fontSize="x-small" color="gray.500">
            Password must contain at least one uppercase letter, one lowercase letter,
            one symbol, one digit, and be at least 8 characters long.
          </Box>
        )}

      <InputGroup bg="#eee" style={{ marginBottom: 15 }}>
        <label htmlFor="ConfirmPassword"></label>
        <input
        style={{ height: "35px" }}
          type={show ? "text" : "password"}
          id="confirmpassword"
          placeholder="Confirm Password"
          value={ConfirmPassword}
          onChange={(e) => SetConfirmPassWord(e.target.value)}
          required
        />
        <InputRightElement width="3rem">
          <Button h="3rem" size="sm"
            onClick={handleClick} width="45px"
            colorScheme="green"
            height="35px">
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>

      <Button
        type="submit"
        colorScheme="green"
        height="40px"
        width="100%"
        borderRadius="10px"
      >
        Set New Password
      </Button>

    </form>
  </ModalBody>
  <ModalFooter>

  </ModalFooter>
</ModalContent>
</Modal>

    </>
  );
};

export default ChangePassword;