const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newNote = new Note({
      title,
      content: content || '',
      createdBy: req.user.id
    });

    await newNote.save();
    res.status(201).json({ message: 'Note created', note: newNote });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to update this note' });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();
    res.json({ message: 'Note updated', note });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ message: 'Server error',error:err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this note' });

    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
