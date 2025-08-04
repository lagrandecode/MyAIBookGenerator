import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, CreditCard } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your AI Book Generator dashboard</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Plus className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Generate New Book</h3>
          </div>
          <p className="text-gray-600 mb-4">Create a new book with AI assistance</p>
          <Link to="/generate" className="btn-primary">
            Start Creating
          </Link>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">My Book Library</h3>
          </div>
          <p className="text-gray-600 mb-4">View, download, and manage your generated books</p>
          <Link to="/library" className="btn-secondary">
            View Library
          </Link>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Credits</h3>
          </div>
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