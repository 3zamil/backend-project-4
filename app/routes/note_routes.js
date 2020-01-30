// import express
const express = require("express");
// import router into express
const router = express.Router();
// import car model
const Note = require("../models/note");

const customErrors = require("../../lib/custom_errors");
const requireOnership = customErrors.requireOwnership;
const passport = require("passport");
const requireToken = passport.authenticate("bearer", { session: false });

//Index
// Get/cars

router.get("/notes", requireToken, (req, res, next) => {
  const userId = req.user._id;
  Note.find({ owner: userId })
    .then(notes => {
      res.status(200).json({ notes: notes });
    })
    .catch(next);
});
//    path     ,  callback function
//create root node
router.post("/notes", requireToken, (req, res, next) => {
  const userId = req.user._id;
  const newNote = req.body.note;
  newNote.parent = userId;
  newNote.owner = userId;
  Note.create(newNote)
    .then(note => {
      res.status(200).json({ note: note });
    })
    .catch(next);
});

//show
router.get("/notes/:id", requireToken, (req, res, next) => {
  const noteId = req.params.id;
  Note.findById(noteId)
    .then(note => {
      requireOnership(req, note);
      res.status(200).json({ note: note });
    })
    .catch(next);
});
//create with parent
router.post("/notes/:id", requireToken, (req, res, next) => {
  const parentId = req.params.id;
  const userId = req.user._id;
  const newNote = req.body.note;
  newNote.owner = userId;
  newNote.parent = parentId;
  Note.create(newNote)
    .then(note => {
      res.status(200).json({ note: note });
    })
    .catch(next);
});

router.patch("/notes/:id", requireToken, (req, res, next) => {
  const noteId = req.params.id;
  const updatedNote = req.body.note;
  Note.findByIdAndUpdate(noteId, updatedNote)
    .then(note => {
      requireOnership(req, note);
      res.sendStatus(204);
    })
    .catch(next);
});

router.delete("/notes/:id", requireToken, (req, res, next) => {
  const noteId = req.params.id;
  // const updatedCar = req.body.car
  Note.findByIdAndRemove(noteId)
    .then(note => {
      requireOnership(req, note);
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = router;
