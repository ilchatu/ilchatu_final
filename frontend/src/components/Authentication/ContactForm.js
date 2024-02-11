import React, { useRef, useState } from 'react'; 
import emailjs from 'emailjs-com';
import {
    Button,
    FormControl,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton 
} from '@chakra-ui/react';

const ContactForm = ({ isOpen, onClose }) => {
    const form = useRef();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formError, setFormError] = useState(false);
  
    const sendEmail = (e) => {
        e.preventDefault();
  
        if (
            form.current.user_name.value &&
            form.current.user_email.value &&
            form.current.message.value
        ) {
            emailjs
                .sendForm('service_mc1qcnu', 'template_v5zpk85', form.current, 'ZzJ4aCgKj4ZmsF3Md')
                .then(
                    (response) => {
                        console.log('SUCCESS!', response.status, response.text);
                        setShowSuccessMessage(true);
                        form.current.reset();
                        setFormError(false);
  
                        setTimeout(() => {
                            setShowSuccessMessage(false);
                            onClose(); // Close the modal after success
                        }, 3000);
                    },
                    (error) => {
                        console.error('FAILED...', error);
                    }
                );
        } else {
            setFormError(true);
        }
    };
  
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Contact Us</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form ref={form} onSubmit={sendEmail}>
                    <label htmlFor="send_to">Recipient:</label>
                        <FormControl id="sendTo" isRequired mt={4}>
                            <Input type="email" name="send_to" value="ilchatu2023@gmail.com" disabled />
                        </FormControl>
                        <FormControl id="name" isRequired mt={4}>
                            <Input type="text" name="user_name" placeholder="Your Name" />
                        </FormControl>
                        <FormControl id="email" isRequired mt={4}>
                            <Input type="email" name="user_email" placeholder="Your Email" />
                        </FormControl>
                        <FormControl id="message" isRequired mt={4}>
                            <textarea 
                                name="message" 
                                placeholder="Your Message" 
                                style={{ width: '100%', height: '100px' }} // Adjust the width and height here
                            />
                        </FormControl>
                        <Button colorScheme="green" width="100%" mt={4} type="submit">
                            Send Message
                        </Button>
                    </form>
                    {formError && <p>Please fill in all fields.</p>}
                    {showSuccessMessage && <p>Message sent successfully!</p>}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ContactForm;
