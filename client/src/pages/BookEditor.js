import React from 'react';
import { Link } from 'react-router-dom';

const BookEditor = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book Editor</h1>
        <p className="text-gray-600">Edit and refine your generated book</p>
      </div>
      
      <div className="card p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Book Editing Interface
          </h2>
          <p className="text-gray-600 mb-6">
            This editor will be implemented when you connect the backend. 
            You'll be able to edit chapters, regenerate content, and customize your book.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookEditor; 