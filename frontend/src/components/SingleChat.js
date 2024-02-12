import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast, Button } from '@chakra-ui/react';
import { ArrowBackIcon, AttachmentIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import { Image } from 'cloudinary-react';

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const fetchMessages = async (reloadCallback) => {
    if (!selectedChat) return;

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

      // Call the reloadCallback if provided
      if (reloadCallback) {
        reloadCallback();
      }
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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const cloudinaryScript = document.createElement("script");
    cloudinaryScript.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    cloudinaryScript.type = "text/javascript";
    cloudinaryScript.async = true;
    cloudinaryScript.onload = () => {
      console.log("Cloudinary script loaded!");
    };
    document.head.appendChild(cloudinaryScript);
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification, "-------------");

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  }, [notification, selectedChatCompare, setFetchAgain, messages]);

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const timerLength = 3000;

    if (timerId) {
      clearTimeout(timerId);
    }

    let timer = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, timerLength);

    setTimerId(timer);
  };

  const handleFileSharing = (fileType) => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dezs0hvsd',
        uploadPreset: 'ecttiiwf',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        maxFileSize: 10000000,
      },
      async (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          setPreviewImage(imageUrl);
          socket.emit("stop typing", selectedChat._id);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };

            setNewMessage("");
            const { data } = await axios.post(
              "/api/message",
              {
                content: imageUrl,
                chatId: selectedChat._id,
              },
              config
            );

            socket.emit("new message", data);
            setMessages([...messages, data]);
          } catch (error) {
            toast({
              title: "Error Occurred!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        }
      }
    );

    widget.open();
  };

  const EmojiPicker = ({ onSelectEmoji }) => {
    const [showEmojiOptions, setShowEmojiOptions] = useState(false);

    const emojis = ["😊", "😂", "😍", "🎉", "👍"]; // Add your desired emojis here

    return (
      <div style={{ display: 'inline-block' }}>
        <span
          role="img"
          aria-label="emoji-picker"
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={() => setShowEmojiOptions(!showEmojiOptions)}
        >
          😀
        </span>
        {showEmojiOptions && (
          <div style={{ display: 'inline-block', background: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
            {emojis.map((emoji, index) => (
              <span
                key={index}
                style={{ fontSize: '24px', cursor: 'pointer', marginRight: '10px' }}
                onClick={() => onSelectEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji); // Append the selected emoji to the message
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            color="white"
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <ScrollableChat
                messages={messages}
                setLoading={setLoading}
                selectedChat={selectedChat}
                setMessages={setMessages}
              />
            )}

<FormControl
  id="first-name"
  isRequired
  mt={3}
  display="flex"
  alignItems="center"
  position="relative" // Add this line to make the container relative
>
  {istyping ? ( // Move the typing indicator here
    <div className="typing-indicator" style={{ position: "absolute", top: "-35px", left: "40px" }}>
      <span style={{ fontStyle: "italic", color: "green", marginRight: "5px", fontSize: "14px" }}>Typing</span>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  ) : (
    <></>
  )}
  <div style={{ position: 'relative', flex: 1 }}>
    <Input
      variant="filled"
      bg="#E0E0E0"
      placeholder="Enter a message..."
      value={newMessage}
      onChange={typingHandler}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault(); // Prevent the default behavior of the Enter key
          sendMessage(); // Call the sendMessage function
        }
      }}
    />
    {newMessage && ( // Show send icon if newMessage is not empty
      <IconButton
        icon={<ArrowForwardIcon />} // Replace SendIcon with the appropriate icon component
        aria-label="Send"
        position="absolute"
        right="1"
        top="50%"
        transform="translateY(-50%)"
        onClick={sendMessage}
        boxSize={8}
      />
    )}
  </div>
  <EmojiPicker onSelectEmoji={handleEmojiSelect} />
  <IconButton
    icon={<AttachmentIcon />}
    aria-label="Attach File"
    onClick={handleFileSharing}
    mr="2"
  />
</FormControl>



          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans" color="white">
            Search or Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
