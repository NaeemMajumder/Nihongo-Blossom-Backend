// Vocabulary model
const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    meaning: {
        type: String,
        required: true
    },
    pronunciation: {
        type: String,
        required: true
    },
    whenToSay: {
        type: String,
        required: true
    },
    lessonNumber: {
        type: Number, // Storing the lesson number here
        required: true
    }
});

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

module.exports = Vocabulary;
