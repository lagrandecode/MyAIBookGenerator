// const mongoose = require('mongoose');

// const chapterSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   wordCount: {
//     type: Number,
//     default: 0
//   },
//   pageCount: {
//     type: Number,
//     default: 0
//   },
//   order: {
//     type: Number,
//     required: true
//   },
//   isGenerated: {
//     type: Boolean,
//     default: false
//   },
//   generationTime: {
//     type: Date
//   }
// }, { timestamps: true });

// const bookSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   description: {
//     type: String,
//     required: true,
//     maxlength: 2000
//   },
//   author: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   genre: {
//     type: String,
//     required: true,
//     enum: [
//       'fiction', 'non-fiction', 'science-fiction', 'fantasy', 'romance', 
//       'mystery', 'thriller', 'horror', 'biography', 'autobiography', 
//       'self-help', 'business', 'cookbook', 'travel', 'history', 
//       'philosophy', 'religion', 'children', 'young-adult', 'poetry',
//       'drama', 'comedy', 'adventure', 'western', 'war', 'sports',
//       'education', 'technology', 'health', 'fitness', 'art', 'music'
//     ]
//   },
//   language: {
//     type: String,
//     default: 'english',
//     enum: [
//       'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
//       'russian', 'chinese', 'japanese', 'korean', 'arabic', 'hindi',
//       'dutch', 'swedish', 'norwegian', 'danish', 'finnish', 'polish',
//       'czech', 'hungarian', 'romanian', 'bulgarian', 'greek', 'turkish',
//       'hebrew', 'persian', 'thai', 'vietnamese', 'indonesian', 'malay'
//     ]
//   },
//   writingStyle: {
//     type: String,
//     default: 'professional',
//     enum: [
//       'professional', 'casual', 'academic', 'conversational', 'formal',
//       'creative', 'technical', 'poetic', 'humorous', 'dramatic',
//       'simple', 'complex', 'descriptive', 'narrative'
//     ]
//   },
//   targetAudience: {
//     type: String,
//     default: 'general',
//     enum: [
//       'children', 'young-adult', 'adult', 'senior', 'academic',
//       'professional', 'general', 'expert', 'beginner'
//     ]
//   },
//   chapters: [chapterSchema],
//   totalChapters: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 50
//   },
//   estimatedWordCount: {
//     type: Number,
//     default: 0
//   },
//   estimatedPageCount: {
//     type: Number,
//     default: 0
//   },
//   coverImage: {
//     url: String,
//     publicId: String,
//     prompt: String,
//     style: String
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'generating', 'completed', 'failed', 'archived'],
//     default: 'draft'
//   },
//   generationProgress: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   generationStartTime: {
//     type: Date
//   },
//   generationEndTime: {
//     type: Date
//   },
//   files: {
//     pdf: {
//       url: String,
//       size: Number,
//       generatedAt: Date
//     },
//     docx: {
//       url: String,
//       size: Number,
//       generatedAt: Date
//     },
//     epub: {
//       url: String,
//       size: Number,
//       generatedAt: Date
//     }
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }],
//   isPublic: {
//     type: Boolean,
//     default: false
//   },
//   rating: {
//     average: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5
//     },
//     count: {
//       type: Number,
//       default: 0
//     }
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   downloads: {
//     type: Number,
//     default: 0
//   },
//   aiModel: {
//     type: String,
//     default: 'gpt-4'
//   },
//   generationSettings: {
//     temperature: {
//       type: Number,
//       default: 0.7,
//       min: 0,
//       max: 2
//     },
//     maxTokens: {
//       type: Number,
//       default: 4000
//     },
//     includeTableOfContents: {
//       type: Boolean,
//       default: true
//     },
//     includeIntroduction: {
//       type: Boolean,
//       default: true
//     },
//     includeConclusion: {
//       type: Boolean,
//       default: true
//     }
//   }
// }, {
//   timestamps: true
// });

// // Indexes for better query performance
// bookSchema.index({ userId: 1, createdAt: -1 });
// bookSchema.index({ genre: 1, status: 1 });
// bookSchema.index({ title: 'text', description: 'text' });

// // Virtual for total word count
// bookSchema.virtual('totalWordCount').get(function() {
//   return this.chapters.reduce((total, chapter) => total + chapter.wordCount, 0);
// });

// // Virtual for total page count
// bookSchema.virtual('totalPageCount').get(function() {
//   return this.chapters.reduce((total, chapter) => total + chapter.pageCount, 0);
// });

// // Virtual for generation duration
// bookSchema.virtual('generationDuration').get(function() {
//   if (this.generationStartTime && this.generationEndTime) {
//     return this.generationEndTime - this.generationStartTime;
//   }
//   return null;
// });

// // Method to update generation progress
// bookSchema.methods.updateProgress = function() {
//   const completedChapters = this.chapters.filter(chapter => chapter.isGenerated).length;
//   this.generationProgress = Math.round((completedChapters / this.totalChapters) * 100);
//   
//   if (this.generationProgress === 100) {
//     this.status = 'completed';
//     this.generationEndTime = new Date();
//   }
// };

// // Method to calculate word count
// bookSchema.methods.calculateWordCount = function() {
//   this.estimatedWordCount = this.chapters.reduce((total, chapter) => {
//     return total + (chapter.content ? chapter.content.split(' ').length : 0);
//   }, 0);
//   
//   // Estimate page count (average 250 words per page)
//   this.estimatedPageCount = Math.ceil(this.estimatedWordCount / 250);
// };

// // Pre-save middleware to update word count
// bookSchema.pre('save', function(next) {
//   if (this.chapters && this.chapters.length > 0) {
//     this.calculateWordCount();
//   }
//   next();
// });

// module.exports = mongoose.model('Book', bookSchema);

// Mock Book model for demo
class MockBook {
  constructor(data = {}) {
    this._id = data._id || 'mock-book-id';
    this.title = data.title || 'Sample Book';
    this.author = data.author || 'Sample Author';
    this.description = data.description || 'A sample book description';
    this.genre = data.genre || 'fiction';
    this.language = data.language || 'english';
    this.writingStyle = data.writingStyle || 'formal';
    this.targetAudience = data.targetAudience || 'adult';
    this.totalChapters = data.totalChapters || 5;
    this.chapters = data.chapters || [];
    this.introduction = data.introduction || '';
    this.conclusion = data.conclusion || '';
    this.coverImage = data.coverImage || {};
    this.files = data.files || {};
    this.status = data.status || 'completed';
    this.generationProgress = data.generationProgress || 100;
    this.totalWordCount = data.totalWordCount || 5000;
    this.totalPageCount = data.totalPageCount || 20;
    this.totalTokensUsed = data.totalTokensUsed || 0;
    this.user = data.user || 'mock-user-id';
    this.isPublic = data.isPublic || false;
    this.tags = data.tags || [];
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  addChapter(chapterData) {
    this.chapters.push({
      ...chapterData,
      order: this.chapters.length + 1
    });
    return this;
  }

  updateChapter(chapterIndex, chapterData) {
    if (this.chapters[chapterIndex]) {
      this.chapters[chapterIndex] = { ...this.chapters[chapterIndex], ...chapterData };
    }
    return this;
  }

  removeChapter(chapterIndex) {
    this.chapters.splice(chapterIndex, 1);
    this.chapters.forEach((chapter, index) => {
      chapter.order = index + 1;
    });
    return this;
  }

  getSummary() {
    return {
      id: this._id,
      title: this.title,
      author: this.author,
      genre: this.genre,
      status: this.status,
      totalChapters: this.chapters.length,
      totalWordCount: this.totalWordCount,
      totalPageCount: this.totalPageCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static async findById(id) {
    return new MockBook({ _id: id });
  }

  static async find(query = {}) {
    return [new MockBook()];
  }

  static async create(data) {
    return new MockBook(data);
  }

  async save() {
    return this;
  }
}

module.exports = MockBook; 