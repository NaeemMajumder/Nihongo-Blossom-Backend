const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    videoTitle: {
        type: String,
        required: true,
    },
    videoURL: {
        type: String,
        required: true,
    }
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;
