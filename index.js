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

app.get("/admin/allLessons/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id).populate("vocabularies");
  // console.log(lesson);
  res.send(lesson);
});


app.get("/admin/allVocabularies/:id", async(req,res)=>{

  let vocabulary = await Vocabulary.findById(req.params.id);
  res.send(vocabulary);
});

app.get("/admin/allVocabularies/edit/:id", async(req,res)=>{

  let vocabulary = await Vocabulary.findById(req.params.id);
  res.send(vocabulary);
});
// POST to create vocabulary and assign it to a lesson
app.post("/admin/allVocabularies", async (req, res) => {
  try {
    let newVocabulary = req.body;
    let vocabulary = new Vocabulary(newVocabulary);

    // Find the lesson based on the lesson number from the vocabulary input
    let lesson = await Lesson.findOne({ lessonNumber: newVocabulary.lessonNo });

    if (!lesson) {
      return res
        .status(404)
        .send({ message: "Lesson not found for the given lesson number." });
    }

    // Add the new vocabulary to the lesson's vocabularies array
    lesson.vocabularies.push(vocabulary);

    // Save the vocabulary and the lesson
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

// PUT to update vocabulary and move it to a new lesson if lessonNo changes
app.put("/admin/allVocabularies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVocabulary = req.body;

    // Find the existing vocabulary to update
    let vocabulary = await Vocabulary.findById(id);

    if (!vocabulary) {
      return res.status(404).send({ message: "Vocabulary not found." });
    }

    // If the lessonNo is changing, update both the old and new lesson references
    if (vocabulary.lessonNo !== updatedVocabulary.lessonNo) {
      // 1. Remove the vocabulary from the old lesson's vocabularies array
      let oldLesson = await Lesson.findOne({ lessonNumber: vocabulary.lessonNo });
      if (oldLesson) {
        oldLesson.vocabularies.pull(vocabulary._id); // Remove the vocabulary from old lesson
        await oldLesson.save();
      }

      // 2. Find the new lesson based on the new lessonNo and add the vocabulary
      let newLesson = await Lesson.findOne({ lessonNumber: updatedVocabulary.lessonNo });
      if (!newLesson) {
        return res
          .status(404)
          .send({ message: "New lesson not found for the given lesson number." });
      }

      newLesson.vocabularies.push(vocabulary); // Add vocabulary to the new lesson
      await newLesson.save();
    }

    // Update the vocabulary with the new data (including the new lessonNo)
    vocabulary = await Vocabulary.findByIdAndUpdate(id, { ...updatedVocabulary }, { new: true });

    res.send(vocabulary);
  } catch (error) {
    console.error("Error updating vocabulary:", error);
    res.status(500).send({ message: "An error occurred while updating the vocabulary." });
  }
});

app.delete("/admin/allVocabularies/:id", async (req, res) => {
  try {
    const result = await Vocabulary.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).send({ message: "Vocabulary deleted successfully" });
    } else {
      res.status(404).send({ message: "Vocabulary not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting vocabulary", error });
  }
});

app.get("/admin/allLessons/edit/:id", async(req,res)=>{
  console.log(req.params.id);
  let lesson = await Lesson.findById(req.params.id);
  res.send(lesson);
});

app.put('/admin/allLessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateLesson = req.body;

    const updatedLesson = await Lesson.findByIdAndUpdate(id,{...updateLesson});

    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete("/admin/allLessons/:id", async (req, res) => {
  try {
    const result = await Lesson.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).send({ message: "Lesson deleted successfully" });
    } else {
      res.status(404).send({ message: "Lesson not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting Lesson", error });
  }
});

app.get("/admin/allTutorials/edit/:id", async(req,res)=>{
  console.log(req.params.id);
  let tutorial = await Tutorial.findById(req.params.id);
  res.send(tutorial);
});
app.put('/admin/allTutorials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateTutorial = req.body;

    const updatedTutorial = await Tutorial.findByIdAndUpdate(id,{...updateTutorial});

    if (!updatedTutorial) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(updatedTutorial);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete("/admin/allTutorials/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await Tutorial.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).send({ message: "Tutorial deleted successfully" });
    } else {
      res.status(404).send({ message: "Tutorial not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting Tutorial", error });
  }
});





app.listen(port, () => {
  console.log(`port ${port} is running!!!`);
});
