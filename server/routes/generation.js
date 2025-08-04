const express = require('express');
const { auth } = require('../middleware/auth');
const Book = require('../models/Book');
const chatgptService = require('../services/chatgptService');

const router = express.Router();

// Generate a complete book
router.post('/book', auth, async (req, res) => {
  try {
    console.log('📦 Request payload:', req.body);
    console.log('🔍 User ID:', req.user.id);
    
    const {
      title,
      author,
      programming_language,
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
    if (!title || !author || !programming_language || !level || !style || !goals || !topics) {
      console.log('❌ Missing required fields:', { title, author, programming_language, level, style, goals, topics });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('✅ All required fields present');

    // Create book record in database
    const book = new Book({
      userId: req.user.id,
      title,
      author,
      programming_language,
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

    console.log('💾 Saving book to database...');
    await book.save();
    console.log('✅ Book saved with ID:', book._id);

    // Generate book content using ChatGPT
    const bookData = {
      title,
      author,
      programming_language,
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

    console.log('🤖 Generating book content with ChatGPT...');
    console.log('📝 Book data sent to ChatGPT:', bookData);
    
    let result;
    try {
      result = await chatgptService.generateBookContent(bookData);
      console.log('📊 ChatGPT result:', { success: result.success, contentLength: result.content?.length || 0 });
    } catch (error) {
      console.error('💥 ChatGPT service error:', error);
      throw error;
    }

    if (result.success) {
      // Update book with generated content
      console.log('✅ ChatGPT generation successful, updating book...');
      book.content = result.content;
      book.status = 'completed';
      book.generationEndTime = new Date();
      book.metadata = result.metadata;
      await book.save();

      console.log('🎉 Book generated successfully:', book._id);

      res.json({
        success: true,
        message: 'Book generated successfully!',
        bookId: book._id,
        book: {
          id: book._id,
          title: book.title,
          author: book.author,
          programming_language: book.programming_language,
          level: book.level,
          status: book.status,
          createdAt: book.createdAt
        }
      });
    } else {
      // Mark book as failed
      console.log('❌ ChatGPT generation failed, marking book as failed...');
      book.status = 'failed';
      book.generationEndTime = new Date();
      await book.save();

      console.error('Book generation failed:', result.error);
      res.status(500).json({ error: result.error || 'Failed to generate book content' });
    }

  } catch (error) {
    console.error('💥 Book generation error:', error);
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's an OpenAI quota error
    if (error.message && error.message.includes('quota')) {
      res.status(500).json({ 
        error: 'OpenAI API quota exceeded. Please add credits to your account or try again later.',
        details: 'Your OpenAI account has run out of credits. Visit https://platform.openai.com/account/billing to add more credits.'
      });
    } else if (error.message && error.message.includes('429')) {
      res.status(500).json({ 
        error: 'OpenAI API rate limit exceeded. Please wait a moment and try again.',
        details: 'Too many requests to OpenAI API. Please wait a few minutes before trying again.'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate book. Please try again.',
        details: error.message || 'Unknown error occurred'
      });
    }
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
    
    // Check if it's an OpenAI quota error
    if (error.message && error.message.includes('quota')) {
      res.status(500).json({ 
        error: 'OpenAI API quota exceeded. Please add credits to your account.',
        details: 'Your OpenAI account has run out of credits. Visit https://platform.openai.com/account/billing to add more credits.'
      });
    } else if (error.message && error.message.includes('429')) {
      res.status(500).json({ 
        error: 'OpenAI API rate limit exceeded. Please wait a moment and try again.',
        details: 'Too many requests to OpenAI API. Please wait a few minutes before trying again.'
      });
    } else {
      res.status(500).json({ 
        error: 'Test failed',
        details: error.message || 'Unknown error occurred'
      });
    }
  }
});

module.exports = router; 