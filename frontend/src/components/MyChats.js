import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"; // Import the DeleteIcon
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import socketIOClient from "socket.io-client";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    users,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const [hoveredChatId, setHoveredChatId] = useState(null); // State to track hovered chat item
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to track modal visibility
  const [chatToDelete, setChatToDelete] = useState(null); // State to store chat id to delete

  const toast = useToast();

  useEffect(() => {
    socket.current = socketIOClient("https://ilchatu.com");
    socket.current.emit("addNewUser", user._id);
    socket.current.on("getOnlineUsers", (users) => {
      // Filter out the current user's status
      const filteredOnlineUsers = users.filter((u) => u.userId !== user._id);
      setOnlineUsers(filteredOnlineUsers);
    });
  }, [user]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const formatTimeOrExactTime = (messageDate) => {
    const currentDate = new Date();
    const messageDateTime = new Date(messageDate);

    const timeDifference = currentDate.getTime() - messageDateTime.getTime();
    const secondsDifference = timeDifference / 1000;
    const minutesDifference = secondsDifference / 60;
    const hoursDifference = minutesDifference / 60;

    // If the message was sent today, display the exact time
    if (
      messageDateTime.getDate() === currentDate.getDate() &&
      messageDateTime.getMonth() === currentDate.getMonth() &&
      messageDateTime.getFullYear() === currentDate.getFullYear()
    ) {
      return messageDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      // Otherwise, display time in the format of '1d', '2d', '1wk', etc.
      const daysDifference = Math.floor(hoursDifference / 24);
      const weeksDifference = Math.floor(daysDifference / 7);

      if (weeksDifference > 0) {
        return `${weeksDifference}wk`;
      } else {
        return `${daysDifference}d`;
      }
    }
  };

  const handleChatClick = (chat) => {
    // Remove red dot when chat is clicked
    const updatedNotification = notification.filter(
      (notif) => notif.chat._id !== chat._id
    );
    setNotification(updatedNotification);

    // Set the selected chat
    setSelectedChat(chat);
  };

  const isSenderOnline = (chat) => {
    if (chat.users && chat.users.length >= 1) {
      // Get the IDs of all users in the chat
      const userIds = chat.users.map((user) => user._id);
      // Check if any of the user IDs are present in the onlineUsers array
      return userIds.some((userId) => {
        // Check if the user ID is not the same as the current user's ID
        return (
          userId !== user._id &&
          onlineUsers.some((onlineUser) => onlineUser.userId === userId)
        );
      });
    }

    return false; // Return false if there are no users in the chat
  };

  const handleDeleteChat = async (chatId) => {
    setChatToDelete(chatId); // Set chat id to delete
    setIsDeleteModalOpen(true); // Open delete confirmation modal
  };

  const confirmDeleteChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      await axios.put(`/api/chat/delete`, { chatId: chatToDelete }, config);
      
      const updatedChats = chats.filter((chat) => chat._id !== chatToDelete);
      setChats(updatedChats);
      toast({
        title: "Chat Deleted",
        description: "The chat has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to delete the chat.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setIsDeleteModalOpen(false); // Close delete confirmation modal
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Chat</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            Are you sure you want to delete this chat?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDeleteChat}>
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Chat List */}
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          Chats
          <GroupChatModal>
            <Button
              colorScheme="green"
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              Create Group
            </Button>
          </GroupChatModal>
        </Box>

        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                key={chat._id}
                onMouseEnter={() => setHoveredChatId(chat._id)} 
                onMouseLeave={() => setHoveredChatId(null)} 
                onClick={() => handleChatClick(chat)}
                position="relative"
                cursor="pointer"
                bg={selectedChat === chat ? "green" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                _hover={{ bg: "green" }}
                alignItems="center"
              >
                <Text
                  fontFamily="heading"
                  ml={!chat.isGroupChat ? -1 : 3}
                  display="flex"
                  alignItems="center"
                >
                  {!chat.isGroupChat && (
                    <Box
                      h="8px"
                      w="8px"
                      bg={
                        isSenderOnline(chat) ? "green.500" : "gray.300"
                      }
                      borderRadius="50%"
                      mr={2}
                    />
                  )}
                  {!chat.isGroupChat
                    ? chat.users && chat.users.length >= 2
                      ? getSender(loggedUser, chat.users)
                      : "Deleted User"
                    : chat.chatName}
                </Text>
              
                {hoveredChatId === chat._id && selectedChat !== chat && !chat.isGroupChat && (
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat._id);
                    }}
                    position="absolute"
                    right="5px"
                    top="5px"
                  >
                    <DeleteIcon />
                  </Button>
                )}
                
                  {notification.some((notif) => notif.chat._id === chat._id) && (
                    <Box
                      position="absolute"
                      top="20%"
                      right="10px"
                      transform="translateY(-50%)"
                      fontSize="12px"
                      fontWeight="bold"
                      color="white"
                      bg="green.500"
                      borderRadius="10px"
                      px="3px"
                      style={{
                        animation: "scaleEffect 0.5s infinite alternate",
                      }}
                    >
                      New Message
                    </Box>
                  )}

                  {chat.latestMessage && (
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Text fontSize="xs" ml={3}>
                        <b>
                          {chat.latestMessage.sender.name === "Your Name"
                            ? "You"
                            : chat.latestMessage.sender.name}{" "}
                          :
                        </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                      <Text fontSize="xs">
                        {formatTimeOrExactTime(chat.latestMessage.createdAt)}
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
