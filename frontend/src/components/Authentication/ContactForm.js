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
    ModalCloseButton, 
    useToast
} from '@chakra-ui/react';

const ContactForm = ({ isOpen, onClose }) => {
    const form = useRef();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formError, setFormError] = useState(false);
    const toast = useToast();
  
    const sendEmailAndSaveConcern = (e) => {
        e.preventDefault();

        const senderName = form.current.user_name.value;
        const senderEmail = form.current.user_email.value;
        const concern = form.current.message.value;
  
        if (senderName && senderEmail && concern ) {
            //send in email
            emailjs
                .sendForm('service_mc1qcnu', 'template_v5zpk85', form.current, 'ZzJ4aCgKj4ZmsF3Md')
                .then(
                    (response) => {
                        console.log('SUCCESS!', response.status, response.text);
                        setShowSuccessMessage(true);
                        form.current.reset();
                        setFormError(false);
  
            // save in database
            fetch('/api/concern/send-concern', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderName,
                    senderEmail,
                    concern
                })
            })
            .then(res => res.json())
            .then(data => {
                toast({
                    title: "Success",
                    description: data.message,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onClose(); // Close the modal after success
            })
            .catch(err => {
                console.error('Error saving concern:', err);
                toast({
                    title: "Error",
                    description: "Failed to save concern in database.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            });

        }, (error) => {
            console.error('Email FAILED...', error);
            toast({
                title: "Error",
                description: "Failed to send email.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
} else {
    setFormError(true);
    toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
    });
}
};
  
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent style={{ padding: '10px', borderRadius: '20px'}}>
            <ModalHeader
            fontSize="30px"
            fontFamily="'Montserrat', sans-serif"
            display="flex"
            justifyContent="center"
            color="rgb(12, 91, 9, 0.9)">
                Contact Us
            </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form ref={form} onSubmit={sendEmailAndSaveConcern}>
                    <label htmlFor="send_to"
        style={{ fontSize: '20px'}}>Recipient:</label>
                        <FormControl id="sendTo" isRequired mt={4}>
                        <Input type="email" name="send_to" bg="#eee" value="ilchatu2023@gmail.com" disabled />
                        </FormControl>
                        <FormControl id="name" isRequired mt={4}>
                        <Input type="text" name="user_name" bg="#eee" placeholder="Your Name" />
                        </FormControl>
                        <FormControl id="email" isRequired mt={4}>
                        <Input type="email" name="user_email" bg="#eee" placeholder="Your Email" />
                        </FormControl>
                        <FormControl id="message" isRequired mt={4}>
                        <textarea 
            name="message" 
            placeholder="Your Message" 
            style={{ backgroundColor: '#eee', width: '100%', height: '100px', padding: '8px', fontSize: '16px' }}
  />
                        </FormControl>
                        <Button colorScheme="green" width="100%" mt={4} mb={4} type="submit"  style={{ height: '50px', fontSize: '17px', fontFamily: 'Arial',    background: 'linear-gradient(to right, #313431, #059a05)'}}>
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
