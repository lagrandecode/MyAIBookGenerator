const express = require('express');
const { auth } = require('../middleware/auth');
const Book = require('../models/Book');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Download book as PDF or DOCX
router.post('/book/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { format = 'PDF' } = req.body;

    // Find the book in database
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if user owns this book
    if (book.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let fileContent, fileName, mimeType;

    if (format.toUpperCase() === 'PDF') {
      // Generate HTML that can be saved as PDF by the browser
      fileContent = generatePDFHTML(book);
      fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
      mimeType = 'text/html';
    } else if (format.toUpperCase() === 'DOCX') {
      // Generate real DOCX using docx library
      fileContent = await generateRealDOCX(book);
      fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      return res.status(400).json({ error: 'Unsupported format. Use PDF or DOCX' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Send the file content
    res.send(fileContent);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download book' });
  }
});

// Process content to convert **text** patterns to colored HTML
function processContent(content) {
  if (!content) return 'No content available';
  
  // Convert **text** patterns to colored spans based on content type
  let processedContent = content
    .replace(/\*\*(.*?)\*\*/g, (match, text) => {
      // Determine color based on content type
      const lowerText = text.toLowerCase();
      
      // Programming concepts and keywords
      if (lowerText.includes('function') || lowerText.includes('class') || 
          lowerText.includes('method') || lowerText.includes('variable') ||
          lowerText.includes('object') || lowerText.includes('array') ||
          lowerText.includes('string') || lowerText.includes('number') ||
          lowerText.includes('boolean') || lowerText.includes('null') ||
          lowerText.includes('undefined') || lowerText.includes('const') ||
          lowerText.includes('let') || lowerText.includes('var')) {
        return `<span style="color: #e74c3c; font-weight: bold;">${text}</span>`;
      }
      
      // Best practices and tips
      if (lowerText.includes('best practice') || lowerText.includes('tip') ||
          lowerText.includes('recommendation') || lowerText.includes('guideline') ||
          lowerText.includes('important') || lowerText.includes('note') ||
          lowerText.includes('warning') || lowerText.includes('caution')) {
        return `<span style="color: #27ae60; font-weight: bold;">${text}</span>`;
      }
      
      // Advanced topics
      if (lowerText.includes('advanced') || lowerText.includes('complex') ||
          lowerText.includes('optimization') || lowerText.includes('performance') ||
          lowerText.includes('algorithm') || lowerText.includes('pattern') ||
          lowerText.includes('architecture') || lowerText.includes('design')) {
        return `<span style="color: #9b59b6; font-weight: bold;">${text}</span>`;
      }
      
      // Warnings and errors
      if (lowerText.includes('error') || lowerText.includes('exception') ||
          lowerText.includes('bug') || lowerText.includes('fail') ||
          lowerText.includes('crash') || lowerText.includes('invalid')) {
        return `<span style="color: #e67e22; font-weight: bold;">${text}</span>`;
      }
      
      // Default bold styling for other emphasized text
      return `<span style="color: #2c3e50; font-weight: bold;">${text}</span>`;
    });
  
  // Convert code blocks
  processedContent = processedContent.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Convert line breaks
  processedContent = processedContent.replace(/\n/g, '<br>');
  
  return processedContent;
}

// Process content for DOCX with color coding
function processContentForDOCX(content) {
  if (!content) return [];
  
  const lines = content.split('\n');
  const paragraphs = [];
  
  lines.forEach(line => {
    if (!line.trim()) return;
    
    if (line.startsWith('#')) {
      // Headers
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, '');
      paragraphs.push({
        type: 'header',
        text: text,
        level: level
      });
    } else if (line.startsWith('```')) {
      // Code blocks
      const codeText = line.replace(/```/g, '');
      paragraphs.push({
        type: 'code',
        text: codeText
      });
    } else {
      // Regular text with **text** processing
      const spans = [];
      let currentText = line;
      let match;
      let lastIndex = 0;
      
      // Find all **text** patterns
      const regex = /\*\*(.*?)\*\*/g;
      while ((match = regex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          spans.push({
            text: line.substring(lastIndex, match.index),
            bold: false,
            color: '000000'
          });
        }
        
        // Process the matched text
        const matchedText = match[1];
        const lowerText = matchedText.toLowerCase();
        let color = '2c3e50'; // Default dark blue
        
        // Programming concepts and keywords
        if (lowerText.includes('function') || lowerText.includes('class') || 
            lowerText.includes('method') || lowerText.includes('variable') ||
            lowerText.includes('object') || lowerText.includes('array') ||
            lowerText.includes('string') || lowerText.includes('number') ||
            lowerText.includes('boolean') || lowerText.includes('null') ||
            lowerText.includes('undefined') || lowerText.includes('const') ||
            lowerText.includes('let') || lowerText.includes('var')) {
          color = 'e74c3c'; // Red
        }
        // Best practices and tips
        else if (lowerText.includes('best practice') || lowerText.includes('tip') ||
                 lowerText.includes('recommendation') || lowerText.includes('guideline') ||
                 lowerText.includes('important') || lowerText.includes('note') ||
                 lowerText.includes('warning') || lowerText.includes('caution')) {
          color = '27ae60'; // Green
        }
        // Advanced topics
        else if (lowerText.includes('advanced') || lowerText.includes('complex') ||
                 lowerText.includes('optimization') || lowerText.includes('performance') ||
                 lowerText.includes('algorithm') || lowerText.includes('pattern') ||
                 lowerText.includes('architecture') || lowerText.includes('design')) {
          color = '9b59b6'; // Purple
        }
        // Warnings and errors
        else if (lowerText.includes('error') || lowerText.includes('exception') ||
                 lowerText.includes('bug') || lowerText.includes('fail') ||
                 lowerText.includes('crash') || lowerText.includes('invalid')) {
          color = 'e67e22'; // Orange
        }
        
        spans.push({
          text: matchedText,
          bold: true,
          color: color
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        spans.push({
          text: line.substring(lastIndex),
          bold: false,
          color: '000000'
        });
      }
      
      // If no **text** patterns found, add the whole line as normal text
      if (spans.length === 0) {
        spans.push({
          text: line,
          bold: false,
          color: '000000'
        });
      }
      
      paragraphs.push({
        type: 'text',
        text: line,
        spans: spans
      });
    }
  });
  
  return paragraphs;
}

// Generate HTML that can be saved as PDF by the browser
function generatePDFHTML(book) {
  const content = book.content || 'No content available';
  const processedContent = processContent(content);
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${book.title}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body { 
            font-family: 'Times New Roman', serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            font-size: 12pt;
            color: #333;
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 2px solid #3498db; 
            padding-bottom: 10px; 
            font-size: 24pt;
            text-align: center;
            margin-bottom: 20px;
        }
        h2 { 
            color: #34495e; 
            margin-top: 30px; 
            font-size: 18pt;
            page-break-after: avoid;
        }
        h3 { 
            color: #7f8c8d; 
            font-size: 14pt;
            page-break-after: avoid;
        }
        .author { 
            font-style: italic; 
            color: #7f8c8d; 
            margin-bottom: 20px; 
            text-align: center;
            font-size: 14pt;
        }
        .metadata { 
            background: #ecf0f1; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0; 
            border: 1px solid #bdc3c7;
            page-break-inside: avoid;
        }
        .metadata p { 
            margin: 5px 0; 
            font-size: 11pt;
        }
        pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto; 
            border: 1px solid #dee2e6;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            page-break-inside: avoid;
        }
        code { 
            background: #f1f2f6; 
            padding: 2px 4px; 
            border-radius: 3px; 
            font-family: 'Courier New', monospace;
        }
        .content {
            text-align: justify;
        }
        .page-break {
            page-break-before: always;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #7f8c8d;
            border-top: 1px solid #bdc3c7;
            padding-top: 10px;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>${book.title}</h1>
    <div class="author">By ${book.author}</div>
    
    <div class="metadata">
        <p><strong>Programming Language:</strong> ${book.programming_language}</p>
        <p><strong>Level:</strong> ${book.level}</p>
        <p><strong>Style:</strong> ${book.style}</p>
        <p><strong>Pages:</strong> ${book.numberOfPages || 'N/A'}</p>
        <p><strong>Generated:</strong> ${new Date(book.createdAt).toLocaleDateString()}</p>
    </div>

    <div class="content">
        ${processedContent}
    </div>
    
    <div class="footer">
        <p>Generated by AI Book Generator</p>
        <p>${new Date().toISOString()}</p>
    </div>
    
    <div class="no-print" style="position: fixed; top: 10px; right: 10px; background: #3498db; color: white; padding: 10px; border-radius: 5px; font-family: Arial, sans-serif;">
        <p><strong>Instructions:</strong></p>
        <p>1. Press Ctrl+P (or Cmd+P on Mac) to print</p>
        <p>2. Select "Save as PDF" as destination</p>
        <p>3. Click "Save" to download as PDF</p>
    </div>
</body>
</html>`;
}

// Generate real DOCX using docx library
async function generateRealDOCX(book) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: createDOCXContent(book)
    }]
  });

  return await Packer.toBuffer(doc);
}

