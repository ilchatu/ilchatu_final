const express = require('express');
const router = express.Router();
const { 
    createConcern, 
    fetchMessages, 
    fetchAllConcerns 
} = require('../controllers/concernController'); // Import controller functions

// Route to send a concern
router.post('/send-concern', createConcern);

// Route to fetch messages from the database
router.get('/fetch-messages', fetchMessages);

//Route to fetch the concerns from the database
router.get('/fetch-all-concerns', fetchAllConcerns);

module.exports = router;
