if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Admin = require("./models/admin.js");
const Lesson = require("./models/lesson.js");
const User = require("./models/newUser.js");

const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 8080;

let mongo_url = process.env.MONGO_URL;
main()
  .then(() => {})
  .catch((error) => {});
async function main() {
  await mongoose.connect(mongo_url);
}

// Express-Router Routes
const lessonRouter = require("./routes/lesson.js");
const vocabularyRouter = require("./routes/vocabulary.js");
const tutorialRouter = require("./routes/tutorial.js");
const userRouter = require("./routes/user.js");

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

// Use distinct paths for lesson and vocabulary routes
app.use("/", lessonRouter);
app.use("/admin/allVocabularies", vocabularyRouter);
app.use("/admin/allTutorials", tutorialRouter);
app.use("/admin/allUsers", userRouter);

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
      return res
        .status(400)
        .json({ message: "You have already completed this lesson." });
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

app.listen(port, () => {
  console.log(`port ${port} is running!!!`);
});
