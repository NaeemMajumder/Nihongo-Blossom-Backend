// Express
const express = require("express");

// Express-Router
const router = express.Router();

const Lesson = require("../models/lesson.js");
const Vocabulary = require("../models/vocabulary.js");

router.get("/", async (req, res) => {
  let allVocabularies = await Vocabulary.find({});
  res.send(allVocabularies);
});

router.post("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
  let vocabulary = await Vocabulary.findById(req.params.id);
  res.send(vocabulary);
});

router.get("/edit/:id", async (req, res) => {
  let vocabulary = await Vocabulary.findById(req.params.id);
  res.send(vocabulary);
});

// PUT to update vocabulary and move it to a new lesson if lessonNo changes
router.put("/:id", async (req, res) => {
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
        return res.status(404).send({
          message: "New lesson not found for the given lesson number.",
        });
      }

      newLesson.vocabularies.push(vocabulary);
      await newLesson.save();
    }

    vocabulary = await Vocabulary.findByIdAndUpdate(
      id,
      { ...updatedVocabulary },
      { new: true }
    );

    res.send(vocabulary);
  } catch (error) {
    console.error("Error updating vocabulary:", error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the vocabulary." });
  }
});

router.delete("/:id", async (req, res) => {
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

module.exports = router;
