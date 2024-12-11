// Lesson model
const mongoose = require('mongoose');
const Vocabulary = require("./vocabulary.js"); // Assuming you have a Vocabulary model

const lessonSchema = new mongoose.Schema({
    lessonNumber: {
        type: Number,
        required: true,
    },
    lessonTitle: {
        type: String,
        required: true
    },
    vocabularies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vocabulary" 
        }
    ],
    completedStatus: {
        type: Boolean,
        default: false 
    }
});


const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
