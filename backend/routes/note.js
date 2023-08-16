const express = require('express')
const Note = require("../models/Note")
const fetchuser = require("../middleware/fetchuser")
const router = express.Router()
const { body, validationResult } = require('express-validator');

//ROUTE1 : Fetch all notes of a user GET "/api/note/fetchallnotes", Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//ROUTE2 : Add a note POST "/api/note/addnote", Login required
router.post('/addnote', fetchuser, [
  body('title', 'Title must have minimum of 5 characters').isLength({ min: 3 }),
  body('description', 'Description must have minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  // if there are errors return bad requests and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tag } = req.body;
    const note = new Note({
      title, description, tag, user: req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})


//ROUTE3 : Update an existing note PUT "/api/note/updatenote", Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const {title, description, tag} = req.body;
  
  const newNote = {};
  if(title){newNote.title = title};
  if(description){newNote.description = description};
  if(tag){newNote.tag = tag};

  // Find the note to be update and update it
  let note = await Note.findById(req.params.id);
  if(!note){
    return res.status(404).send("Not found")
  }

  // Allow updation only if user owns this note
  if(req.user.id !== note.user.toString()){
    return res.status(401).send("Not allowed")
  }

  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
  res.json({note});

})

//ROUTE4 : Delete a note PUT "/api/note/deletenote", Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

  // Find the note to be deleted and delete it
  let note = await Note.findById(req.params.id);
  if(!note){
    return res.status(404).send("Not found")
  }

  // Allow deletion only if user owns this note
  if(req.user.id !== note.user.toString()){
    return res.status(401).send("Not allowed")
  }

  note = await Note.findByIdAndDelete(req.params.id);
  res.json({"Success":"Note deleted successfully", note:note});

})

module.exports = router;