const express = require('express');
const { auth } = require('../middleware/auth');
const Book = require('../models/Book');
const chatgptService = require('../services/chatgptService');

const router = express.Router();

// Generate a complete book
router.post('/book', auth, async (req, res) => {
  try {
    const {
      title,
      author,
      language,
      level,
      style,
      goals,
      topics,
      examplesPerTopic,
      numberOfPages,
      includeTableOfContents,
      includeExercises,
      codeExplanation,
      tone,
      format
    } = req.body;

    // Validate required fields
    if (!title || !author || !language || !goals || !topics || topics.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create book record in database
    const book = new Book({
      userId: req.user.id,
      title,
      author,
      language,
      level,
      style,
      goals,
      topics,
      examplesPerTopic,
      numberOfPages,
      includeTableOfContents,
      includeExercises,
      codeExplanation,
      tone,
      format,
      status: 'generating',
      generationStartTime: new Date()
    });

    await book.save();

    // Generate book content using ChatGPT
    const bookData = {
      title,
      author,
      language,
      level,
      style,
      goals,
      topics,
      examplesPerTopic,
      numberOfPages,
      includeTableOfContents,
      includeExercises,
      codeExplanation,
      tone
    };

    console.log('Generating book content with ChatGPT...');
    
    const result = await chatgptService.generateBookContent(bookData);

    if (result.success) {
      // Update book with generated content
      book.content = result.content;
      book.status = 'completed';
      book.generationEndTime = new Date();
      book.metadata = result.metadata;
      await book.save();

      console.log('Book generated successfully:', book._id);

      res.json({
        success: true,
        message: 'Book generated successfully!',
        bookId: book._id,
        book: {
          id: book._id,
          title: book.title,
          author: book.author,
          language: book.language,
          level: book.level,
          status: book.status,
          createdAt: book.createdAt
        }
      });
    } else {
      // Mark book as failed
      book.status = 'failed';
      book.generationEndTime = new Date();
      await book.save();

      console.error('Book generation failed:', result.error);
      res.status(500).json({ error: result.error || 'Failed to generate book content' });
    }

  } catch (error) {
    console.error('Book generation error:', error);
    res.status(500).json({ error: 'Failed to generate book. Please try again.' });
  }
});

// Test ChatGPT integration (without authentication)
router.post('/test', async (req, res) => {
  try {
    const testData = {
      title: "Test Python Book",
      author: "Test Author",
      language: "Python",
      level: "Beginner",
      style: "Practical",
      goals: "Learn Python basics",
      topics: ["Introduction to Python", "Variables and Data Types"],
      examplesPerTopic: 2,
      numberOfPages: 30,
      includeTableOfContents: true,
      includeExercises: true,
      codeExplanation: true,
      tone: "Friendly"
    };

    console.log('Testing ChatGPT integration...');
    
    const result = await chatgptService.generateBookContent(testData);

    if (result.success) {
      res.json({
        message: "ChatGPT integration test successful",
        content: result.content,
        metadata: result.metadata
      });
    } else {
      res.status(500).json({ error: result.error || 'Test failed' });
    }

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: 'Test failed' });
  }
});

module.exports = router; 