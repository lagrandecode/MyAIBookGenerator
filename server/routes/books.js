const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');

// Get all books for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, genre, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (genre) query.genre = genre;
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const books = await Book.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Book.find(query).countDocuments();
    
    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBooks: total
    });
  } catch (error) {
    console.error('Books fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get single book by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ book });
  } catch (error) {
    console.error('Book fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Create new book (draft)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      genre,
      totalChapters,
      language = 'english',
      writingStyle = 'professional',
      targetAudience = 'general',
      tags = []
    } = req.body;

    // Basic validation
    if (!title || !description || !author || !genre || !totalChapters) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const book = new Book({
      user: req.user._id,
      title,
      description,
      author,
      genre,
      language,
      writingStyle,
      targetAudience,
      totalChapters,
      tags,
      status: 'draft'
    });

    await book.save();

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Book creation error:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Update book
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Only allow updates if book is in draft status
    if (book.status !== 'draft') {
      return res.status(400).json({ error: 'Can only update books in draft status' });
    }

    const updateData = {};
    const allowedFields = ['title', 'description', 'author', 'genre', 'language', 'writingStyle', 'targetAudience', 'tags'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Book update error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Book deletion error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Update chapter content
router.put('/:id/chapters/:chapterNumber', auth, async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Chapter content is required' });
    }

    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const chapterIndex = parseInt(req.params.chapterNumber) - 1;
    
    if (chapterIndex < 0 || chapterIndex >= book.chapters.length) {
      return res.status(400).json({ error: 'Invalid chapter number' });
    }

    book.chapters[chapterIndex].content = content;
    if (title) {
      book.chapters[chapterIndex].title = title;
    }

    await book.save();

    res.json({
      message: 'Chapter updated successfully',
      chapter: book.chapters[chapterIndex]
    });
  } catch (error) {
    console.error('Chapter update error:', error);
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

// Get chapter content
router.get('/:id/chapters/:chapterNumber', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const chapterIndex = parseInt(req.params.chapterNumber) - 1;
    
    if (chapterIndex < 0 || chapterIndex >= book.chapters.length) {
      return res.status(400).json({ error: 'Invalid chapter number' });
    }

    res.json({
      chapter: book.chapters[chapterIndex]
    });
  } catch (error) {
    console.error('Chapter fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// Get book statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const stats = {
      totalChapters: book.chapters.length,
      totalWordCount: book.totalWordCount || 0,
      totalPageCount: book.totalPageCount || 0,
      generationProgress: book.generationProgress || 0,
      status: book.status,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    };

    res.json({ stats });
  } catch (error) {
    console.error('Book stats error:', error);
    res.status(500).json({ error: 'Failed to get book statistics' });
  }
});

module.exports = router; 