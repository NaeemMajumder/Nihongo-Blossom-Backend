// Express
const express = require("express");

// Express-Router
const router = express.Router();

const Tutorial = require("../models/tutorial.js");

router.get("/", async (req, res) => {
  let allTutorials = await Tutorial.find({});
  res.send(allTutorials);
});

router.post("/", async (req, res) => {
  let newTutorials = req.body;

  let tutorial = new Tutorial(newTutorials);
  await tutorial.save();
  res.send(tutorial);
});

router.get("/edit/:id", async (req, res) => {
  let tutorial = await Tutorial.findById(req.params.id);
  res.send(tutorial);
});
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

module.exports = router;
