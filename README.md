# AI Book Generator

An AI-powered book generation platform that allows users to create complete books with custom content, chapters, and AI-generated covers. Built with React.js frontend and Express.js backend.

## 🚀 Features

### Core Features
- **AI-Powered Content Generation**: Generate complete books using advanced AI models
- **Custom Book Configuration**: Set title, description, chapters, author, and genre
- **AI-Generated Book Covers**: Create stunning covers with AI image generation
- **Multiple Export Formats**: Download books in PDF, DOCX, and EPUB formats
- **User Authentication**: Secure login/signup system
- **Progress Tracking**: Real-time book generation status

### Advanced Features
- **Genre Selection**: Choose from various genres (Fiction, Non-fiction, Sci-fi, Romance, etc.)
- **Writing Style Options**: Select different writing tones and styles
- **Chapter Customization**: Specify chapter titles and lengths
- **Cover Customization**: Regenerate covers until perfect
- **Book Library**: Save and manage your generated books
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API communication
- **React Hook Form** - Form handling

### Backend
- **Express.js** - Server framework
- **Node.js** - Runtime environment
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **PDFKit** - PDF generation
- **docx** - DOCX generation

### AI Services
- **OpenAI API** - Content generation (GPT-4)
- **DALL-E** - Image generation for covers
- **Stability AI** - Alternative image generation

### Storage
- **AWS S3** - File storage
- **Cloudinary** - Image hosting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-book-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create `.env` files in both `server/` and `client/` directories:

   **server/.env:**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_s3_bucket_name
   ```

   **client/.env:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🏗️ Project Structure

```
ai-book-generator/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/           # Utility functions
│   └── package.json
├── package.json
└── README.md
```

## 🎯 Usage

1. **Sign up/Login** to your account
2. **Create a new book** by filling out the book details form
3. **Configure chapters** - specify number and titles
4. **Generate content** - AI will create your book
5. **Customize cover** - Generate and regenerate until perfect
6. **Download** your book in preferred format

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Books
- `POST /api/books` - Create new book
- `GET /api/books` - Get user's books
- `GET /api/books/:id` - Get specific book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Generation
- `POST /api/generate/content` - Generate book content
- `POST /api/generate/cover` - Generate book cover
- `GET /api/download/:format/:bookId` - Download book

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@aibookgenerator.com or create an issue in the repository. 