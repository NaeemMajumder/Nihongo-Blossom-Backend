if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// import packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Admin = require("./models/admin.js");
const Lesson = require("./models/lesson.js");
const User = require("./models/newUser.js");
const Vocabulary = require("./models/vocabulary.js");
const Tutorial = require("./models/tutorial.js");

// app and port
const app = express();
const port = process.env.PORT || 8080;

// mongoose connect
let mongo_url = "mongodb://127.0.0.1:27017/NihongoBlossom";
main()
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((error) => {
    console.log(error);
  });
async function main() {
  await mongoose.connect(mongo_url);
}

// middleware
app.use(cors());
app.use(express.json());

// app.get("/demouser", async (req, res) => {
//     try {
//         let demo = new Lesson({
//             lessonNumber: 1,
//             lessonTitle: "lesson title" // Set admin status if needed
//         });

//         await demo.save(); // Save to MongoDB
//         res.send(demo);

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error creating admin user");
//     }
// });

app.get("/", (req, res) => {
  res.send("This is a root route");
});

app.get("/user",  (req, res) => {

});

app.get("/admin/allLessons", async (req, res) => {
  let allLessons = await Lesson.find({});
  res.send(allLessons);
});
app.post("/admin/allLessons", async (req, res) => {
  let { lessonName, lessonNumber } = req.body;

  let newLesson = new Lesson({
    lessonTitle: lessonName,
    lessonNumber,
  });

  await newLesson.save();
  res.send(newLesson);
});

app.get("/admin/allVocabularies", async (req, res) => {
  let allVocabularies = await Vocabulary.find({});
  res.send(allVocabularies);
});
app.post("/admin/allVocabularies", async (req, res) => {
  try {
    let newVocabulary = req.body;
    let vocabulary = new Vocabulary(newVocabulary);

    let lesson = await Lesson.findOne({ lessonNumber: newVocabulary.lessonNo });

    if (!lesson) {
      return res
        .status(404)
        .send({ message: "Lesson not found for the given lesson number." });
    }

    lesson.vocabularies.push(vocabulary);

    let vocab = await vocabulary.save();
    let newLesson = await lesson.save();

    res.send(vocab);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while processing the request." });
  }
});

app.get("/admin/allTutorials", async (req, res) => {
  let allTutorials = await Tutorial.find({});
  res.send(allTutorials);
});
app.post("/admin/allTutorials", async (req, res) => {
  let newTutorials = req.body;

  let tutorial = new Tutorial(newTutorials);
  await tutorial.save();
  res.send(tutorial);
});

app.get("/admin/allUsers", async (req, res) => {
  let allUsers = await User.find({});
  res.send(allUsers);
});
app.post("/admin/allUsers", async (req, res) => {
  let newUser = req.body;
  let user = new User(newUser);
  await user.save();
  res.send(user);
});

app.post("/completeLesson", async (req, res) => {
  try {
    const { lessonId, userEmail } = req.body;

    // Find the user by email
    let userInfo = await User.findOne({ email: userEmail });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the lesson by its ID
    let lessonInfo = await Lesson.findById(lessonId);
    if (!lessonInfo) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Ensure the lessons array exists
    if (!userInfo.lessons) {
      userInfo.lessons = []; // Initialize the lessons array if it does not exist
    }

    // Add the lesson to the user's lessons
    userInfo.lessons.push({
      lessonId: lessonInfo._id, // Save the lesson's ObjectId
      completedStatus: true, // Mark the lesson as completed
    });

    // Save the updated user info
    await userInfo.save();

    // Send a success response
    res.status(200).json({ message: "Lesson marked as completed" });
  } catch (error) {
    console.error("Error in completing lesson:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/lessons", async (req, res) => {
  let lessons = await Lesson.find({}).populate("vocabularies");
  res.send(lessons);
});
app.get("/lessons/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id).populate("vocabularies");
  // console.log(lesson);
  res.send(lesson);
});


app.get("/admin/allVocabularies/:id", (req,res)=>{
  console.log(req.params.id);
})

app.listen(port, () => {
  console.log(`port ${port} is running!!!`);
});
