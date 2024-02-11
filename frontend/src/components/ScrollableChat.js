import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { ModalHeader, useToast } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const ENDPOINT = "http://localhost:5000";

const ScrollableChat = ({ messages, setLoading, selectedChat, setMessages }) => {
  const { user } = ChatState();
  const [showOptionsMap, setShowOptionsMap] = useState({});
  const [socket, setSocket] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [clickedImageUrl, setClickedImageUrl] = useState(null); // State to store clicked image URL
  const [modalMaxWidth, setModalMaxWidth] = useState("90vw");
  const chatContainerRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message recieved", () => {
      setUnreadMessages(prevCount => prevCount + 1);
    });

    return () => {
      socket.off("message recieved");
    };
  }, [socket]);

  const isValidImageUrl = (url) => {
    const imageRegex = /\.(jpeg|jpg|gif|png)$/i;
    return imageRegex.test(url);
  };

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (clickedImageUrl) {
      const adjustModalWidth = () => {
        const image = new Image();
        image.src = clickedImageUrl;
        image.onload = () => {
          const imageWidth = image.width;
          const viewportWidth = window.innerWidth;
          const maxWidth = Math.min(viewportWidth * 0.9, imageWidth);
          setModalMaxWidth(`${maxWidth}px`);
        };
      };

      adjustModalWidth();
    }
  }, [clickedImageUrl]);

  const handleChevronClick = (messageId) => {
    setShowOptionsMap((prevShowOptionsMap) => ({
      ...prevShowOptionsMap,
      [messageId]: !prevShowOptionsMap[messageId],
    }));
  };

  const handleMouseEnter = (messageId) => {
    setShowOptionsMap((prevShowOptionsMap) => ({
      ...prevShowOptionsMap,
      [messageId]: true,
    }));
  };

  const handleMouseLeave = (messageId) => {
    setShowOptionsMap((prevShowOptionsMap) => ({
      ...prevShowOptionsMap,
      [messageId]: false,
    }));
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportSender, setReportSender] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState("");

  const openReportModal = (message, sender) => {
    setReportMessage(message);
    setReportSender(sender);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportMessage("");
    setReportSender("");
  };

  const openDeleteModal = (messageId) => {
    setDeleteMessageId(messageId);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setDeleteMessageId("");
    setIsDeleteModalOpen(false);
  };

  const handleReport = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(
        `/api/report/create`,
        {
          message: reportMessage,
          user: reportSender,
        },
        config
      );

      toast({
        title: "Report Sent!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      closeReportModal(); // Close the modal after sending the report
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (deleteMessageId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      await axios.delete(`/api/message/delete/${deleteMessageId}`, config);
  
      socket.emit("delete message", { messageId: deleteMessageId });
  
      toast({
        title: "Message deleted!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
  
      // Fetch messages after successful deletion
      fetchMessages();
    } catch (error) {
      console.log(error);
    } finally {
      closeDeleteModal();
    }
  };
  
  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      setLoading(true);
  
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
  
      setMessages(data);
      setLoading(false);
  
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div
      style={{ overflowX: "hidden", overflowY: "auto" }}
      id="chat-container"
      ref={chatContainerRef}
    >
      {messages &&
        messages.map((m, i) => (
          <div
          style={{
            marginBottom: "10px", // Adjust the value here for the desired space
            display: "flex",
            justifyContent: user._id === m.sender._id ? "flex-end" : "flex-start",
          }}
          key={m._id}
        >
        
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "rgb(106, 248, 101)"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                position: "relative",
              }}
              onMouseEnter={() => handleMouseEnter(m._id)}
              onMouseLeave={() => handleMouseLeave(m._id)}
            >
              {isValidImageUrl(m.content) ? (
                <img
                  src={m.content}
                  alt="Received Image"
                  onClick={() => setClickedImageUrl(m.content)} // Click handler for image
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <p>{m.content}</p>
              )}
              {showOptionsMap[m._id] && (
                <ChevronDownIcon
                  boxSize={4}
                  color="gray.500"
                  style={{
                    position: "absolute",
                    bottom: 7,
                    left: user._id === m.sender._id ? "auto" : "93%",
                    right: user._id === m.sender._id ? "78%" : "auto",
                    transform:
                      user._id === m.sender._id ? "translateX(-110%)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChevronClick(m._id)}
                />
              )}
              {showOptionsMap[m._id] && (
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: user._id === m.sender._id ? "auto" : "100%",
                    right: user._id === m.sender._id ? "auto" : "auto",
                    transform:
                      user._id === m.sender._id ? "translateX(-130%)" : "none",
                  }}
                >
                  {m.sender._id === user._id ? (
                    <button
                      style={{
                        fontSize: "60%",
                        fontFamily: "inherit",
                        backgroundColor: "#ff6666",
                        color: "white",
                        padding: "5px 5px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => openDeleteModal(m._id)}
                    >
                      <span style={{ marginRight: "5px" }}>
                        <i className="fas fa-trash-alt"></i>
                      </span>
                      Delete
                    </button>
                  ) : (
                    <button
                      style={{
                        fontSize: "60%",
                        fontFamily: "inherit",
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => openReportModal(m?.content, m?.sender?._id)}
                    >
                      <span style={{ marginRight: "5px" }}>
                        <i className="fas fa-flag"></i>
                      </span>
                      Report
                    </button>
                  )}
                </div>
              )}
            </span>
          </div>
        ))}
      {unreadMessages > 0 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <span style={{ color: "blue" }}>You have {unreadMessages} new message(s)</span>
        </div>
      )}
      <Modal isOpen={isReportModalOpen} onClose={closeReportModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Report</ModalHeader>
          <ModalBody>
            Are you sure you want to report this message?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleReport}>
              Yes, Report
            </Button>
            <Button variant="ghost" onClick={closeReportModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this message?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDelete(deleteMessageId)}>
              Yes, Delete
            </Button>
            <Button variant="ghost" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal to display clicked image */}
      <Modal isOpen={clickedImageUrl !== null} onClose={() => setClickedImageUrl(null)} size="6xl">
        <ModalOverlay />
        <ModalContent maxW={modalMaxWidth}>
          <ModalBody>
            <img src={clickedImageUrl} alt="Clicked Image" style={{ maxWidth: "100%", height: "auto" }} />
          </ModalBody>
          <Button
            onClick={() => setClickedImageUrl(null)}
            colorScheme="red"
            borderRadius="50%"
            position="absolute"
            top="10px"
            right="10px"
            zIndex="9999"
          >
            &times;
          </Button>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default ScrollableChat;
