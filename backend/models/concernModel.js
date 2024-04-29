const mongoose = require('mongoose');

const concernSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true
    },
    senderEmail: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    concern: {  
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Sent', 'Failed']
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Concern = mongoose.model('Concern', concernSchema);

module.exports = Concern;
