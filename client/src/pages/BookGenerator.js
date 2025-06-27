import React from 'react';
import { Link } from 'react-router-dom';

const BookGenerator = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Your Book</h1>
        <p className="text-gray-600">Create a complete book with AI assistance</p>
      </div>
      
      <div className="card p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Book Generation Form
          </h2>
          <p className="text-gray-600 mb-6">
            This form will be implemented when you connect the backend. 
            You'll be able to specify book details, chapters, and generate content with AI.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookGenerator; 