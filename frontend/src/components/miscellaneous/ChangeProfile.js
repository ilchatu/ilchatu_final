import React, { useState } from 'react';
import {
  useDisclosure, useToast, Button, IconButton, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Image, Flex, Stack
} from '@chakra-ui/react';
import { ChatIcon } from "@chakra-ui/icons";
import axios from 'axios';

function ChangeProfile({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [pic, setPic] = useState(user.pic);  // User's current profile picture
  const [newPic, setNewPic] = useState(null);  // New profile picture (temporary)
  const [picLoading, setPicLoading] = useState(false);

  // Function to update profile picture
  const updateProfilePic = async () => {
    // Configuration for axios request
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.post("/api/user/update-profile", {
        UserId: user._id,
        pic: newPic || pic, // Use newPic if available, otherwise use current pic
        name: user.name,
      }, config);

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast({
        title: "Profile Updated Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      window.location.reload(); // Reload the window to reflect changes
    } catch (error) {
      toast({
        title: "Profile Update Failed",
        status: "error",
        description: error.response?.data?.message || error.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Handling file change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPicLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ilchatu");
    formData.append("cloud_name", "ilchatu");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ilchatu/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setNewPic(data.url); // Temporarily store the new picture
    } catch (error) {
      toast({
        title: "Image Upload Failed",
        status: "error",
        description: "Failed to upload image",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setPicLoading(false);
    }
  };

  // Handling modal close without saving changes
  const handleCancel = () => {
    setNewPic(null); // Discard the new picture
    onClose();       // Close the modal
  };

  // Handling profile update
  const handleUpdate = () => {
    if (newPic) {
      setPic(newPic); // Set newPic as the official profile picture
      updateProfilePic();
    } else {
      onClose(); // Close modal if no new picture is chosen
       toast({
        title: "Image Upload Failed",
        status: "error",
        description: "No File Chosen",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
    {children ? (
      <span onClick={onOpen}>{children}</span>
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
          boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)">
          <ModalHeader fontSize="30px"
            fontFamily="'Montserrat', sans-serif"
            display="flex"
            justifyContent="center"
            color="rgb(12, 91, 9, 0.9)">
              Change Profile Picture
              </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" >
            <Image borderRadius="full" boxSize="175px" src={newPic || pic} alt="Profile image" mb={4} />
            <input 
            type="file" 
            style={{
        padding: '6px', // equivalent to p={1.5} in some frameworks
        border: '1px solid #ccc', // simple gray border
        borderRadius: '5px', // rounded corners
        cursor: picLoading ? 'wait' : 'pointer' // cursor changes based on loading state
    }}
             onChange={handleFileChange} disabled={picLoading} />
            <Stack direction="row" spacing={4} mt={4} justifyContent="center">
              <Button isLoading={picLoading} colorScheme="green" onClick={handleUpdate}>Update</Button>
              <Button colorScheme="red" onClick={handleCancel}>Cancel</Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeProfile;
