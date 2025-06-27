const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const User = require('../models/User');
const aiService = require('../services/aiService');
const storageService = require('../services/storageService');

// Generate book outline
router.post('/outline', auth, async (req, res) => {
  try {
    const bookData = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      genre: req.body.genre,
      language: req.body.language || 'english',
      writingStyle: req.body.writingStyle || 'professional',
      targetAudience: req.body.targetAudience || 'general',
      totalChapters: req.body.totalChapters
    };

    // Basic validation
    if (!bookData.title || !bookData.description || !bookData.author || !bookData.genre || !bookData.totalChapters) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate outline using AI
    const outline = await aiService.generateOutline(bookData);

    res.json({
      message: 'Book outline generated successfully',
      outline,
      bookData
    });
  } catch (error) {
    console.error('Outline generation error:', error);
    res.status(500).json({ error: 'Failed to generate book outline' });
  }
});

// Generate complete book
router.post('/book', auth, async (req, res) => {
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
      chapterTitles = [],
      includeCover = true,
      generationSettings = {}
    } = req.body;

    // Basic validation
    if (!title || !description || !author || !genre || !totalChapters) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update AI service settings if provided
    if (generationSettings.temperature || generationSettings.maxTokens) {
      aiService.updateSettings(generationSettings);
    }

    // Create book record
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
      status: 'generating',
      generationStartTime: new Date(),
      generationSettings: {
        ...generationSettings
      }
    });

    // Save book to get ID
    await book.save();

    // Start generation process asynchronously
    generateBookContent(book, chapterTitles, includeCover);

    res.json({
      message: 'Book generation started',
      bookId: book._id,
      status: 'generating',
      progress: 0
    });
  } catch (error) {
    console.error('Book generation error:', error);
    res.status(500).json({ error: 'Failed to start book generation' });
  }
});

// Generate book cover
router.post('/cover', auth, async (req, res) => {
  try {
    const { bookId, style = 'realistic' } = req.body;

    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    // Find book
    const book = await Book.findOne({ _id: bookId, user: req.user._id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Generate cover description
    const coverPrompt = await aiService.generateCoverPrompt(book);
    
    // Generate cover image
    const coverResult = await aiService.generateCoverImage(coverPrompt, style);

    // Update book with cover
    book.coverImage = {
      url: coverResult.url,
      prompt: coverResult.prompt,
      style
    };

    await book.save();

    res.json({
      message: 'Book cover generated successfully',
      cover: book.coverImage
    });
  } catch (error) {
    console.error('Cover generation error:', error);
    res.status(500).json({ error: 'Failed to generate book cover' });
  }
});

// Get generation progress
router.get('/progress/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOne({ _id: bookId, user: req.user._id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const progress = {
      status: book.status,
      progress: book.generationProgress || 0,
      totalChapters: book.totalChapters,
      completedChapters: book.chapters.filter(ch => ch.content).length,
      totalWordCount: book.totalWordCount || 0,
      totalPageCount: book.totalPageCount || 0,
      generationStartTime: book.generationStartTime,
      estimatedTimeRemaining: calculateEstimatedTime(book)
    };

    res.json(progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to get generation progress' });
  }
});

