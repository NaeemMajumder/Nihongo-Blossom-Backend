if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Admin = require("./models/admin.js");
const Lesson = require("./models/lesson.js");
const User = require("./models/newUser.js");
const Vocabulary = require("./models/vocabulary.js");
const Tutorial = require("./models/tutorial.js");

const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 8080;

let mongo_url = "mongodb://127.0.0.1:27017/NihongoBlossom";
main()
  .then(() => {})
  .catch((error) => {});
async function main() {
  await mongoose.connect(mongo_url);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is a root route");
});

app.get("/allUsers/user", async (req, res) => {
  let { email } = req.query;

  try {
    let user;
    if (email === "admin@gmail.com") {
      user = await Admin.findOne({ email: email });
    } else {
      user = await User.findOne({ email: email });
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
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

app.post("/admin/allUsers", upload.single("photoUrl"), async (req, res) => {
  let { filename, path } = req.file;
  let url = path;

  let user = new User(req.body);
  user.photoUrl = { filename, url };
  await user.save();
  res.send(user);
});

app.put("/admin/allUsers/:id", async (req, res) => {
  const userId = req.params.id;
  const { isAdmin } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin === isAdmin) {
      return res.status(400).json({
        message: "No change in user role, isAdmin is already the same",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/completeLesson", async (req, res) => {
  try {
    const { lessonId, userEmail } = req.body;

    let userInfo = await User.findOne({ email: userEmail });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    let lessonInfo = await Lesson.findById(lessonId);
    if (!lessonInfo) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!userInfo.lessons) {
      userInfo.lessons = [];
    }

    const lessonAlreadyCompleted = userInfo.lessons.some(
      (lesson) => lesson.lessonId.toString() === lessonId.toString()
    );

    if (lessonAlreadyCompleted) {
      return res.status(400).json({ message: "You have already completed this lesson." });
    }

    userInfo.lessons.push({
      lessonId: lessonInfo._id,
      completedStatus: true,
    });

    await userInfo.save();
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
  res.send(lesson);
});

app.get("/admin/allLessons/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id).populate("vocabularies");
  res.send(lesson);
});

app.get("/admin/allVocabularies/:id", async (req, res) => {
  let vocabulary = await Vocabulary.findById(req.params.id);
  res.send(vocabulary);
});

app.get("/admin/allVocabularies/edit/:id", async (req, res) => {
  let vocabulary = await Vocabulary.findById(req.params.id);
  res.send(vocabulary);
});

app.post("/admin/allVocabularies", async (req, res) => {
  try {
    let newVocabulary = req.body;
    let vocabulary = new Vocabulary(newVocabulary);

    let lesson = await Lesson.findOne({ lessonNumber: newVocabulary.lessonNo });

    if (!lesson) {
      return res.status(404).send({ message: "Lesson not found for the given lesson number." });
    }

    lesson.vocabularies.push(vocabulary);

    let vocab = await vocabulary.save();
    let newLesson = await lesson.save();

    res.send(vocab);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while processing the request." });
  }
});

// PUT to update vocabulary and move it to a new lesson if lessonNo changes
app.put("/admin/allVocabularies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVocabulary = req.body;

    let vocabulary = await Vocabulary.findById(id);

    if (!vocabulary) {
      return res.status(404).send({ message: "Vocabulary not found." });
    }

    if (vocabulary.lessonNo !== updatedVocabulary.lessonNo) {
      let oldLesson = await Lesson.findOne({
        lessonNumber: vocabulary.lessonNo,
      });
      if (oldLesson) {
        oldLesson.vocabularies.pull(vocabulary._id);
        await oldLesson.save();
      }

      let newLesson = await Lesson.findOne({
        lessonNumber: updatedVocabulary.lessonNo,
      });
      if (!newLesson) {
        return res
          .status(404)
          .send({
            message: "New lesson not found for the given lesson number.",
          });
      }

      newLesson.vocabularies.push(vocabulary);
      await newLesson.save();
    }

    vocabulary = await Vocabulary.findByIdAndUpdate(
      id,
      { ...updatedVocabulary },
      { new: true },
    );

    res.send(vocabulary);
  } catch (error) {
    console.error("Error updating vocabulary:", error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the vocabulary." });
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

app.get("/admin/allLessons/edit/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id);
  res.send(lesson);
});

app.put("/admin/allLessons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateLesson = req.body;

    const updatedLesson = await Lesson.findByIdAndUpdate(id, {
      ...updateLesson,
    });

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ message: "Internal server error" });
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

app.get("/admin/allTutorials/edit/:id", async (req, res) => {
  let tutorial = await Tutorial.findById(req.params.id);
  res.send(tutorial);
});
app.put("/admin/allTutorials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateTutorial = req.body;

    const updatedTutorial = await Tutorial.findByIdAndUpdate(id, {
      ...updateTutorial,
    });

    if (!updatedTutorial) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(updatedTutorial);
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete("/admin/allTutorials/:id", async (req, res) => {
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
