//EditProfile.js
import {Button} from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { FormControl,  } from "@chakra-ui/form-control";
import { useState } from "react";
import axios from "axios";
import { Input, } from "@chakra-ui/input";
import { 
     
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    
} from "@chakra-ui/react";
import React from "react";

const EditProfile = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();  
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
    const [name, setName] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [address, setAddress] = useState();
    const [occupation, setOccupation] = useState();
    const [Bio, setBio] = useState();

    const submitHandler = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
    
      try {
        // Initialize a complete payload with all possible fields
        const payload = {
          UserId: user._id,
          pic: user.pic,
          name: user.name,
          mobileNumber: user.mobileNumber,
          address: user.address,
          occupation: user.occupation,
          Bio: user.Bio,
        };
    
        // Update the payload with changed fields
        if (name) payload.name = name;
        if (mobileNumber) payload.mobileNumber = mobileNumber;
        if (address) payload.address = address;
        if (occupation) payload.occupation = occupation;
        if (Bio) payload.Bio = Bio;
    
        const response = await axios.post("/api/user/update-profile", payload, config);
    
        const data = response.data;
    
    
        localStorage.setItem('userInfo', JSON.stringify(data));
    
    
        window.location.reload();
      } catch (error) {
        console.error("Error Editing profile:", error);
        toast({
          title: "Failed to update profile picture",
          status: "error",
          description: error.message || "Unknown error",
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
        <IconButton
          display={{ base: "flex" }}
          icon={<ChatIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent minW={{ base: "80%", md: "400px" }} maxW={{ base: "100%", md: "450px" }} h="" borderRadius="16px" boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)">
          <ModalHeader
            fontSize="30px"
            fontFamily="'Montserrat', sans-serif"
            display="flex"
            justifyContent="center"
            color= "rgb(12, 91, 9, 0.9)"
          >
            Edit your Profile
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
           
           <FormControl id="first-name"  bg="#eee">
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="mobile-num" style={{ marginTop: 15}}  bg="#eee">
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Mobile Number"
                onChange={(e) => setMobileNumber(e.target.value)}   />
            </FormControl>
            <FormControl id="Occupation" style={{ marginTop: 15}} bg="#eee">
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Occupation"
                onChange={(e) => setOccupation(e.target.value)}
              />
            </FormControl>
            <FormControl id="Address" style={{ marginTop: 15}} bg="#eee"> 
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl id="Bio" style={{ marginTop: 15}} bg="#eee">
              {/* <FormLabel>Name</FormLabel> */}
              <Input
                placeholder="Bio"
                onChange={(e) => setBio(e.target.value)}
              />
              </FormControl>
            
              <Button
              colorScheme="green"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={() => {
                submitHandler();
                onClose();
              }}
              isLoading={picLoading}
            >
              Update
            </Button>

            
          </ModalBody>

          <ModalFooter justifyContent ="center">
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProfile;