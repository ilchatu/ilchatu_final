//ProfileModal.js
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import { Button, IconButton } from "@chakra-ui/button";
import { 
    Image, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    Text
} from "@chakra-ui/react";
import React from "react";
//import './styles2.css';


const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();  

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
        <ModalContent minW={{ base: "80%", md: "400px" }}
          maxW={{ base: "100%", md: "520px" }} h="" 
            borderRadius="16px"
            boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)"
        >
          <ModalHeader
            fontSize="30px"
            fontFamily="'Montserrat', sans-serif"
            display="flex"
            justifyContent="center"
            opacity="0.8"
            color= "rgb(12, 91, 9)"
          >
            {user.name}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            justifyContent="space-between"
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              borderRadius="full"
              boxSize="180px"
              src={user.pic}
              alt={user.name}
            />
            </div>
          

            <Text 
              marginTop="10px"
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
              <span style={{ fontWeight: "bold", color: "rgb(12, 91, 9)" }}>
                {user.email.endsWith('.com') ? `Email: ${user.email}` : ""}
              </span>
            </Text>


            <Text
            className="LeftAlignText"
            fontSize={{ base: "15px", md: "22px" }}
            fontFamily="'Montserrat', sans-serif"
            opacity="0.8">
            {user.address ? (
              <>
                <span style={{ fontWeight: "bold", color: "rgb(12, 91, 9)" }}>
                  Address:
                </span> {user.address}
              </>
            ) : ""}
          </Text>


            
            <Text 
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
                {user.mobileNumber? (
                  <>
                  <span style={{ fontWeight: "bold", color: "rgb(12, 91, 9)" }}>
                    Mobile Number:</span> {user.mobileNumber}
                  </>
                ):""}
             
            </Text>
            
            <Text 
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
                {user.occupation? (
                  <>
                  <span style={{ fontWeight: "bold", color: "rgb(12, 91, 9)" }}>
                    Occupation:</span> {user.occupation}
                  </>
                ):""}
            </Text>

            <Text 
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
                {user.alumniID? (
                <>
                <span style={{ fontWeight: "bold" , color: "rgb(12, 91, 9)"}}>
                  AId:</span> {user.alumniID}
                </>
              ):""}
              
            </Text>

            <Text 
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
                {user.selectedProgram?(
                <>
                <span style={{ fontWeight: "bold" , color: "rgb(12, 91, 9)"}}>
                  Program:</span> {user.selectedProgram}
                </>
                ):""}
            </Text>
            {/*
            <Text 
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
                {user.selectedYear?(
                  <>
                  <span style={{ fontWeight: "bold" , color: "rgb(12, 91, 9)"}}>
                    Year:</span> {user.selectedYear}
                  </>
                ):""}
            </Text>
              */}

            <Text 
              fontSize={{ base: "15px", md: "22px" }}
              fontFamily="'Montserrat', sans-serif"
              opacity="0.8">
                {user.Bio?(
                  <>
                  <span style={{ fontWeight: "bold", color: "rgb(12, 91, 9)" }}>
                    Bio:</span> {user.Bio}
                  </>
                ):""}
              
            </Text>
          
          </ModalBody>

          <ModalFooter justifyContent ="center">
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
