// Express
const express = require("express");

// Express-Router
const router = express.Router();

const Lesson = require("../models/lesson.js");

router.get("/lessons", async (req, res) => {
  let lessons = await Lesson.find({}).populate("vocabularies");
  res.send(lessons);
});

router.get("/lessons/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id).populate("vocabularies");
  res.send(lesson);
});

router.get("/admin/allLessons", async (req, res) => {
  let allLessons = await Lesson.find({});
  res.send(allLessons);
});

router.post("/admin/allLessons", async (req, res) => {
  let { lessonName, lessonNumber } = req.body;

  let newLesson = new Lesson({
    lessonTitle: lessonName,
    lessonNumber,
  });

  await newLesson.save();
  res.send(newLesson);
});
router.get("/admin/allLessons/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id).populate("vocabularies");
  res.send(lesson);
});
router.get("/admin/allLessons/edit/:id", async (req, res) => {
  let lesson = await Lesson.findById(req.params.id);
  res.send(lesson);
});

router.put("/admin/allLessons/:id", async (req, res) => {
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
router.delete("/admin/allLessons/:id", async (req, res) => {
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

module.exports = router;
