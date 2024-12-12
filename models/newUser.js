// // User model
const mongoose = require("mongoose");
const Lesson = require("./lesson.js"); // Assuming you have a Lesson model

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     photoUrl: {
//         type: String,
//         default: "https://example.com/default-photo.png" // Default URL for photo, you can replace this
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false // Default to 'false' for regular users
//     },
//     lessons: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Lesson" // Referring to the Lesson model, assuming you have one for the lessons
//         }
//     ]
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photoUrl: {
    url:String,
    filename:String,
    // type: String,
    // default: "https://example.com/default-photo.png",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  lessons: [
    {
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
      completedStatus: {
        type: Boolean,
        default: false, // By default, lessons are incomplete
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