// Regenerate chapter
router.post('/chapter/:bookId/:chapterNumber', auth, async (req, res) => {
  try {
    const { bookId, chapterNumber } = req.params;
    const { chapterTitle } = req.body;

    const book = await Book.findOne({ _id: bookId, user: req.user._id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const chapterIndex = parseInt(chapterNumber) - 1;
    if (chapterIndex < 0 || chapterIndex >= book.totalChapters) {
      return res.status(400).json({ error: 'Invalid chapter number' });
    }

    // Get previous chapters for context
    const previousChapters = book.chapters.slice(0, chapterIndex);

    // Generate new chapter content
    const chapterResult = await aiService.generateChapter(
      book,
      chapterIndex + 1,
      chapterTitle || `Chapter ${chapterIndex + 1}`,
      previousChapters
    );

    // Update or create chapter
    if (book.chapters[chapterIndex]) {
      book.chapters[chapterIndex] = {
        ...book.chapters[chapterIndex],
        title: chapterTitle || `Chapter ${chapterIndex + 1}`,
        content: chapterResult.content,
        wordCount: chapterResult.wordCount,
        pageCount: chapterResult.pageCount,
        tokensUsed: chapterResult.tokensUsed
      };
    } else {
      book.chapters[chapterIndex] = {
        title: chapterTitle || `Chapter ${chapterIndex + 1}`,
        content: chapterResult.content,
        wordCount: chapterResult.wordCount,
        pageCount: chapterResult.pageCount,
        tokensUsed: chapterResult.tokensUsed,
        order: chapterIndex + 1
      };
    }

    // Update book statistics
    book.totalWordCount = book.chapters.reduce((total, ch) => total + (ch.wordCount || 0), 0);
    book.totalPageCount = book.chapters.reduce((total, ch) => total + (ch.pageCount || 0), 0);
    book.generationProgress = Math.round((book.chapters.filter(ch => ch.content).length / book.totalChapters) * 100);

    if (book.generationProgress === 100) {
      book.status = 'completed';
      book.generationEndTime = new Date();
    }

    await book.save();

    res.json({
      message: 'Chapter regenerated successfully',
      chapter: book.chapters[chapterIndex],
      progress: book.generationProgress
    });
  } catch (error) {
    console.error('Chapter regeneration error:', error);
    res.status(500).json({ error: 'Failed to regenerate chapter' });
  }
});

// Helper function to generate complete book content
async function generateBookContent(book, chapterTitles = [], includeCover = true) {
  try {
    // Generate introduction
    const introduction = await aiService.generateIntroduction(book);
    book.introduction = introduction;

    // Generate chapters
    for (let i = 0; i < book.totalChapters; i++) {
      const chapterTitle = chapterTitles[i] || `Chapter ${i + 1}`;
      const previousChapters = book.chapters.slice(0, i);

      const chapterResult = await aiService.generateChapter(
        book,
        i + 1,
        chapterTitle,
        previousChapters
      );

      book.chapters[i] = {
        title: chapterTitle,
        content: chapterResult.content,
        wordCount: chapterResult.wordCount,
        pageCount: chapterResult.pageCount,
        tokensUsed: chapterResult.tokensUsed,
        order: i + 1
      };

      // Update progress
      book.generationProgress = Math.round(((i + 1) / book.totalChapters) * 100);
      await book.save();
    }

    // Generate conclusion
    const conclusion = await aiService.generateConclusion(book, book.chapters);
    book.conclusion = conclusion;

    // Generate cover if requested
    if (includeCover) {
      try {
        const coverPrompt = await aiService.generateCoverPrompt(book);
        const coverResult = await aiService.generateCoverImage(coverPrompt);
        book.coverImage = {
          url: coverResult.url,
          prompt: coverResult.prompt,
          style: 'realistic'
        };
      } catch (coverError) {
        console.error('Cover generation failed:', coverError);
      }
    }

    // Update final statistics
    book.totalWordCount = book.chapters.reduce((total, ch) => total + (ch.wordCount || 0), 0);
    book.totalPageCount = book.chapters.reduce((total, ch) => total + (ch.pageCount || 0), 0);
    book.totalTokensUsed = book.chapters.reduce((total, ch) => total + (ch.tokensUsed || 0), 0);
    book.status = 'completed';
    book.generationProgress = 100;
    book.generationEndTime = new Date();

    await book.save();

    console.log(`Book generation completed: ${book.title}`);
  } catch (error) {
    console.error('Book generation error:', error);
    book.status = 'failed';
    await book.save();
  }
}

// Helper function to calculate estimated time remaining
function calculateEstimatedTime(book) {
  if (!book.generationStartTime || book.status === 'completed') {
    return 0;
  }

  const elapsed = Date.now() - book.generationStartTime.getTime();
  const completedChapters = book.chapters.filter(ch => ch.content).length;
  
  if (completedChapters === 0) {
    return null; // Can't estimate yet
  }

  const avgTimePerChapter = elapsed / completedChapters;
  const remainingChapters = book.totalChapters - completedChapters;
  
  return Math.round(avgTimePerChapter * remainingChapters);
}

module.exports = router; 