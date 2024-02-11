import React, { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { IconButton } from "@chakra-ui/react";
import {
  Text,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast // Import useToast hook
} from "@chakra-ui/react";
import moment from "moment";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import "./Announcement.css";

const UsersManagement = () => {
  const [isCreateAnnouncementModalOpen, setCreateAnnouncementModalOpen] = useState(false);
  const [isUpdateAnnouncementModalOpen, setUpdateAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const { isOpen: deleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure();
  const { isOpen: announcementModalOpen, onOpen: openAnnouncementModal, onClose: closeAnnouncementModal } = useDisclosure();
  const { user } = ChatState();
  const [title, setTitle] = useState("");
  const [announcement, setAnnouncement] = useState([]);
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/announcement")
      .then((res) => {
        setAnnouncement(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAnnouncement = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .post(
          `/api/announcement/create`,
          {
            title: title,
          },
          config
        )
        .then((response) => {
          axios
            .get("/api/announcement")
            .then((res) => {
              setAnnouncement(res.data);
              toast({
                title: "Announcement created successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              closeAnnouncementModal();
              setCreateAnnouncementModalOpen(false);
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnnouncement = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/announcement/${selectedAnnouncementId}`, config).then(() => {
        axios
          .get("/api/announcement")
          .then((res) => {
            setAnnouncement(res.data);
            toast({
              title: "Announcement deleted successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            closeDeleteModal();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateAnnouncement = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .put(
          `/api/announcement/${selectedAnnouncementId}`,
          {
            title: title,
          },
          config
        )
        .then((response) => {
          axios
            .get("/api/announcement")
            .then((res) => {
              setAnnouncement(res.data);
              toast({
                title: "Announcement updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              closeAnnouncementModal();
              setUpdateAnnouncementModalOpen(false);
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const openDeleteConfirmationModal = (id) => {
    setSelectedAnnouncementId(id);
    openDeleteModal();
  };

  const openUpdateAnnouncementModal = (id, title) => {
    setSelectedAnnouncementId(id);
    setTitle(title);
    setUpdateAnnouncementModalOpen(true);
  };

  const openContentModal = (content) => {
    setSelectedAnnouncement(content);
    openAnnouncementModal();
  };

  const closeContentModal = () => {
    setSelectedAnnouncement(null);
    closeAnnouncementModal();
  };

  return (
    <div>
      <>
        <Button
          onClick={() => setCreateAnnouncementModalOpen(true)}
          colorScheme="blue"
          style={{
            marginTop: "15px",
            marginBottom: "20px",
          }}
        >
          Create Announcement
        </Button>

        
        <Modal 
          isOpen={isCreateAnnouncementModalOpen}
          onClose={() => {
            setCreateAnnouncementModalOpen(false);
            closeContentModal();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text fontSize="xl" fontWeight="bold">
                Create Announcement
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>iLchatUsers will see this announcement</FormLabel>
                <Textarea
                  rows={4}
                  placeholder="Type your announcement here..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" mr={3} onClick={() => setCreateAnnouncementModalOpen(false)}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handleAnnouncement}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isUpdateAnnouncementModalOpen}
          onClose={() => {
            setUpdateAnnouncementModalOpen(false);
            closeContentModal();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text fontSize="xl" fontWeight="bold">
                Update Announcement
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>iLchatUsers will see this announcement</FormLabel>
                <Textarea
                  rows={4}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" mr={3} onClick={() => setUpdateAnnouncementModalOpen(false)}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={updateAnnouncement}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <TableContainer
  className="table-container"
  style={{
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "20px",
    maxHeight: "500px", // Set maximum height
    overflowY: "auto", // Enable vertical scrolling if needed
  }}
>
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Created</Th>
        <Th>Title</Th>
        <Th>Action</Th>
      </Tr>
    </Thead>
    <Tbody>
      {announcement?.map((item) => (
        <Tr key={item?._id}>
          <Td>{moment(item?.createdAt).format("MMM Do YYYY")}</Td>
          <Td
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            }}
            onClick={() => openContentModal(item)}
          >
            {item?.title}
          </Td>
          <Td>
            <IconButton
              icon={<IoEye />}
              aria-label="View Announcement"
              onClick={() => openContentModal(item)}
              colorScheme="blue"
              mr={2}
            />
            <Button
              onClick={() => openUpdateAnnouncementModal(item?._id, item?.title)}
              colorScheme="blue"
              mr={2}
            >
              EDIT
            </Button>
            <Button
              onClick={() => openDeleteConfirmationModal(item?._id)}
              colorScheme="red"
            >
              Delete
            </Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
</TableContainer>


        <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Announcement</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this announcement?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteAnnouncement}>
                Delete
              </Button>
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal to display announcement content */}
        <Modal isOpen={announcementModalOpen} onClose={closeContentModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Announcement</ModalHeader>
            <ModalCloseButton />
            <ModalBody maxHeight="80vh" overflowY="auto">
          {selectedAnnouncement && (
            <Text
              whiteSpace="pre-line" // Preserve line breaks and spaces
              wordWrap="break-word" // Wrap long words to the next line
            >
              {selectedAnnouncement.title}
            </Text>
          )}
        </ModalBody>
          </ModalContent>
        </Modal>
            </div> 
    );
};

export default UsersManagement;
