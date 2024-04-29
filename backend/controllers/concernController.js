const Concern = require('../models/concernModel');

// Controller function to create a new concern
const createConcern = async (req, res) => {
    const { senderName, senderEmail, concern } = req.body;

    try {
        const newConcern = new Concern({
            senderName,
            senderEmail,
            concern
        });

        await newConcern.save();

        // Email sending logic here
        // If email sending is successful
        newConcern.status = 'Sent';
        await newConcern.save();

        res.json({ success: true, message: 'Concern sent and recorded successfully!' });
    } catch (error) {
        console.error('Error in sending concern:', error);
        res.status(500).json({ success: false, message: 'Failed to send concern.' });
    }
};

// Controller function to fetch messages from the database
const fetchMessages = async (req, res) => {
    try {
        const messages = await Concern.find().sort({ sentAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
    }
};

    //Controller function to fetch concerns from the database
    const fetchAllConcerns = async (req, res) => {
        try{
            const concerns = await Concern.find().sort({sentAt: -1});
            res.json(concerns);
        }catch (error) {
            console.error('Error fetching concerns:', error);
            res.status(500).json({success:false, message:'Failed to fetch concerns'});
        }
    };
module.exports = { createConcern, fetchMessages, fetchAllConcerns };
