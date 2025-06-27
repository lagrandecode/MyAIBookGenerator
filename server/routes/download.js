const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const storageService = require('../services/storageService');

// Download book in PDF format
router.get('/pdf/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if PDF already exists
    if (book.files.pdf && book.files.pdf.url) {
      const downloadUrl = await storageService.generatePresignedUrl(book.files.pdf.key);
      return res.json({ downloadUrl });
    }

    // Mock PDF generation for demo
    console.log(`Mock: Generating PDF for book ${bookId}`);
    
    const mockPdfUrl = `https://mock-s3.amazonaws.com/books/${bookId}/book.pdf`;
    
    // Update book with PDF file info
    book.files.pdf = {
      url: mockPdfUrl,
      key: `books/${bookId}/book.pdf`,
      size: 1024 * 1024, // 1MB
      generatedAt: new Date()
    };
    await book.save();

    res.json({ 
      message: 'PDF generated successfully',
      downloadUrl: mockPdfUrl 
    });
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Download book in DOCX format
router.get('/docx/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if DOCX already exists
    if (book.files.docx && book.files.docx.url) {
      const downloadUrl = await storageService.generatePresignedUrl(book.files.docx.key);
      return res.json({ downloadUrl });
    }

    // Mock DOCX generation for demo
    console.log(`Mock: Generating DOCX for book ${bookId}`);
    
    const mockDocxUrl = `https://mock-s3.amazonaws.com/books/${bookId}/book.docx`;
    
    // Update book with DOCX file info
    book.files.docx = {
      url: mockDocxUrl,
      key: `books/${bookId}/book.docx`,
      size: 512 * 1024, // 512KB
      generatedAt: new Date()
    };
    await book.save();

    res.json({ 
      message: 'DOCX generated successfully',
      downloadUrl: mockDocxUrl 
    });
  } catch (error) {
    console.error('DOCX download error:', error);
    res.status(500).json({ error: 'Failed to generate DOCX' });
  }
});

// Download book in EPUB format
router.get('/epub/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if EPUB already exists
    if (book.files.epub && book.files.epub.url) {
      const downloadUrl = await storageService.generatePresignedUrl(book.files.epub.key);
      return res.json({ downloadUrl });
    }

    // Mock EPUB generation for demo
    console.log(`Mock: Generating EPUB for book ${bookId}`);
    
    const mockEpubUrl = `https://mock-s3.amazonaws.com/books/${bookId}/book.epub`;
    
    // Update book with EPUB file info
    book.files.epub = {
      url: mockEpubUrl,
      key: `books/${bookId}/book.epub`,
      size: 768 * 1024, // 768KB
      generatedAt: new Date()
    };
    await book.save();

    res.json({ 
      message: 'EPUB generated successfully',
      downloadUrl: mockEpubUrl 
    });
  } catch (error) {
    console.error('EPUB download error:', error);
    res.status(500).json({ error: 'Failed to generate EPUB' });
  }
});

// Get download status
router.get('/status/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const status = {
      pdf: {
        available: !!book.files.pdf?.url,
        size: book.files.pdf?.size,
        generatedAt: book.files.pdf?.generatedAt
      },
      docx: {
        available: !!book.files.docx?.url,
        size: book.files.docx?.size,
        generatedAt: book.files.docx?.generatedAt
      },
      epub: {
        available: !!book.files.epub?.url,
        size: book.files.epub?.size,
        generatedAt: book.files.epub?.generatedAt
      }
    };

    res.json(status);
  } catch (error) {
    console.error('Download status error:', error);
    res.status(500).json({ error: 'Failed to get download status' });
  }
});

module.exports = router; 