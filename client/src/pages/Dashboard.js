import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your AI Book Generator dashboard</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate New Book</h3>
          <p className="text-gray-600 mb-4">Create a new book with AI assistance</p>
          <Link to="/generate" className="btn-primary">
            Start Creating
          </Link>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Books</h3>
          <p className="text-gray-600 mb-4">View and manage your generated books</p>
          <div className="text-gray-500">Coming soon...</div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Credits</h3>
          <p className="text-gray-600 mb-4">Manage your book generation credits</p>
          <Link to="/pricing" className="btn-secondary">
            Buy Credits
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 