// Create DOCX content using docx library
function createDOCXContent(book) {
  const content = book.content || 'No content available';
  const paragraphs = [];
  
  // Title
  paragraphs.push(
    new Paragraph({
      text: book.title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );
  
  // Author
  paragraphs.push(
    new Paragraph({
      text: `By ${book.author}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `By ${book.author}`,
          italics: true,
          size: 28
        })
      ]
    })
  );
  
  // Metadata
  const metadataText = [
    `Programming Language: ${book.programming_language}`,
    `Level: ${book.level}`,
    `Style: ${book.style}`,
    `Pages: ${book.numberOfPages || 'N/A'}`,
    `Generated: ${new Date(book.createdAt).toLocaleDateString()}`
  ].join('\n');
  
  paragraphs.push(
    new Paragraph({
      text: metadataText,
      spacing: { before: 400, after: 400 },
      children: [
        new TextRun({
          text: metadataText,
          size: 22
        })
      ]
    })
  );
  
  // Process content for **text** patterns and create colored paragraphs
  const processedContent = processContentForDOCX(content);
  processedContent.forEach(paragraphData => {
    if (paragraphData.type === 'header') {
      paragraphs.push(
        new Paragraph({
          text: paragraphData.text,
          heading: paragraphData.level === 1 ? HeadingLevel.HEADING_1 : 
                   paragraphData.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
          spacing: { before: 400, after: 200 }
        })
      );
    } else if (paragraphData.type === 'code') {
      paragraphs.push(
        new Paragraph({
          text: paragraphData.text,
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: paragraphData.text,
              font: 'Courier New',
              size: 20
            })
          ]
        })
      );
    } else {
      // Regular text with colored spans
      const children = paragraphData.spans.map(span => 
        new TextRun({
          text: span.text,
          size: 24,
          bold: span.bold,
          color: span.color
        })
      );
      
      paragraphs.push(
        new Paragraph({
          text: paragraphData.text,
          spacing: { after: 200 },
          children: children
        })
      );
    }
  });
  
  // Footer
  paragraphs.push(
    new Paragraph({
      text: 'Generated by AI Book Generator',
      alignment: AlignmentType.CENTER,
      spacing: { before: 800 },
      children: [
        new TextRun({
          text: 'Generated by AI Book Generator',
          size: 20,
          color: '666666'
        })
      ]
    })
  );
  
  paragraphs.push(
    new Paragraph({
      text: new Date().toISOString(),
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: new Date().toISOString(),
          size: 18,
          color: '666666'
        })
      ]
    })
  );
  
  return paragraphs;
}

// Get user's book library
router.get('/library', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id })
      .select('title author programming_language level style numberOfPages createdAt status')
      .sort({ createdAt: -1 });

    res.json({ books });
  } catch (error) {
    console.error('Library error:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

// Delete a book from library
router.delete('/book/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if user owns this book
    if (book.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Book.findByIdAndDelete(bookId);
    res.json({ message: 'Book deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router; 