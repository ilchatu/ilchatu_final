import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { FormControl, Tooltip } from "@chakra-ui/react"; // Import Tooltip
import { Input } from "@chakra-ui/input";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Checkbox,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const EditProfile = ({ user, children }) => {
  const history = useHistory(); // Initialize history hook
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation modal
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
  const [name, setName] = useState(user.name|| '');
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber||'');
  const [address, setAddress] = useState(user.address||'');
  const [occupation, setOccupation] = useState(user.occupation||'');
  const [Bio, setBio] = useState(user.Bio||'');
  const [agree, setAgree] = useState(false); // State for checkbox
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function isValidName(name) {
    const validPattern = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/; // Allows alphabetic characters and spaces in between words
    return validPattern.test(name) && name !== "Deleted User";
}
function isValidMobileNumber(mobileNumber) {
  const pattern = /^\+?(\d+)$/;
  if (!pattern.test(mobileNumber)) {
      return false; // Check if the mobile number is digits only (with optional leading +)
  }

  if (mobileNumber.startsWith('09')) {
      return mobileNumber.length === 11; // If starts with '09', must be 11 digits
  } else if (mobileNumber.startsWith('+639')) {
      return mobileNumber.length === 13; // If starts with '+63', must be 13 digits
  } else {
      return false; // If starts with neither, it's invalid
  }
}


  const submitHandler = async () => {
    
    if (!isValidName(name)) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid Full Name (alphabet characters only, spaces allowed between words).",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

     if (!isValidName(name)) {
        toast({
            title: "Invalid Input",
            description: "Please check your name",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return; // Prevent form submission if validation fails
    }
    if (!isValidMobileNumber(mobileNumber)) {
      toast({
          title: "Invalid Input",
          description: "Please check your mobile number.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
      });
      return; // Prevent form submission if validation fails
  }

    if (!agree) {
      toast({
        title: "Please agree to the terms",
        status: "error",
        description: "You must agree to share your personal details.",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setConfirmOpen(false); // Close confirmation modal
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
        pic: user.pic, // Assuming you want to keep the picture unchanged if not specified
      };
    
      // Explicitly check for 'undefined' to allow empty strings as valid values
      if (typeof name !== 'undefined') payload.name = name;
      if (typeof mobileNumber !== 'undefined') payload.mobileNumber = mobileNumber;
      if (typeof address !== 'undefined') payload.address = address;
      if (typeof occupation !== 'undefined') payload.occupation = occupation;
      if (typeof Bio !== 'undefined') payload.Bio = Bio;
    
      const response = await axios.post(
        "/api/user/update-profile",
        payload,
        config
      );
    
      const data = response.data;

      localStorage.setItem("userInfo", JSON.stringify(data));

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

  const handleSoftDelete = async (userId, history) => {
    const deleteUUID = uuidv4();
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        "/api/user/softdelete",
        { userId, deleteUUID },
        config
      );

      if (response.status === 200) {
        console.log('Soft deletion successful, UUID:', deleteUUID);
        // Redirect to homepage after successful deletion
        localStorage.removeItem("userInfo");
        history.push("/");
      } else {
        // Handle unsuccessful response
        console.error('Soft deletion failed:', response.statusText);
        // You can display an error message to the user or handle the error in another way
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error soft deleting user:', error);
    }
  };

  const confirmationMessage = () => {
    let message = "Are you sure you want to update your profile?";
    if (address && mobileNumber) {
      message +=
        "<br/><br/>By editing your profile, you Agree to share the following information:<br/><br/><span style='color:green;'>&#10003;</span> Address<br/><span style='color:green;'>&#10003;</span> Mobile Number";
    } else if (address) {
      message +=
        "<br/>By editing your profile, you Agree to share the following information:<br/><br/><span style='color:green;'>&#10003;</span> Address";
    } else if (mobileNumber) {
      message +=
        "<br/>By editing your profile, you Agree to share the following information:<br/><br/><span style='color:green;'>&#10003;</span> Mobile Number";
    }
    return <div dangerouslySetInnerHTML={{ __html: message }} />;
  };

  const openConfirmationModal = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
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
        <ModalContent
          minW={{ base: "80%", md: "400px" }}
          maxW={{ base: "100%", md: "450px" }}
          h=""
          borderRadius="16px"
          boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)"
        >
          <ModalHeader
            fontSize="30px"
            fontFamily="'Montserrat', sans-serif"
            display="flex"
            justifyContent="center"
            color="rgb(12, 91, 9, 0.9)"
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

              <FormControl id="first-name" bg="#eee">
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

            <Tooltip
              label="Only fill this field if you're willing to share your information"
              placement="top"
            >
              <FormControl
                id="mobile-num"
                style={{ marginTop: 15 }}
                bg="#eee"
              >
                <Input
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </FormControl>
            </Tooltip>

            <FormControl
              id="Occupation"
              style={{ marginTop: 15 }}
              bg="#eee"
            >
              <Input
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </FormControl>

            <Tooltip label="Only fill this field if you're willing to share your information" placement="top">
              <FormControl id="Address" style={{ marginTop: 15 }} bg="#eee">
                <Input
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />       
              </FormControl>
            </Tooltip>


            <FormControl id="Bio" style={{ marginTop: 15 }} bg="#eee">
              <Input
                placeholder="Bio"
                value={Bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </FormControl>

            <Button
              colorScheme="green"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={() => setConfirmOpen(true)} // Open confirmation modal
              isLoading={picLoading}
            >
              Update
            </Button>

            <Button 
            colorScheme="red"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={() => openConfirmationModal(user._id)}>
              Delete Account
              </Button>

            {/* Confirmation Modal */}
            <Modal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                <ModalBody>
                  {confirmationMessage()}
                  <Checkbox mt={4} onChange={(e) => setAgree(e.target.checked)}>
                    I agree to share my personal details
                  </Checkbox>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="red"
                    mr={3}
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={submitHandler}
                    isLoading={picLoading}
                    disabled={!agree} // Disable button if not agreed
                  >
                    Confirm
                  </Button>

                 
                </ModalFooter>
              </ModalContent>
            </Modal>
          </ModalBody>

          <ModalFooter justifyContent="center"></ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={showConfirmation}
        leastDestructiveRef={undefined}
        onClose={closeConfirmationModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => handleSoftDelete(userIdToDelete, history)} colorScheme="red" ml={3}>
                Yes
              </Button>
              <Button onClick={closeConfirmationModal} ml={3}>
                No
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={isSuccessOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsSuccessOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Success
            </AlertDialogHeader>
            <AlertDialogBody>
              User deleted successfully!
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
    
  );
};

export default EditProfile;
