import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ChangePassword from "./ChangePassword";
import ChangeProfile from "./ChangeProfile";
import EditProfile from "./EditProfile";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { Alert, AlertIcon, Input, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Icon } from "@chakra-ui/icon";
import { FaBullhorn } from "react-icons/fa";
import moment from "moment";

// Import Chakra UI Modal components
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/modal";

const AnnouncementModal = ({ isOpen, onClose }) => {
  const [announcement, setAnnouncement] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Set loading to true when fetching announcements starts
        setLoading(true);

        // Fetch announcements
        const response = await axios.get("/api/announcement");
        setAnnouncement(response.data);

        // Set loading to false when fetching is complete
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        // Set loading to false on error as well
        setLoading(false);
      }
    };

    // Fetch announcements when the modal is opened
    if (isOpen) {
      fetchAnnouncements();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
          Announcements
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Render loading message and spinner while fetching announcements */}
          {loading ? (
            <>
              <p>Loading announcements...</p>
              <Spinner size="xl" color="blue.500" alignSelf="center" />
            </>
          ) : (
            // Render announcements once loaded
            announcement?.map((item, i) => (
              <Alert
                key={i}
                status="success"
                style={{
                  marginBottom: "5px",
                  whiteSpace: "pre-line",
                  maxWidth: "100%",
                }}
              >
                <AlertIcon as={FaBullhorn} color="blue.500" mr={2} />
                <div>
                  {item.title}
                  <br />
                  <span style={{ fontSize: "0.6em", color: "#666", marginLeft: "260px" }}>
                    {moment(item.createdAt).format("MMM Do YYYY")}
                  </span>
                </div>
              </Alert>
            ))
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
  

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id))
      setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search iLchatUsers" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"> </i>
            <Text display={{ base: "none", MenuDivider: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon color="black" fontSize="2xl" m={1} />
            {notification.length > 0 && (
              <span
                className="notification-badge"
                style={{
                  animation: notification.length > 0 ? "scaleEffect 0.5s infinite alternate" : "none",
                }}
              >
                {notification.length}
              </span>
            )}
          </MenuButton>

          <MenuList pl={1}>
          <MenuItem
            onClick={() => setAnnouncementModalOpen(true)}
            fontWeight="bold"
            color="blue.500"
            backgroundColor="gray.100"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={FaBullhorn} mr={2} /> Announcements
          </MenuItem>
          {!notification.length && "No New Messages"}
          {notification.map((notif) => (
            <MenuItem
              key={notif._id}
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}
            >
              {notif.chat.isGroupChat
                ? `New Message in ${notif.chat.chatName}`
                : `New Message from ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))}
        </MenuList>

        </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider/>
              <ChangePassword user={user}>
                <MenuItem>Change Password</MenuItem>
              </ChangePassword>
              <ChangeProfile user={user}>
                <MenuItem>Change Profile</MenuItem>
              </ChangeProfile>
              <EditProfile user={user}>
                <MenuItem>Edit Profile</MenuItem>
              </EditProfile>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" padding on bottom={2}>
              <Input
                placeholder="Search name or email"
                margin
                on
                right={3}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button colorScheme="green" onClick={handleSearch}>
                Search
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Render the AnnouncementModal */}
      <AnnouncementModal isOpen={announcementModalOpen} onClose={() => setAnnouncementModalOpen(false)} />
    </>
  );
};

export default SideDrawer;
