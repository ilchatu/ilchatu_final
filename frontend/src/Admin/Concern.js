import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Box,
    Text
} from '@chakra-ui/react';
import './Concerns.css'; // Import the CSS file

const Concerns = () => {
    const [concerns, setConcerns] = useState([]);
    const [selectedConcern, setSelectedConcern] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to fetch all concerns from the backend
    const fetchAllConcerns = async () => {
        try {
            const response = await fetch(`/api/concern/fetch-all-concerns?_=${new Date().getTime()}`);
            if (response.ok) {
                const data = await response.json();
                setConcerns(data);
            } else {
                console.error('Failed to fetch concerns:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching concerns:', error);
        }
    };

    useEffect(() => {
        fetchAllConcerns();
    }, []); // Fetch concerns on component mount

    // Function to handle opening modal and setting selected concern
    const handleOpenModal = (concern) => {
        setSelectedConcern(concern);
        setIsModalOpen(true);
    };

    // Function to handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
          <Text className="bold-text white-text" fontSize="32px">Hello admin</Text>

           
            <div className="concern-container">
            
                {concerns.map(concern => (
                    <Box className="concern-box" key={concern._id} onClick={() => handleOpenModal(concern)}>
                        <Text className="bold-text black-text">{concern.senderName}</Text>
                     { /*  <Text className="bold-text black-text">{concern.concern}</Text> */}
                    </Box>                
                ))}
           
            </div>
        

            {/* Modal for detailed view of selected concern */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Concern Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedConcern && (
                            <>
                                <Text fontWeight="bold">Name: {selectedConcern.senderName}</Text>
                                <Text>Email: {selectedConcern.senderEmail}</Text>
                                <Text>Concern: {selectedConcern.concern}</Text>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Concerns;
