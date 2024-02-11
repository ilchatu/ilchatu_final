//ChangeProfile.js
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import { Button, IconButton } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import { useState, useEffect } from "react";
//import './styles2.css';
import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

const ChangeProfile = ({ user, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [forceRender, setForceRender] = useState(0); 

  useEffect(() => {
    // This effect will be triggered whenever the user changes
    // Update the forceRender to force a re-render
    setForceRender((prev) => prev + 1);
  }, [user]);

  const submitHandler = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    console.log("Submitting form...");
    try {
      const response = await axios.post(
        "/api/user/update-profile",
        {
          UserId: user._id,
          pic,
          name: user.name,
          mobileNumber: user.mobileNumber,
          address: user.address,
          occupation: user.occupation,
          Bio: user.Bio,
        },
        config
      );

      const data = response.data;

      if (!data) {
        console.error(
          "Error updating profile picture: Response data is undefined"
        );
        toast({
          title: "Failed to update profile picture",
          status: "error",
          description: "Unexpected response from the server",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      console.log("Response:", data);

      console.log("Updated pic:", pic);

      setForceRender((prev) => prev + 1);

      toast({
        title: "Profile Picture Updated",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Trigger re-render in the parent component (ProfileModal)
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile picture:", error);
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

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ilchatu");
      data.append("cloud_name", "ilchatu");
      fetch("https://api.cloudinary.com/v1_1/ilchatu/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
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
        <ModalContent minW={{ base: "80%", md: "400px" }} maxW={{ base: "100%", md: "500px" }} h="" borderRadius="16px" boxShadow="0 5px 15px rgba(0, 0, 0, 0.3)">
          <ModalHeader fontSize="30px" fontFamily="'Montserrat', sans-serif" display="flex" justifyContent="center" color= "rgb(12, 91, 9, 0.9)">
            Change Profile Picture
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="200px" src={user.pic} alt={user.name} />
            <FormControl id="pic" style={{ marginTop: 20}}>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
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

          <ModalFooter justifyContent="center">
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeProfile;