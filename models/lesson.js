// Lesson model
const mongoose = require('mongoose');
const Vocabulary = require("./vocabulary.js"); // Assuming you have a Vocabulary model

const lessonSchema = new mongoose.Schema({
    lessonNumber: {
        type: Number,
        required: true,
        unique: true // Each lesson should have a unique number
    },
    lessonTitle: {
        type: String,
        required: true
    },
    vocabularies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vocabulary" // Referring to the Vocabulary model
        }
    ]
});

// You can add methods, virtuals, or pre/post hooks if necessary

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
